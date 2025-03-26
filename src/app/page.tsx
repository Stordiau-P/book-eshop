/**
 * Home Page Component
 * 
 * This is the main landing page of the application. It displays:
 * 1. A featured book slider at the top
 * 2. Featured Books section
 * 3. Special Offers section
 * 
 * Each section uses the ProductList component with different filters.
 * The layout is responsive and adapts to different screen sizes.
 */

import { Suspense } from "react"
import Slider from "../components/Slider"
import ProductList from "../components/ProductList"
import Loading from "../components/Loading"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Featured Book Slider */}
      <Suspense fallback={<Loading />}>
        <Slider />
      </Suspense>

      {/* Main Content Sections */}
      <section className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        {/* Featured Books Section */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6">Featured Books</h2>
          <Suspense fallback={<Loading />}>
            {/* ProductList component filtered to show featured books */}
            <ProductList type="featured" limit={4} />
          </Suspense>
        </div>

        {/* Special Offers Section */}
        <div className="space-y-4 mt-16 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6">Special Offers - €9.99</h2>
          <Suspense fallback={<Loading />}>
            {/* ProductList component filtered to show special offers */}
            <ProductList type="special" limit={10} />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
