import "./globals.css"
import { Inter } from "next/font/google"
import { ProgressProvider } from "@/components/providers/progress-provider"
import Link from "next/link"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PG&E Savings Calculator",
  description: "Find out how much you can save on your PG&E bill",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProgressProvider>
          <div className="min-h-screen gradient-background">
            <header className="py-4">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link href="/" className="text-xl font-bold">
                      PG&E Saver
                    </Link>
                  </div>
                </div>
              </div>
            </header>
            <main>{children}</main>
          </div>
        </ProgressProvider>
      </body>
    </html>
  )
}

