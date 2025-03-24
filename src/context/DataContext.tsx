"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Book } from "../types/book"

interface DataContextType {
  books: Book[]
  loading: boolean
  error: string | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true)
        const response = await fetch("https://example-data.draftbit.com/books")
        if (!response.ok) {
          throw new Error("Failed to fetch books")
        }

        const data = await response.json()

        // Process the data to ensure consistent pricing
        const processedData = data.map((book: Book, index: number) => {
          // Set price to 9.99 for the first 10 books, 19.99 for the rest
          const isSpecialOffer = index < 10
          return {
            ...book,
            price: isSpecialOffer ? 9.99 : 19.99,
          }
        })

        setBooks(processedData)
      } catch (err) {
        console.error("Error fetching books:", err)
        setError("Failed to load books. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  return (
    <DataContext.Provider
      value={{
        books,
        loading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

