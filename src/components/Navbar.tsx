/**
 * Navbar Component
 * 
 * This component handles the site navigation and provides different layouts for mobile and desktop views.
 * It includes:
 * - Logo and branding
 * - Navigation links
 * - Search functionality
 * - User authentication controls (login/logout)
 * - Mobile menu with a slide-out drawer
 * 
 * Responsive behavior:
 * - On mobile and tablet (<1024px): Shows a hamburger menu that opens a slide-out drawer
 * - On desktop (≥1024px): Shows a full horizontal navigation bar
 */

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

/**
 * Navbar component function
 * 
 * This function returns the JSX for the navbar component.
 * It uses various state variables and hooks to manage the component's behavior.
 */
export default function Navbar() {
  // State to track the current pathname
  const pathname = usePathname()
  
  // State to track the current theme
  const { theme, setTheme } = useTheme()
  
  // State to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false)
  
  // State to track if the cart is open
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // State to track the cart contents
  const { cart, totalItems } = useCart()
  
  // State to track the user's favorites
  const { favorites } = useFavorites()
  
  // State to track the user's authentication status
  const { user, logout } = useAuth()
  
  // Reference to the cart button element
  const cartButtonRef = useRef<HTMLButtonElement>(null)
  
  // Router instance
  const router = useRouter()

  /**
   * Effect to set the isMounted state to true on component mount
   */
  useEffect(() => {
    setIsMounted(true)
  }, [])

  /**
   * Function to toggle the theme
   */
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  /**
   * Function to handle user logout
   */
  const handleLogout = () => {
    logout()
    router.push("/")
  }

  /**
   * Function to toggle the cart
   */
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  /**
   * Navigation links configuration
   */
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Books", path: "/books" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">

        {/* Mobile menu - Hamburger button and slide-out drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="lg:hidden">
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

        {/* Logo and brand name */}
        <Link href="/" className="flex items-center space-x-2 mr-2 md:mr-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">Molenbook</span>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden lg:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
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
        <div className="hidden lg:flex flex-1 justify-center px-2">
          <SearchFilter />
        </div>

        {/* Icons & Boutons */}
        <div className="flex items-center space-x-1 sm:space-x-2">
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
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1 text-xs px-2 h-8">
              <LogOut className="h-3 w-3" />
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="px-2 h-8 text-xs">
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
