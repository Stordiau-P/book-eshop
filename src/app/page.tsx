import { Suspense } from "react"
import Slider from "../components/Slider"
import ProductList from "../components/ProductList"
import Loading from "../components/Loading"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <Slider />
      </Suspense>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Books</h2>
        <Suspense fallback={<Loading />}>
          <ProductList type="featured" limit={4} />
        </Suspense>
      </section>

      <section className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6">Special Offers - €9.99</h2>
        <Suspense fallback={<Loading />}>
          <ProductList type="special" limit={10} />
        </Suspense>
      </section>
    </main>
  )
}

