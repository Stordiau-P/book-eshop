/**
 * Book Detail Page
 * 
 * This page displays detailed information about a specific book.
 * It uses the BookDetails component which fetches data from the DataContext,
 * ensuring we maintain a single API call architecture.
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BookDetails } from "../../../components/BookDetails";
import Loading from "../../../components/Loading";

interface BookPageProps {
  params: {
    id: string;
  };
}

/**
 * Generate static paths for common book IDs
 * 
 * Instead of making a duplicate API call, we pre-define a set of common IDs
 * that will be pre-rendered at build time. The DataContext will handle
 * fetching the actual data for these and any other IDs at runtime.
 */
export async function generateStaticParams() {
  // Pre-generate paths for the first 20 book IDs
  // This is a static approach that doesn't require an API call
  return Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default function BookPage({ params }: BookPageProps) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <BookDetails id={id} />
      </Suspense>
    </div>
  );
}
