import { Suspense } from "react"
import { BookFilter } from "../../components/BookFilter"
import ProductList from "../../components/ProductList"
import Loading from "../../components/Loading"

interface BooksPageProps {
  searchParams: {
    category?: string
    format?: string
    search?: string
    searchBy?: string
  }
}

export default function BooksPage({ searchParams }: BooksPageProps) {
  const { category, format, search, searchBy } = searchParams

  // Get the display name for the search type
  const getSearchByDisplayName = (type?: string) => {
    switch (type) {
      case "author":
        return "Author"
      case "genre":
        return "Genre"
      case "pages":
        return "Pages"
      case "title":
      default:
        return "Title"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Books</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <aside>
          <BookFilter />
        </aside>

        <div>
          {search && (
            <p className="mb-4">
              Search results for <span className="font-medium">{getSearchByDisplayName(searchBy)}: </span>
              <span className="font-medium">{search}</span>
            </p>
          )}

          <Suspense fallback={<Loading />}>
            <ProductList type="all" filter={category} format={format} search={search} searchBy={searchBy} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

