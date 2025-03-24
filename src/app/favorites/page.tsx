"use client"

import { useEffect, useState } from "react"
import { useFavorites } from "../../context/FavoritesContext"
import Loading from "../../components/Loading"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "../../context/CartContext"

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites()
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Short timeout to ensure UI is ready
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">You haven't added any books to your favorites yet.</p>
          <Link href="/books">
            <Button>Browse Books</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
          {favorites.map((book) => (
            <Card key={book.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative w-full pt-[140%]">
                <Image
                  src={book.image_url || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-center"
                  priority={favorites.indexOf(book) < 4}
                />
                <button
                  onClick={() => toggleFavorite(book)}
                  className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full"
                  aria-label="Remove from favorites"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </button>
              </div>
              <CardContent className="flex flex-col flex-grow p-3 md:p-4">
                <Link href={`/book/${book.id}`} className="flex-grow">
                  <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 hover:text-primary">
                    {book.title}
                  </h3>
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
                  <span className="text-sm md:text-base font-bold">€{(book.price || 19.99).toFixed(2)}</span>
                  <Button size="sm" className="text-xs h-8 px-2 md:px-3" onClick={() => addToCart(book)}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

