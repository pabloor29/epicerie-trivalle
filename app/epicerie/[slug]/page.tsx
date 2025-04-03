import { notFound } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { sanitizeImageUrl, getDirectSupabaseUrl } from "@/lib/image-utils"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params
  const supabase = createServerSupabaseClient()

  // Récupérer le produit par son slug
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(id, name, slug)
    `)
    .eq("slug", slug)
    .single()

  if (error || !product) {
    console.error("Erreur lors de la récupération du produit:", error)
    notFound()
  }

  // Essayer d'abord l'URL directe Supabase si image_path est disponible
  const imageUrl = product.image_path ? getDirectSupabaseUrl(product.image_path) : sanitizeImageUrl(product.image_url)

  // Log pour déboguer
  console.log("Page produit - Détails de l'image:", {
    productName: product.name,
    originalUrl: product.image_url,
    imagePath: product.image_path,
    finalUrl: imageUrl,
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/epicerie" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux produits
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
            onError={(e) => {
              console.error(`Erreur de chargement de l'image pour ${product.name}:`, imageUrl)
              e.currentTarget.src = "/placeholder.svg?height=600&width=600"
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-2xl font-bold text-green-700 mb-4">{formatPrice(product.price)}</div>

          {product.categories && (
            <div className="mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {product.categories.name}
              </span>
            </div>
          )}

          <div className="prose mb-6">
            <p>{product.description}</p>
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              description: product.description || "",
              price: product.price,
              category: product.categories?.name || "",
              image: imageUrl,
            }}
          />
        </div>
      </div>
    </div>
  )
}

