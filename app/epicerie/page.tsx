import { Suspense } from "react"
import Link from "next/link"
import { Bug } from "lucide-react"

import { ProductList } from "@/components/product-list"
import { ProductsLoading } from "@/components/products-loading"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Nos Produits - Épicerie du Quartier",
  description:
    "Découvrez notre sélection de produits locaux, frais et de saison. Commandez en ligne et récupérez vos achats en magasin.",
}

export default function EpiceriePage({
  searchParams,
}: {
  searchParams: { categorie?: string }
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 container mx-auto py-8">
        <div className="flex justify-between items-center mb-8 px-4">
          <h1 className="text-3xl font-bold">Nos Produits</h1>
        </div>
        <Suspense fallback={<ProductsLoading />}>
          <ProductList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

