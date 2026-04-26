"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Capacitor } from "@capacitor/core"
import { App } from "@capacitor/app"
import { StatusBar, Style } from "@capacitor/status-bar"

export function CapacitorWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {})
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {})

      const backButtonListener = App.addListener("backButton", () => {
        if (
          window.location.pathname === "/login" ||
          window.location.pathname === "/dashboard/estudiante" ||
          window.location.pathname === "/dashboard/profesor"
        ) {
          App.exitApp()
        } else {
          router.back()
        }
      })

      return () => {
        backButtonListener.then((listener) => listener.remove())
      }
    }
  }, [router])

  return (
    <div className="safe-area-layout min-h-screen bg-background">
      {children}
    </div>
  )
}
