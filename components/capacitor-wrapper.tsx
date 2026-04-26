"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Capacitor } from "@capacitor/core"
import { App } from "@capacitor/app"
import { StatusBar, Style } from "@capacitor/status-bar"

export function CapacitorWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform()
    setIsMobile(isNative)

    if (isNative) {
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
    <div
      className={isMobile ? "safe-area-layout bg-background" : "min-h-screen"}
    >
      {children}
    </div>
  )
}
