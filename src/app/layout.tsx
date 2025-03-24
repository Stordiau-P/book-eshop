import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { DataProvider } from "../context/DataContext"
import { CartProvider } from "../context/CartContext"
import { ThemeProvider } from "../components/theme-provider"
import { AuthProvider } from "../context/AuthContext"
import { FavoritesProvider } from "../context/FavoritesContext"
import { Toaster } from "../components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Molenbook - Your Online Book Store",
  description: "Find your next favorite book in our extensive collection",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <DataProvider>
              <CartProvider>
                <FavoritesProvider>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                  </div>
                  <Toaster />
                </FavoritesProvider>
              </CartProvider>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

