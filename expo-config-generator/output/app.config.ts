import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'MyApp',
  slug: 'myapp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.example.myapp',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'This app uses the camera to scan codes.',
      NSPhotoLibraryUsageDescription: 'This app accesses photos for profile pictures.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.example.myapp',
    versionCode: 1,
    permissions: ['CAMERA', 'READ_EXTERNAL_STORAGE'],
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    ['expo-camera', { cameraPermission: 'Allow $(PRODUCT_NAME) to access camera.' }],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: 'your-project-id',
    },
    apiUrl: process.env.API_URL ?? 'https://api.example.com',
  },
});
