"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

export default function SearchFilter() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchBy, setSearchBy] = useState("title")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery)}&searchBy=${searchBy}`)
    }
  }

  const handleSearchTypeChange = (value: string) => {
    setSearchBy(value)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md items-center flex gap-2">
      <div className="hidden sm:block">
        <Select value={searchBy} onValueChange={handleSearchTypeChange}>
          <SelectTrigger className="w-[110px] h-10">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="genre">Genre</SelectItem>
            <SelectItem value="pages">Pages</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative flex-1">
        <Input
          type="search"
          placeholder={searchBy === "pages" ? "Max pages..." : `Search...`}
          className="w-full pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>

      <div className="sm:hidden">
        <Select value={searchBy} onValueChange={handleSearchTypeChange}>
          <SelectTrigger className="w-[80px] h-10">
            <SelectValue placeholder="By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="genre">Genre</SelectItem>
            <SelectItem value="pages">Pages</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  )
}

