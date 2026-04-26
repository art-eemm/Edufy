import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.edufy.app",
  appName: "Edufy",
  webDir: "out",
  server: {
    url: "https://edufy-wheat.vercel.app/login",
    cleartext: true,
  },
}

export default config
