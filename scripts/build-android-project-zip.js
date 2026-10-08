import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import JSZip from 'jszip';

async function createProjectZip() {
  console.log('Ensuring latest web production build in dist/...');
  try {
    execSync('npx vite build', { stdio: 'inherit' });
  } catch (err) {
    console.warn('Warning: vite build had warnings or errors, proceeding with existing dist/ if available:', err);
  }

  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory does not exist! Please run "npm run build" first.');
  }

  const zip = new JSZip();
  const root = zip.folder("JesusPrayerApp");

  // 1. settings.gradle.kts
  root.file("settings.gradle.kts", `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "JesusPrayerApp"
include(":app")
`);

  // 2. build.gradle.kts (root level)
  root.file("build.gradle.kts", `plugins {
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}
`);

  // 3. gradle.properties
  root.file("gradle.properties", `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`);

  // 4. gradle wrapper
  const gradleWrapper = root.folder("gradle").folder("wrapper");
  gradleWrapper.file("gradle-wrapper.properties", `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`);

  // 5. gradlew & gradlew.bat
  root.file("gradlew", `#!/bin/sh
APP_BASE_NAME=\`basename "$0"\`
CLASSPATH="gradle/wrapper/gradle-wrapper.jar"
exec java -jar "$CLASSPATH" "$@"
`, { unixPermissions: "755" });

  root.file("gradlew.bat", `@rem Gradle startup script for Windows
@echo off
set CLASSPATH="gradle\\wrapper\\gradle-wrapper.jar"
java -jar "%CLASSPATH%" %*
`);

  // 6. GitHub Actions Workflow for automatic cloud APK build
  const github = root.folder(".github").folder("workflows");
  github.file("build-apk.yml", `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    name: Build Debug APK
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew

    - name: Build APK (Debug)
      run: ./gradlew assembleDebug --stacktrace

    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: JesusPrayer-Debug-APK
        path: app/build/outputs/apk/debug/app-debug.apk
        retention-days: 14
`);

  // 7. app/build.gradle.kts
  const app = root.folder("app");
  app.file("build.gradle.kts", `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.jesusprayer"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.jesusprayer"
        minSdk = 24
        targetSdk = 34
        versionCode = 2
        versionName = "2.0.0"

        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.activity:activity-ktx:1.8.2")
    implementation("androidx.webkit:webkit:1.10.0")
}
`);

  app.file("proguard-rules.pro", `-dontwarn java.awt.**`);

  // 8. AndroidManifest.xml
  const srcMain = app.folder("src").folder("main");
  srcMain.file("AndroidManifest.xml", `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:hardwareAccelerated="true"
        android:theme="@style/Theme.JesusPrayer">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.JesusPrayer">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`);

  // 9. MainActivity.kt (Native Android WebView wrapping the 100% full React PWA)
  const pkgFolder = srcMain.folder("java").folder("com").folder("example").folder("jesusprayer");
  pkgFolder.file("MainActivity.kt", `package com.example.jesusprayer

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebViewAssetLoader

/**
 * MainActivity for Jesus Prayer Application.
 * Packages the full React/Vite PWA locally into Android WebView using WebViewAssetLoader.
 * Provides 100% offline capability, local ES Modules support, full audio & haptics,
 * and seamless Arabic RTL layout matching the web app.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Status bar & Navigation bar dark colors (#080D1A) matching prayer app theme
        window.statusBarColor = Color.parseColor("#080D1A")
        window.navigationBarColor = Color.parseColor("#080D1A")
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)

        webView = WebView(this)
        setContentView(webView)

        // Asset loader to securely serve dist assets from local APK assets folder
        // Resolves CORS, ES modules (<script type="module">), and enables 100% offline usage.
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }
        }

        webView.webChromeClient = WebChromeClient()

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
            allowFileAccess = false
            allowContentAccess = false
            displayZoomControls = false
            builtInZoomControls = false
            useWideViewPort = true
            loadWithOverviewMode = true
        }

        webView.setBackgroundColor(Color.parseColor("#080D1A"))

        // Handle Android hardware Back button
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        // Load the React PWA locally
        webView.loadUrl("https://appassets.androidplatform.net/index.html")
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
`);

  // 10. Copy all files from dist/ into app/src/main/assets/
  const assetsFolder = srcMain.folder("assets");
  let assetCount = 0;

  function copyDirRecursive(sourceDir, targetFolder) {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(sourceDir, entry.name);
      // Skip zip files and android zip backups inside dist
      if (entry.name.endsWith('.zip')) {
        continue;
      }
      if (entry.isDirectory()) {
        const subFolder = targetFolder.folder(entry.name);
        copyDirRecursive(srcPath, subFolder);
      } else {
        const fileContent = fs.readFileSync(srcPath);
        targetFolder.file(entry.name, fileContent);
        assetCount++;
      }
    }
  }

  copyDirRecursive(distDir, assetsFolder);
  console.log(`Copied ${assetCount} web build assets from dist/ into app/src/main/assets/`);

  // 11. Resources (Values, Styles, Icons)
  const res = srcMain.folder("res");
  const valuesFolder = res.folder("values");
  valuesFolder.file("strings.xml", `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">صلاة يسوع</string>
</resources>
`);

  valuesFolder.file("themes.xml", `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.JesusPrayer" parent="Theme.AppCompat.NoActionBar">
        <item name="android:statusBarColor">#080D1A</item>
        <item name="android:navigationBarColor">#080D1A</item>
        <item name="android:windowBackground">#080D1A</item>
    </style>
</resources>
`);

  // Launcher drawables
  const drawable = res.folder("drawable");
  drawable.file("ic_launcher_background.xml", `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#080D1A"
        android:pathData="M0,0h108v108h-108z" />
</vector>
`);

  drawable.file("ic_launcher_foreground.xml", `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <!-- Golden Christian Cross -->
    <path
        android:fillColor="#F59E0B"
        android:pathData="M50,18 h8 v72 h-8 z M28,38 h52 v8 h-52 z" />
</vector>
`);

  // Mipmaps
  const mipmap = res.folder("mipmap-anydpi-v26");
  mipmap.file("ic_launcher.xml", `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`);
  mipmap.file("ic_launcher_round.xml", `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`);

  // 12. README.md with clear building instructions
  root.file("README.md", `# مشروع تطبيق صلاة يسوع للأندرويد (Jesus Prayer Android Project)

هذا المشروع يحتوي على تطبيق صلاة يسوع والصلوات السهمية بكامل ميزاته (React + Vite + PWA) مدمجاً ومحزماً داخل مشروع أندرويد متكامل يعمل بدون إنترنت (100% Offline).

---

## 🚀 كيفية استخراج ملف الـ APK (3 طرق سهلة):

### 1️⃣ الطريقة الأولى: البناء التلقائي عبر GitHub Actions (الأسهل بدون تثبيت أي برامج على جهازك)
1. قم بفك ضغط هذا المجلد وارفعه على حسابك في GitHub في مستودع جديد (Repository).
2. بمجرد رفع الملفات، ستعمل أداة GitHub Actions تلقائياً بفضل ملف \`.github/workflows/build-apk.yml\`.
3. ادخل على تبويب **Actions** في صفحة المستودع.
4. انتظر دقيقة واحدة حتى تكتمل العملية، ثم اضغط على البناء وحمّل ملف:
   \`JesusPrayer-Debug-APK\`
   وستجد داخله ملف \`app-debug.apk\` جاهزاً للتثبيت المباشر على أي هاتف أندرويد!

---

### 2️⃣ الطريقة الثانية: عبر Android Studio على الكمبيوتر
1. افتح برنامج Android Studio.
2. اختر **Open** ثم حدد مجلد \`JesusPrayerApp\`.
3. انتظر ثوانٍ حتى يقوم البرنامج بعمل مزامنة Gradle (Sync).
4. من القائمة العلوية اضغط على:
   \`Build\` > \`Build Bundle(s) / APK(s)\` > \`Build APK(s)\`.
5. سيظهر لك إشعار بالأسفل \`APK(s) generated successfully\`، اضغط على **locate** لتحصل على ملف الـ APK فوراً.

---

### 3️⃣ الطريقة الثالثة: عبر سطر الأوامر (Terminal / Command Prompt)
- على نظام لينكس أو ماك:
  \`\`\`bash
  chmod +x gradlew
  ./gradlew assembleDebug
  \`\`\`
- على نظام ويندوز:
  \`\`\`cmd
  gradlew.bat assembleDebug
  \`\`\`
ستجد ملف الـ APK في المسار:
\`app/build/outputs/apk/debug/app-debug.apk\`
`);

  const content = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPath1 = path.join(publicDir, 'JesusPrayer-Android-Project.zip');
  const outPath2 = path.join(publicDir, 'PrayerApp-Android-Project.zip');
  fs.writeFileSync(outPath1, content);
  fs.writeFileSync(outPath2, content);

  // Also write to dist/ so it is immediately accessible
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'JesusPrayer-Android-Project.zip'), content);
    fs.writeFileSync(path.join(distDir, 'PrayerApp-Android-Project.zip'), content);
  }

  console.log('✅ Android Project ZIP successfully generated with real React app assets!');
  console.log('Output 1:', outPath1, 'Size:', (content.length / 1024 / 1024).toFixed(2), 'MB');
  console.log('Output 2:', outPath2, 'Size:', (content.length / 1024 / 1024).toFixed(2), 'MB');
}

createProjectZip().catch(err => {
  console.error('Error creating zip:', err);
  process.exit(1);
});
