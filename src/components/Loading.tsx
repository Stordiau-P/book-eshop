import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading books...</p>
    </div>
  )
}

