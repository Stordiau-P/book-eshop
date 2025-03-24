import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BookDetails } from "../../../components/BookDetails";
import Loading from "../../../components/Loading";

interface BookPageProps {
  params: {
    id: string;
  };
}

// ✅ Ajout de generateStaticParams()
export async function generateStaticParams() {
  const res = await fetch("https://example-data.draftbit.com/books"); // Remplace par ton API
  const books = await res.json();

  return books.map((book: { id: string }) => ({
    id: book.id.toString(),
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
