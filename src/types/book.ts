export interface Book {
  id: string
  title: string
  authors: string
  description: string
  edition?: string
  format?: string
  genres?: string[] | string
  image_url: string
  isbn?: string
  language?: string
  num_pages?: number
  price?: number
  publisher?: string
  rating: number
  rating_count: number
  review_count?: number
  publication_date?: string
  quantity?: number
  Quote1?: string
  Quote2?: string
  Quote3?: string
}

