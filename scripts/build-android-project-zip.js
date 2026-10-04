import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createProjectZip() {
  const zip = new JSZip();
  const root = zip.folder("JesusPrayerApp");

  // settings.gradle.kts
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

  // build.gradle.kts (project level)
  root.file("build.gradle.kts", `plugins {
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}
`);

  // gradle.properties
  root.file("gradle.properties", `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`);

  // gradle-wrapper.properties
  const gradleWrapper = root.folder("gradle").folder("wrapper");
  gradleWrapper.file("gradle-wrapper.properties", `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`);

  // gradlew & gradlew.bat
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

  // GitHub Actions Workflow for automatic APK build in cloud
  const github = root.folder(".github").folder("workflows");
  github.file("build-apk.yml", `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
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

  // app/build.gradle.kts
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
        versionCode = 1
        versionName = "1.0"

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

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    debugImplementation("androidx.compose.ui:ui-tooling")
}
`);

  app.file("proguard-rules.pro", `-dontwarn java.awt.**`);

  // AndroidManifest.xml
  const srcMain = app.folder("src").folder("main");
  srcMain.file("AndroidManifest.xml", `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.JesusPrayer">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.JesusPrayer">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`);

  // MainActivity.kt (Christian Jesus Prayer & Arrow Prayers in Jetpack Compose)
  const pkgFolder = srcMain.folder("java").folder("com").folder("example").folder("jesusprayer");
  pkgFolder.file("MainActivity.kt", `package com.example.jesusprayer

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

val CairoFont = FontFamily(Font(R.font.cairo_regular, FontWeight.Normal))
val AmiriFont = FontFamily(Font(R.font.amiri_regular, FontWeight.Normal))

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = Color(0xFF080D1A)
                    ) {
                        JesusPrayerScreen()
                    }
                }
            }
        }
    }
}

@Composable
fun JesusPrayerScreen() {
    val prayers = listOf(
        "يا ربي يسوع المسيح ابن الله الحي صَيِّرني إنساناً جديداً",
        "يا ربي يسوع المسيح، ارحمني أنا الخاطئ",
        "يا ربي يسوع المسيح، أعني واحفظني في رضاك",
        "يا يسوع الحبيب، نَقِّ قلبي وثبّت فكري فيك",
        "الرب نوري وخلاصي ممن أخاف، الرب حصن حياتي ممن أرتعب",
        "قلباً نقيّاً اخلق فيّ يا الله، وروحاً مستقيماً جدّد في أحشائي"
    )

    var currentPrayerIndex by remember { mutableStateOf(0) }
    var counter by remember { mutableStateOf(0) }
    var isFavorite by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // 1. Top Bar
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                color = Color(0xFF0E172A),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.padding(2.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Favorite,
                        contentDescription = "المحفوظات",
                        tint = Color(0xFFF43F5E),
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "المحفوظات",
                        color = Color.White,
                        fontSize = 12.sp,
                        fontFamily = CairoFont
                    )
                }
            }

            Surface(
                color = Color(0xFF0E172A),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.size(42.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = "الإعدادات",
                        tint = Color(0xFF94A3B8),
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }

        // 2. Category Selector & Prayer Card
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Surface(
                color = Color(0xFF0E172A),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "📖 الطلبات: الصلاة السهمية",
                        fontFamily = CairoFont,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFF59E0B)
                    )
                    Text(text = "▼", color = Color(0xFF94A3B8), fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0E172A)),
                shape = RoundedCornerShape(24.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp).fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        IconButton(onClick = { isFavorite = !isFavorite }) {
                            Icon(
                                imageVector = if (isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                contentDescription = "Favorite",
                                tint = if (isFavorite) Color(0xFFF43F5E) else Color(0xFF94A3B8)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "\\"" + prayers[currentPrayerIndex] + "\\"",
                        fontFamily = AmiriFont,
                        fontSize = 24.sp,
                        lineHeight = 40.sp,
                        color = Color(0xFFF59E0B),
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    Text(
                        text = "🎨 مشاركة كصورة",
                        fontFamily = CairoFont,
                        fontSize = 12.sp,
                        color = Color(0xFF94A3B8)
                    )
                }
            }
        }

        // 3. Circular Rosary Counter & Navigation
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(bottom = 16.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(170.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xFFF59E0B), Color(0xFFD97706))
                        )
                    )
                    .clickable { counter++ },
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = counter.toString(),
                        fontSize = 48.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFF080D1A)
                    )
                    Text(
                        text = "اضغط للعد",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF080D1A),
                        fontFamily = CairoFont
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "تصفير العداد",
                    color = Color(0xFF38BDF8),
                    fontSize = 13.sp,
                    fontFamily = CairoFont,
                    modifier = Modifier.clickable { counter = 0 }
                )

                Surface(
                    color = Color(0xFF16233B),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.clickable {
                        currentPrayerIndex = (currentPrayerIndex + 1) % prayers.size
                    }
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "الصلاة التالية",
                            tint = Color(0xFF38BDF8),
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "الصلاة التالية",
                            color = Color.White,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = CairoFont
                        )
                    }
                }
            }
        }
    }
}
`);

  // Resources
  const res = srcMain.folder("res");

  // Font files
  const fontFolder = res.folder("font");
  const cairoPath = path.resolve("android_template/res/font/cairo_regular.ttf");
  const amiriPath = path.resolve("android_template/res/font/amiri_regular.ttf");

  if (fs.existsSync(cairoPath)) {
    fontFolder.file("cairo_regular.ttf", fs.readFileSync(cairoPath));
  }
  if (fs.existsSync(amiriPath)) {
    fontFolder.file("amiri_regular.ttf", fs.readFileSync(amiriPath));
  }

  // Values
  const valuesFolder = res.folder("values");
  valuesFolder.file("strings.xml", `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">JesusPrayer</string>
</resources>
`);

  valuesFolder.file("themes.xml", `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.JesusPrayer" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#080D1A</item>
        <item name="android:navigationBarColor">#080D1A</item>
    </style>
</resources>
`);

  // Drawables
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
    <!-- Golden Cross -->
    <path
        android:fillColor="#F59E0B"
        android:pathData="M50,20h8v68h-8z M32,38h44v8h-44z" />
</vector>
`);

  // Mipmap
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

  const content = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPath = path.join(publicDir, 'JesusPrayer-Android-Project.zip');
  fs.writeFileSync(outPath, content);
  fs.writeFileSync(path.join(publicDir, 'PrayerApp-Android-Project.zip'), content);
  console.log('Project ZIP created successfully at:', outPath, 'Size:', (content.length / 1024 / 1024).toFixed(2), 'MB');
}

createProjectZip().catch(err => {
  console.error('Error creating zip:', err);
  process.exit(1);
});
