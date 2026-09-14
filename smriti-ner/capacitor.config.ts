import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "org.sih.smriti",
  appName: "Smriti",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#ffffff",
    },
  },
};

export default config;
