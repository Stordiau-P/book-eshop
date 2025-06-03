/**
 * Slider Component
 * 
 * This component displays a featured book slider/carousel on the homepage.
 * It shows random books with a rotating animation.
 * 
 * Features:
 * - Automatic rotation between featured books
 * - Responsive design for all screen sizes
 * - Book cover image display with hover effects
 * - Call-to-action buttons for each book
 * - Slide indicators for navigation
 */

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { useData } from "../context/DataContext"
import type { Book } from "../types/book"
import Loading from "./Loading"

/**
 * Slider Component
 * 
 * @returns JSX.Element
 */
export default function Slider() {
  // Get books and loading state from DataContext
  const { books, loading } = useData()

  // State to track the current slide index
  const [currentIndex, setCurrentIndex] = useState(0)
  // State to store random books for the slider
  const [randomBooks, setRandomBooks] = useState<Book[]>([])

  // Effect to select random books when the component mounts or books change
  useEffect(() => {
    if (books && books.length > 0) {
      // Get 5 random books for the slider
      const getRandomBooks = () => {
        const shuffled = [...books].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, 5)
      }
      
      setRandomBooks(getRandomBooks())
    }
  }, [books])

  // Effect to automatically rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Move to the next slide
      nextSlide()
    }, 5000)
    
    // Clear the interval when component unmounts
    return () => clearInterval(interval)
  }, [currentIndex, randomBooks.length])

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === randomBooks.length - 1 ? 0 : prevIndex + 1
    )
  }

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? randomBooks.length - 1 : prevIndex - 1
    )
  }

  // Show loading state if data is still loading or no books are available
  if (loading || randomBooks.length === 0) {
    return <Loading />
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
      <div className="container mx-auto px-8 sm:px-10 md:px-16 lg:px-20 py-6 sm:py-10 md:py-14 lg:py-20 relative">
        <div className="flex h-full min-h-[280px] sm:min-h-[350px] md:min-h-[420px] lg:min-h-[500px]">
          {/* Map through random books and create a slide for each */}
          {randomBooks.map((book, index) => (
            <div
              key={book.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center h-full">
                {/* Left column - Book information */}
                <div className="text-center md:text-left z-20 relative px-4 sm:px-6 md:px-8 lg:px-10 pt-4 sm:pt-6 md:pt-0">
                  {/* Featured book badge */}
                  <span className="inline-block px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-xs sm:text-sm mb-3 md:mb-4">
                    Featured Book
                  </span>
                  
                  {/* Book title */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-6 drop-shadow-md">
                    {book.title}
                  </h2>
                  
                  {/* Book description */}
                  <p className="text-white/90 mb-4 md:mb-6 lg:mb-8 text-sm sm:text-base md:text-lg max-w-xl mx-auto md:mx-0 drop-shadow-md line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
                    {book.description}
                  </p>
                  
                  {/* Call-to-action buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center md:justify-start">
                    <Link href={`/book/${book.id}`}>
                      <Button
                        size="sm"
                        className="w-full sm:w-auto text-xs sm:text-sm md:text-base px-3 py-1 sm:py-2 md:px-5 md:py-2 h-auto"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link href="/books">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm md:text-base px-3 py-1 sm:py-2 md:px-5 md:py-2 h-auto"
                      >
                        Browse All Books
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right column - Book cover image */}
                <div className="flex justify-center md:justify-end mt-3 sm:mt-4 md:mt-0">
                  <div className="relative h-[160px] sm:h-[180px] md:h-[220px] lg:h-[300px] w-[100px] sm:w-[120px] md:w-[150px] lg:w-[200px] shadow-2xl rounded-lg overflow-hidden transform rotate-[-3deg] transition-transform hover:rotate-0 duration-300 md:mr-8 lg:mr-10">
                    <Image
                      src={book.image_url || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, (max-width: 1024px) 150px, 200px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
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
