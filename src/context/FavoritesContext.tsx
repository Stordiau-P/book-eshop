"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Book } from "../types/book"

interface FavoritesContextType {
  favorites: Book[]
  toggleFavorite: (book: Book) => void
  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Book[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem("bookshop_favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Failed to parse stored favorites:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bookshop_favorites", JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const toggleFavorite = (book: Book) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some((item) => String(item.id) === String(book.id))
      if (exists) {
        return prevFavorites.filter((item) => String(item.id) !== String(book.id))
      } else {
        return [...prevFavorites, book]
      }
    })
  }

  const isFavorite = (id: string) => {
    return favorites.some((item) => String(item.id) === String(id))
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {isLoaded ? children : null}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

