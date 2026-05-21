import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.foodfit.app",
  appName: "NutriCue",
  webDir: "www",
  server: {
    url: "https://foodfit-six.vercel.app",
    cleartext: false
  }
};

export default config;
