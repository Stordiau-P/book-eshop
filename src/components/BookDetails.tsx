"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useData } from "../context/DataContext"
import { useCart } from "../context/CartContext"
import { useFavorites } from "../context/FavoritesContext"
import type { Book } from "../types/book"
import { Button } from "./ui/button"
import { Heart, ShoppingCart, BookOpen } from "lucide-react"
import Loading from "./Loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"

interface BookDetailsProps {
  id: string
}

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

export function BookDetails({ id }: BookDetailsProps) {
  const { books, loading: dataLoading } = useData()
  const { addToCart } = useCart()
  const { favorites, toggleFavorite } = useFavorites()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only proceed if books are loaded
    if (!dataLoading && books.length > 0) {
      const foundBook = books.find((b) => String(b.id) === String(id))
      setBook(foundBook || null)
      setLoading(false)
    }
  }, [books, id, dataLoading])

  if (loading || dataLoading) {
    return <Loading />
  }

  if (!book) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Book not found</h2>
        <p className="text-muted-foreground mb-6">The book you're looking for could not be found.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  const isFavorite = favorites.some((fav) => fav.id === book.id)
  const bookPrice = book.price === 9.99 ? 9.99 : 19.99
  const genresList = ensureGenresArray(book.genres)

  // Format publication date as a simple string if it exists
  const formattedPublicationDate = book.publication_date ? book.publication_date.toString() : "Unknown"

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="relative w-full max-w-md mx-auto md:mx-0 aspect-[3/4] shadow-lg rounded-lg overflow-hidden">
          <Image
            src={book.image_url || "/placeholder.svg"}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-center"
            priority
          />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4">by {book.authors}</p>

          <div className="flex items-center mb-6">
            <div className="flex mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
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
            <span className="text-sm text-muted-foreground">
              {book.rating} ({book.rating_count} reviews)
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{book.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {genresList.map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {book.format && (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                <span className="text-sm sm:text-base">
                  <span className="font-medium">Format:</span> {book.format}
                </span>
              </div>
            )}
            {book.num_pages && (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                <span className="text-sm sm:text-base">
                  <span className="font-medium">Pages:</span> {book.num_pages}
                </span>
              </div>
            )}
            {book.edition && (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                <span className="text-sm sm:text-base">
                  <span className="font-medium">Edition:</span> {book.edition}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-xl sm:text-3xl font-bold">€{bookPrice.toFixed(2)}</div>
            <div className="text-sm text-green-600 dark:text-green-400">In Stock</div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => addToCart(book)}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            <Button
              size="lg"
              variant={isFavorite ? "default" : "outline"}
              className={`w-full sm:w-auto ${isFavorite ? "bg-red-500 hover:bg-red-600" : ""}`}
              onClick={() => toggleFavorite(book)}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-white" : ""}`} />
              <span className="ml-2">{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
            </Button>
          </div>
        </div>
      </div>

      {(book.Quote1 || book.Quote2 || book.Quote3) && (
        <div className="mb-10 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Quotes</h3>
          <div className="space-y-4">
            {book.Quote1 && (
              <blockquote className="italic border-l-4 border-primary pl-4 py-2 text-sm sm:text-base">
                "{book.Quote1}"
              </blockquote>
            )}
            {book.Quote2 && (
              <blockquote className="italic border-l-4 border-primary pl-4 py-2 text-sm sm:text-base">
                "{book.Quote2}"
              </blockquote>
            )}
            {book.Quote3 && (
              <blockquote className="italic border-l-4 border-primary pl-4 py-2 text-sm sm:text-base">
                "{book.Quote3}"
              </blockquote>
            )}
          </div>
        </div>
      )}

      <Tabs defaultValue="reviews" className="mb-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="details">Book Details</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="p-4 sm:p-6 border rounded-md mt-2">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Reader Reviews</h3>
          <div className="flex flex-col sm:flex-row sm:items-center mb-6">
            <div className="flex mr-4 mb-2 sm:mb-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${
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
            <div>
              <div className="text-xl sm:text-2xl font-bold">{book.rating} out of 5</div>
              <div className="text-sm text-muted-foreground">{book.rating_count} global ratings</div>
            </div>
          </div>

          {book.review_count && (
            <p className="text-muted-foreground mb-4">This book has {book.review_count} written reviews.</p>
          )}
        </TabsContent>

        <TabsContent value="details" className="p-4 sm:p-6 border rounded-md mt-2">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Complete Book Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-base sm:text-lg mb-2">Publication Details</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <span className="font-medium">Title:</span> {book.title}
                </li>
                <li>
                  <span className="font-medium">Authors:</span> {book.authors}
                </li>
                {book.edition && (
                  <li>
                    <span className="font-medium">Edition:</span> {book.edition}
                  </li>
                )}
                {book.publication_date && (
                  <li>
                    <span className="font-medium">Publication Date:</span> {formattedPublicationDate}
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-base sm:text-lg mb-2">Physical Details</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                {book.format && (
                  <li>
                    <span className="font-medium">Format:</span> {book.format}
                  </li>
                )}
                {book.num_pages && (
                  <li>
                    <span className="font-medium">Number of Pages:</span> {book.num_pages}
                  </li>
                )}
                {genresList.length > 0 && (
                  <li>
                    <span className="font-medium">Genres:</span> {genresList.join(", ")}
                  </li>
                )}
                <li>
                  <span className="font-medium">Rating:</span> {book.rating} out of 5 ({book.rating_count} ratings)
                </li>
                <li>
                  <span className="font-medium">Price:</span> €{bookPrice.toFixed(2)}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-base sm:text-lg mb-2">Description</h4>
            <p className="text-muted-foreground whitespace-pre-line text-sm sm:text-base">{book.description}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

