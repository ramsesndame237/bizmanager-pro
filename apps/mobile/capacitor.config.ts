import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'pro.bizmanager.app',
  appName: 'BizManager Pro',
  webDir: '.output/public',
  server: {
    androidScheme: 'https',
  },
}

export default config
