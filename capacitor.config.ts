import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.roziq.wealth',
  appName: 'Roziq',
  webDir: 'out',
  // In development, proxy to local Next.js server.
  // In production APK, API calls go to https://roziq.vercel.app/api/...
  // (set via NEXT_PUBLIC_API_BASE at build time)
  server: {
    // Uncomment for local live-reload dev:
    // url: 'http://10.0.2.2:3000',
    // cleartext: true,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
