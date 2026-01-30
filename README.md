# 健康运动助手 (Fitness Health App)

一款基于 React Native + Expo 开发的跨平台运动健康 APP，支持 Android 和 iOS 系统。

## 功能特点

### 🏠 首页
- 今日运动数据概览
- 快速开始运动
- 健康提醒

### 👤 体征管理
- 记录个人基本信息（身高、体重、年龄等）
- 自动计算 BMI 指数
- 体征数据持久化存储

### 🎯 健身目标
- 设置多种类型的健身目标（减重、增肌、耐力等）
- 目标进度追踪
- 完成状态管理

### 🏃 运动记录
- 支持多种运动类型
- 实时计时器
- 卡路里消耗计算
- 运动历史记录

### 📊 数据统计
- 每周运动数据统计
- 可视化图表展示
- 目标完成进度

## 技术栈

- **框架**: React Native + Expo
- **导航**: React Navigation 6
- **状态管理**: Zustand
- **持久化**: AsyncStorage
- **语言**: TypeScript

## 开始使用

### 环境要求

- Node.js 18+
- npm 或 yarn
- Expo CLI
- Android Studio (Android 开发)
- Xcode (iOS 开发，仅 macOS)

### 安装依赖

```bash
cd fitness-health-app
npm install
```

### 启动开发服务器

```bash
npm start
```

### 在模拟器/真机上运行

```bash
# Android
npm run android

# iOS
npm run ios
```

## 构建安装包

### 使用 EAS Build 构建

首先安装 EAS CLI：

```bash
npm install -g eas-cli
eas login
```

#### 构建 Android APK

```bash
eas build --platform android --profile preview
```

#### 构建 iOS 应用

```bash
eas build --platform ios --profile preview
```

#### 同时构建两个平台

```bash
eas build --platform all
```

## 项目结构

```
fitness-health-app/
├── App.tsx                 # 应用入口
├── app.json               # Expo 配置
├── eas.json               # EAS Build 配置
├── package.json           # 依赖配置
├── src/
│   ├── navigation/        # 导航配置
│   │   └── MainNavigator.tsx
│   ├── screens/           # 页面组件
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── GoalsScreen.tsx
│   │   ├── WorkoutScreen.tsx
│   │   └── StatsScreen.tsx
│   ├── store/             # 状态管理
│   │   └── healthStore.ts
│   └── types/             # TypeScript 类型定义
│       └── index.ts
└── assets/                # 静态资源
```

## 自定义配置

### 修改应用名称和图标

编辑 `app.json` 文件中的相关配置：

```json
{
  "expo": {
    "name": "你的应用名称",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png"
    }
  }
}
```

### 修改应用包名

- Android: 修改 `app.json` 中的 `android.package`
- iOS: 修改 `app.json` 中的 `ios.bundleIdentifier`

## 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit: Fitness Health App"
git branch -M main
git remote add origin https://github.com/SHAN-hou/fitness-health-app.git
git push -u origin main
```

## 许可证

MIT License
