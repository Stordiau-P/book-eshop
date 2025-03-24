"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useData } from "../context/DataContext"
import type { Book } from "../types/book"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { useCart } from "../context/CartContext"
import { Heart } from "lucide-react"
import { useFavorites } from "../context/FavoritesContext"
import Loading from "./Loading"

interface ProductListProps {
  type?: "all" | "featured" | "special"
  limit?: number
  filter?: string
  format?: string
  search?: string
  searchBy?: string
}

export default function ProductList({
  type = "all",
  limit,
  filter,
  format,
  search,
  searchBy = "title",
}: ProductListProps) {
  const { books, loading } = useData()
  const { addToCart } = useCart()
  const { favorites, toggleFavorite } = useFavorites()
  const [displayBooks, setDisplayBooks] = useState<Book[]>([])

  // Helper function to ensure genres is always an array
  const ensureGenresArray = (genres: any): string[] => {
    if (!genres) return []
    if (Array.isArray(genres)) return genres
    if (typeof genres === "string") {
      // If it's a comma-separated string, split it
      if (genres.includes(",")) return genres.split(",").map((g) => g.trim())
      // Otherwise, return it as a single-item array
      return [genres]
    }
    return []
  }

  useEffect(() => {
    if (books.length > 0) {
      let filtered = [...books]

      // Apply search filter based on searchBy parameter
      if (search) {
        const searchLower = search.toLowerCase()

        if (searchBy === "title") {
          filtered = filtered.filter((book) => book.title.toLowerCase().includes(searchLower))
        } else if (searchBy === "author") {
          filtered = filtered.filter((book) => book.authors?.toLowerCase().includes(searchLower))
        } else if (searchBy === "genre") {
          filtered = filtered.filter((book) =>
            ensureGenresArray(book.genres).some((genre) => genre.toLowerCase().includes(searchLower)),
          )
        } else if (searchBy === "pages") {
          // Filter books with pages less than or equal to the specified number
          const maxPages = Number.parseInt(search)
          if (!isNaN(maxPages)) {
            filtered = filtered.filter((book) => book.num_pages && book.num_pages <= maxPages)
          }
        }
      }

      // Apply category filter
      if (filter && filter !== "all") {
        filtered = filtered.filter((book) =>
          ensureGenresArray(book.genres).some((genre) => genre.toLowerCase() === filter.toLowerCase()),
        )
      }

      // Apply format filter
      if (format) {
        filtered = filtered.filter((book) => book.format && book.format.toLowerCase() === format.toLowerCase())
      }

      // Apply type filter
      if (type === "featured") {
        // For featured, get books with highest ratings
        filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      } else if (type === "special") {
        // For special offers, get books with price 9.99
        filtered = filtered.filter((book) => book.price === 9.99)
      }

      // Apply limit
      if (limit) {
        filtered = filtered.slice(0, limit)
      }

      setDisplayBooks(filtered)
    }
  }, [books, type, limit, filter, format, search, searchBy])

  const getBookPrice = (book: Book) => {
    return book.price === 9.99 ? 9.99 : 19.99
  }

  if (loading) {
    return <Loading />
  }

  if (displayBooks.length === 0) {
    return <p className="text-center py-10">No books found.</p>
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
      {displayBooks.map((book) => (
        <Card key={book.id} className="overflow-hidden h-full flex flex-col">
          <div className="relative w-full pt-[140%]">
            <Image
              src={book.image_url || "/placeholder.svg"}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center"
              priority={displayBooks.indexOf(book) < 4}
            />
            <button
              onClick={() => toggleFavorite(book)}
              className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full"
              aria-label={favorites.some((fav) => fav.id === book.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`h-5 w-5 ${favorites.some((fav) => fav.id === book.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
              />
            </button>
          </div>
          <CardContent className="flex flex-col flex-grow p-3 md:p-4">
            <Link href={`/book/${book.id}`} className="flex-grow">
              <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 hover:text-primary">{book.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-1">{book.authors}</p>
              <div className="flex items-center mb-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 md:w-4 md:h-4 ${
                        i < Math.round(book.rating || 0) ? "text-yellow-300" : "text-gray-300 dark:text-gray-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">({book.rating_count || 0})</span>
              </div>
            </Link>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-sm md:text-base font-bold">€{getBookPrice(book).toFixed(2)}</span>
              <Button size="sm" className="text-xs h-8 px-2 md:px-3" onClick={() => addToCart(book)}>
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

