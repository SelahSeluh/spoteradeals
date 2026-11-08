import type { CapacitorConfig } from '@capacitor/cli';

// Bundle the existing Vite app locally. Do not load an arbitrary remote app URL.
const config: CapacitorConfig = {
  appId: 'com.spoteradeals.app',
  appName: 'SpoteraDeals',
  webDir: '../dist',
  bundledWebRuntime: false,
  android: { allowMixedContent: false },
  ios: { contentInset: 'automatic' },
};
export default config;
