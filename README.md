# 健康运动助手 (Fitness Health App)

一款原生 Android 运动健康 APP，使用 Kotlin + Jetpack Compose 开发。

## 📱 下载安装

前往 [Releases](https://github.com/SHAN-hou/fitness-health-app/releases) 页面下载最新 APK。

## ✨ 功能特点

### 🏠 首页
- 今日运动数据概览
- 快速开始运动
- 健康提醒

### 👤 体征管理
- 记录个人基本信息（身高、体重、年龄等）
- 自动计算 BMI 指数
- 健康状态评估

### 🎯 健身目标
- 设置多种类型的健身目标（减重、步数、运动时长等）
- 目标进度追踪
- 完成状态管理

### 🏃 运动记录
- 支持多种运动类型（跑步、骑行、瑜伽、力量训练等）
- 实时计时器
- 卡路里消耗计算

### 📊 数据统计
- 每周运动数据统计
- 可视化图表展示
- 健康小贴士

## 🛠 技术栈

- **语言**: Kotlin
- **UI框架**: Jetpack Compose
- **导航**: Navigation Compose
- **最低支持**: Android 8.0 (API 26)

## 🔧 本地开发

### 环境要求

- Android Studio Hedgehog 或更高版本
- JDK 17
- Android SDK 34

### 构建项目

```bash
# 克隆项目
git clone https://github.com/SHAN-hou/fitness-health-app.git
cd fitness-health-app

# 构建 Debug APK
./gradlew assembleDebug

# 构建 Release APK
./gradlew assembleRelease
```

APK 输出位置: `app/build/outputs/apk/`

## 🚀 自动构建

每次推送代码到 main 分支，GitHub Actions 会自动：
1. 构建 Release APK
2. 创建新的 Release
3. 上传 APK 到 Release 页面

无需任何额外配置，直接在 Releases 页面下载即可！

## 📁 项目结构

```
fitness-health-app/
├── app/
│   ├── src/main/
│   │   ├── kotlin/com/shanhou/fitnesshealthapp/
│   │   │   ├── MainActivity.kt
│   │   │   ├── navigation/
│   │   │   │   └── AppNavigation.kt
│   │   │   ├── screens/
│   │   │   │   ├── HomeScreen.kt
│   │   │   │   ├── ProfileScreen.kt
│   │   │   │   ├── GoalsScreen.kt
│   │   │   │   ├── WorkoutScreen.kt
│   │   │   │   └── StatsScreen.kt
│   │   │   └── ui/theme/
│   │   │       └── Theme.kt
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── build.gradle.kts
├── settings.gradle.kts
└── .github/workflows/
    └── build-android.yml
```

## 📄 许可证

MIT License
