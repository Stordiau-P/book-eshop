"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useData } from "../context/DataContext"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { Checkbox } from "../components/ui/checkbox"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"

export function BookFilter() {
  const { books } = useData()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [genres, setGenres] = useState<string[]>([])
  const [formats, setFormats] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get("category") || "")
  const [selectedFormat, setSelectedFormat] = useState<string>(searchParams.get("format") || "")

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
      // Extract unique genres from all books
      const allGenres = books.flatMap((book) => ensureGenresArray(book.genres))
      const uniqueGenres = [...new Set(allGenres)].filter(Boolean).sort()
      setGenres(uniqueGenres)

      // Extract unique formats from all books
      const allFormats = books.map((book) => book.format).filter(Boolean)
      const uniqueFormats = [...new Set(allFormats)].sort()
      setFormats(uniqueFormats)
    }
  }, [books])

  const handleGenreChange = (genre: string) => {
    const newGenre = genre === selectedGenre ? "" : genre
    setSelectedGenre(newGenre)
    updateFilters(newGenre, selectedFormat)
  }

  const handleFormatChange = (format: string) => {
    const newFormat = format === selectedFormat ? "" : format
    setSelectedFormat(newFormat)
    updateFilters(selectedGenre, newFormat)
  }

  const updateFilters = (genre: string, format: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (genre) {
      params.set("category", genre)
    } else {
      params.delete("category")
    }

    if (format) {
      params.set("format", format)
    } else {
      params.delete("format")
    }

    router.push(`/books?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedGenre("")
    setSelectedFormat("")

    const params = new URLSearchParams(searchParams.toString())
    params.delete("category")
    params.delete("format")

    router.push(`/books?${params.toString()}`)
  }

  const hasActiveFilters = selectedGenre || selectedFormat

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["genres", "formats"]}>
        <AccordionItem value="genres">
          <AccordionTrigger>Genres</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {genres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre}`}
                    checked={selectedGenre === genre}
                    onCheckedChange={() => handleGenreChange(genre)}
                  />
                  <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="formats">
          <AccordionTrigger>Formats</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {formats.map((format) => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={`format-${format}`}
                    checked={selectedFormat === format}
                    onCheckedChange={() => handleFormatChange(format)}
                  />
                  <Label htmlFor={`format-${format}`} className="text-sm cursor-pointer">
                    {format}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

