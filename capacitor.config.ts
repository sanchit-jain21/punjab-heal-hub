import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4b9b0c019de04a3ea8889e73eb4b8855',
  appName: 'punjab-heal-hub',
  webDir: 'dist',
  server: {
    url: 'https://4b9b0c01-9de0-4a3e-a888-9e73eb4b8855.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0891b2',
      showSpinner: false
    }
  }
};

export default config;