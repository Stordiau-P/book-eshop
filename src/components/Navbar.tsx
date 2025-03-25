"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingCart, Heart, Sun, Moon, LogOut, BookOpen } from "lucide-react"
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { useTheme } from "next-themes"
import CartModal from "./CartModal"
import { useCart } from "../context/CartContext"
import { useFavorites } from "../context/FavoritesContext"
import { useAuth } from "../context/AuthContext"
import SearchFilter from "./SearchFilter"

export default function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cart, totalItems } = useCart()
  const { favorites } = useFavorites()
  const { user, logout } = useAuth()
  const cartButtonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Books", path: "/books" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">

          {/* Menu mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        href={link.path}
                        className={`hover:text-primary ${pathname === link.path ? "text-primary font-bold" : ""}`}
                    >
                      {link.name}
                    </Link>
                ))}
                {/* Search en mobile */}
                <div className="mt-4">
                  <SearchFilter />
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Molenbook</span>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
                <Link
                    key={link.path}
                    href={link.path}
                    className={`transition-colors hover:text-primary ${pathname === link.path ? "text-primary font-bold" : ""}`}
                >
                  {link.name}
                </Link>
            ))}
          </nav>

          {/* SearchBar Desktop */}
          <div className="hidden md:flex flex-1 justify-center px-2">
            <SearchFilter />
          </div>

          {/* Icons & Boutons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isMounted && (
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
            )}

            <Link href="/favorites">
              <Button variant="ghost" size="icon" aria-label="Favorites" className="relative">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
                )}
              </Button>
            </Link>

            <Button
                ref={cartButtonRef}
                variant="ghost"
                size="icon"
                className="relative"
                onClick={toggleCart}
                aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
              )}
            </Button>

            {user ? (
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
            ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
            )}
          </div>
        </div>

        {isCartOpen && <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
      </header>
  )
}
