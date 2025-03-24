"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { useData } from "../context/DataContext"
import type { Book } from "../types/book"
import Loading from "./Loading"

export default function Slider() {
  const { books, loading } = useData()
  const [randomBooks, setRandomBooks] = useState<Book[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (books.length > 0) {
      // Get 5 random books for the slider
      const shuffled = [...books].sort(() => 0.5 - Math.random())
      setRandomBooks(shuffled.slice(0, 5))
    }
  }, [books])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % randomBooks.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + randomBooks.length) % randomBooks.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [randomBooks.length])

  // Show loading state if data is still loading or no books are available
  if (loading || randomBooks.length === 0) {
    return <Loading />
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24 relative">
        <div className="flex h-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[600px]">
          {randomBooks.map((book, index) => (
            <div
              key={book.id}
              className={`w-full transition-opacity duration-500 absolute inset-0 ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center h-full">
                <div className="text-center md:text-left z-20 relative">
                  <span className="inline-block px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-xs sm:text-sm mb-3 md:mb-4">
                    Featured Book
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 drop-shadow-md">
                    {book.title}
                  </h2>
                  <p className="text-white/90 mb-6 md:mb-8 text-sm sm:text-base md:text-lg max-w-xl mx-auto md:mx-0 drop-shadow-md line-clamp-3 md:line-clamp-4">
                    {book.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Link href={`/book/${book.id}`}>
                      <Button
                        size="sm"
                        className="w-full sm:w-auto text-xs sm:text-sm md:text-base md:px-6 md:py-5 md:h-auto"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link href="/books">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm md:text-base md:px-6 md:py-5 md:h-auto"
                      >
                        Browse All Books
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center md:justify-end mt-6 md:mt-0">
                  <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] w-[180px] sm:w-[220px] md:w-[250px] lg:w-[320px] shadow-2xl rounded-lg overflow-hidden transform rotate-[-3deg] transition-transform hover:rotate-0 duration-300">
                    <Image
                      src={book.image_url || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 180px, (max-width: 768px) 220px, (max-width: 1024px) 250px, 320px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 text-white hover:bg-black/50 rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 text-white hover:bg-black/50 rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </Button>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2 sm:space-x-3">
        {randomBooks.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

