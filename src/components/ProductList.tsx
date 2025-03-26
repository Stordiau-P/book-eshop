/**
 * ProductList Component
 * 
 * This component displays a grid of book products with filtering capabilities.
 * It handles:
 * - Displaying books in a responsive grid layout
 * - Filtering books by type, format, and search terms
 * - Showing book details including cover, title, author, and price
 * - Adding books to cart and favorites
 * 
 * The component adapts to different screen sizes with a responsive grid system.
 */

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

// Props interface for the ProductList component
interface ProductListProps {
  type?: "all" | "featured" | "special" // Filter by book type (new, popular, special)
  limit?: number // Limit the number of books displayed
  filter?: string // Additional filter criteria
  format?: string // Book format (hardcover, paperback, etc.)
  search?: string // Search term
  searchBy?: string // Field to search by (title, author, etc.)
}

export default function ProductList({
  type = "all",
  limit,
  filter,
  format,
  search,
  searchBy = "title",
}: ProductListProps) {
  // Get books, loading state, and cart functions from context
  const { books, loading } = useData()
  const { addToCart } = useCart()
  const { favorites, toggleFavorite } = useFavorites()
  
  // State to store filtered books for display
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

  // Effect to filter books based on props whenever dependencies change
  useEffect(() => {
    if (books.length > 0) {
      // Start with all books
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

      // Update the state with filtered books
      setDisplayBooks(filtered)
    }
  }, [books, type, limit, filter, format, search, searchBy])

  // Function to get the display price for a book
  const getBookPrice = (book: Book) => {
    return book.price === 9.99 ? 9.99 : 19.99
  }

  // Show loading state while data is being fetched
  if (loading) {
    return <Loading />
  }

  // Show message if no books match the filters
  if (displayBooks.length === 0) {
    return <p className="text-center py-10">No books found.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 md:gap-6">
      {/* Map through filtered books and create a card for each */}
      {displayBooks.map((book) => (
        <Card key={book.id} className="overflow-hidden h-full flex flex-col">
          {/* Book cover image container */}
          <div className="relative w-full pt-[140%]">
            <Image
              src={book.image_url || "/placeholder.svg"}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center"
              priority={displayBooks.indexOf(book) < 4}
            />
            {/* Favorite button */}
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
          
          {/* Book details */}
          <CardContent className="flex flex-col flex-grow p-3 md:p-4">
            <Link href={`/book/${book.id}`} className="flex-grow">
              {/* Book title */}
              <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 hover:text-primary">{book.title}</h3>
              {/* Book author */}
              <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-1">{book.authors}</p>
              
              {/* Rating stars */}
              <div className="flex items-center mb-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 ${
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
            
            {/* Price and add to cart button */}
            <div className="mt-auto flex items-center justify-between">
              <span className="text-sm md:text-sm lg:text-base font-bold">€{getBookPrice(book).toFixed(2)}</span>
              <Button size="sm" className="text-xs h-7 md:h-8 px-2 md:px-3" onClick={() => addToCart(book)}>
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
