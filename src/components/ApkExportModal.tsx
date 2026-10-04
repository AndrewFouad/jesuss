import React, { useState } from 'react';
import { 
  Download, 
  Terminal, 
  Github, 
  Smartphone, 
  Check, 
  Copy, 
  X, 
  ExternalLink, 
  Layers, 
  FileCode, 
  CheckCircle2, 
  Sparkles,
  Cpu,
  Package
} from 'lucide-react';

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPwa: () => void;
  isPwaInstallable: boolean;
  onOpenIconModal?: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({
  isOpen,
  onClose,
  onInstallPwa,
  isPwaInstallable,
  onOpenIconModal
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'github' | 'terminal' | 'code'>('download');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedCodeFile, setSelectedCodeFile] = useState<'main' | 'gradle' | 'manifest' | 'workflow'>('main');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const mainActivityCode = `package com.example.prayerapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// تعريف الخطوط المحلية من res/font/
val CairoFont = FontFamily(
    Font(R.font.cairo_regular, FontWeight.Normal)
)
val AmiriFont = FontFamily(
    Font(R.font.amiri_regular, FontWeight.Normal)
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = Color(0xFF020617)
                    ) {
                        PrayerHomeScreen()
                    }
                }
            }
        }
    }
}

@Composable
fun PrayerHomeScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(24.dp)
                    .fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "الصلاة القادمة: العصر",
                    fontFamily = CairoFont,
                    fontSize = 20.sp,
                    color = Color(0xFF94A3B8)
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "03:45 م",
                    fontFamily = CairoFont,
                    fontSize = 40.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "﴿ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا ﴾",
                    fontFamily = AmiriFont,
                    fontSize = 18.sp,
                    color = Color(0xFFCBD5E1)
                )
            }
        }
    }
}`;

  const gradleCode = `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.prayerapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.prayerapp"
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
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")
}`;

  const manifestCode = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.PrayerApp">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.PrayerApp">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`;

  const workflowCode = `name: Build Android APK
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle
    - run: chmod +x gradlew
    - run: ./gradlew assembleDebug --stacktrace
    - uses: actions/upload-artifact@v4
      with:
        name: PrayerApp-Debug-APK
        path: app/build/outputs/apk/debug/app-debug.apk`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cairo text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                مركز توليد وتصدير APK أندرويد
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                  جاهز للتحميل
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-cairo">
                مشروع Android Studio كامل مع خطوط Cairo و Amiri مدمجة وشهادات التجميع
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto text-xs sm:text-sm font-cairo">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'download'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>مشروع Android Studio (.ZIP)</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'github'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>بناء سحابي (GitHub Actions)</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'terminal'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>أمر Gradle السريع</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>معاينة الأكواد المصدرية</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-cairo">
          
          {/* TAB 1: DOWNLOAD ANDROID STUDIO PROJECT */}
          {activeTab === 'download' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-right">
                  <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2 justify-center sm:justify-start">
                    <Sparkles className="w-4 h-4" />
                    حزمة مشروع أندرويد ستوديو الشاملة (جاهزة 100%)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                    تحتوي على ملفات الخطوط الأصلية (<code className="text-amber-300">cairo_regular.ttf</code> و <code className="text-amber-300">amiri_regular.ttf</code>) المجهزة داخل مجلد <code className="text-amber-300">res/font/</code> حتى لا يحدث أي خطأ في التجميع، مع Gradle Wrapper ومحددات Compose BOM.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                  {onOpenIconModal && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenIconModal();
                      }}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs flex items-center gap-1.5 border border-amber-500/40 transition-colors shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>تخصيص الأيقونة</span>
                    </button>
                  )}

                  <a
                    href="/PrayerApp-Android-Project.zip"
                    download="PrayerApp-Android-Project.zip"
                    className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل المشروع (.ZIP)</span>
                  </a>
                </div>
              </div>

              {/* 3 Step Guide to create APK in Android Studio */}
              <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-4 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  خطوات استخراج ملف الـ APK عبر Android Studio:
                </h4>

                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pr-1">
                  <li>قم بفك ضغط الملف <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-200">PrayerApp-Android-Project.zip</code> على جهازك.</li>
                  <li>افتح برنامج <strong>Android Studio</strong> واختر <strong>Open</strong> ثم حدد مجلد المشروع.</li>
                  <li>انتظر دقيقة ليكتمل تحميل ملفات Gradle تلقائياً (Gradle Sync).</li>
                  <li>
                    من القائمة العلوية اضغط على: 
                    <span className="block mt-1 font-mono text-[11px] bg-slate-900 text-emerald-300 p-2 rounded border border-slate-800 text-left" dir="ltr">
                      Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)
                    </span>
                  </li>
                  <li>سيظهر إشعار في زاوية الشاشة يخبرك بانتهاء استخراج الـ APK مع زر <strong>locate</strong> لنسخ ملف <code className="text-amber-300">app-debug.apk</code> إلى هاتفك وتثبيته مباشرة!</li>
                </ol>
              </div>

              {/* Instant WebAPK Install Option */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-8 h-8 text-sky-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">تثبيت فوري كتطبيق أندرويد (WebAPK) الآن</h4>
                    <p className="text-xs text-slate-400">
                      يمكنك تثبيت هذا التطبيق الآن على أي هاتف أندرويد بدون كمبيوتر عبر ميزة WebAPK الرسمية في Chrome!
                    </p>
                  </div>
                </div>

                <button
                  onClick={onInstallPwa}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تثبيت على الهاتف الآن</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB ACTIONS CLOUD APK BUILD */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Github className="w-4 h-4 text-emerald-400" />
                  بناء الـ APK سحابياً مجاناً (بدون الحاجة لتنصيب Android Studio!)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  يحتوي المشروع على ملف سير عمل <code className="text-emerald-300">.github/workflows/build-apk.yml</code>.
                  بمجرد رفع المشروع إلى حسابك على GitHub، ستقوم خوادم GitHub المجانية بتجميع كود Kotlin وJetpack Compose وتوليد ملف <code className="text-amber-300">app-debug.apk</code> جاهز للتحميل خلال دقيقتين فقط.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>محتوى ملف سير العمل: <code className="text-emerald-400">.github/workflows/build-apk.yml</code></span>
                  <button
                    onClick={() => handleCopy(workflowCode, 'workflow')}
                    className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded"
                  >
                    {copiedKey === 'workflow' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'workflow' ? 'تم النسخ' : 'نسخ الكود'}</span>
                  </button>
                </div>

                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto text-left" dir="ltr">
                  {workflowCode}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                💡 <strong>أين تجد الـ APK؟</strong> ادخل على مستودع GitHub &gt; اضغط على تبويب <strong>Actions</strong> &gt; اضغط على آخر Build &gt; ستجد في الأسفل قسم <strong>Artifacts</strong> ويحتوي على <code className="font-mono text-amber-100">PrayerApp-Debug-APK.zip</code>.
              </div>
            </div>
          )}

          {/* TAB 3: TERMINAL GRADLE COMMAND */}
          {activeTab === 'terminal' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                إذا كان لديك Java JDK 17 مثبت على جهازك، يمكنك فتح موجه الأوامر داخل مجلد المشروع وتشغيل الأمر التالي مباشرة:
              </p>

              {/* Linux / Mac */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>لنظام ماك ولينكس (Mac & Linux):</span>
                  <button
                    onClick={() => handleCopy("./gradlew assembleDebug", 'cmd-mac')}
                    className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded"
                  >
                    {copiedKey === 'cmd-mac' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 text-left" dir="ltr">
                  ./gradlew assembleDebug
                </div>
              </div>

              {/* Windows */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>لنظام ويندوز (Windows CMD / PowerShell):</span>
                  <button
                    onClick={() => handleCopy(".\\gradlew.bat assembleDebug", 'cmd-win')}
                    className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded"
                  >
                    {copiedKey === 'cmd-win' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 text-left" dir="ltr">
                  .\gradlew.bat assembleDebug
                </div>
              </div>

              {/* Output path */}
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
                <span className="text-slate-400 block mb-1">مسار ملف الـ APK الناتج:</span>
                <code className="text-amber-300 font-mono text-[11px] block bg-slate-950 p-2 rounded text-left" dir="ltr">
                  app/build/outputs/apk/debug/app-debug.apk
                </code>
              </div>
            </div>
          )}

          {/* TAB 4: CODE INSPECTION */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setSelectedCodeFile('main')}
                    className={`px-2.5 py-1 rounded-lg ${
                      selectedCodeFile === 'main' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    MainActivity.kt
                  </button>
                  <button
                    onClick={() => setSelectedCodeFile('gradle')}
                    className={`px-2.5 py-1 rounded-lg ${
                      selectedCodeFile === 'gradle' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    app/build.gradle.kts
                  </button>
                  <button
                    onClick={() => setSelectedCodeFile('manifest')}
                    className={`px-2.5 py-1 rounded-lg ${
                      selectedCodeFile === 'manifest' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    AndroidManifest.xml
                  </button>
                </div>

                <button
                  onClick={() => {
                    const code = selectedCodeFile === 'main' ? mainActivityCode : selectedCodeFile === 'gradle' ? gradleCode : manifestCode;
                    handleCopy(code, 'file-code');
                  }}
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded"
                >
                  {copiedKey === 'file-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'file-code' ? 'تم النسخ' : 'نسخ الكود'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="max-h-72 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto overflow-y-auto text-left" dir="ltr">
                  {selectedCodeFile === 'main' && mainActivityCode}
                  {selectedCodeFile === 'gradle' && gradleCode}
                  {selectedCodeFile === 'manifest' && manifestCode}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>كافة الملفات تم فحصها وتجهيزها للتوافق مع أحدث إصدارات Jetpack Compose و Android 14 (API 34)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
