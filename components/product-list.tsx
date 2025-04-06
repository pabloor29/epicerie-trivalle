import { ProductCard } from "@/components/product-card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { sanitizeImageUrl } from "@/lib/image-utils"
import { revalidatePath } from "next/cache"

interface ProductListProps {
  searchParams?: { categorie?: string }
}

export async function ProductList({ searchParams }: ProductListProps) {
  const supabase = createServerSupabaseClient() // Pas d'argument
  const categorySlug = searchParams?.categorie

  console.log("Forçage de revalidation des données") 
  revalidatePath("/") // Force la mise à jour des données Next.js

  console.log("Filtrage par catégorie:", categorySlug)

  let query = supabase
    .from("products")
    .select(`
      *,
      categories(id, name, slug)
    `)
    .eq("in_stock", true)

  if (categorySlug && categorySlug !== "tous") {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single()

      if (categoryError) {
        console.error("Erreur lors de la récupération de la catégorie:", categoryError)
      } else if (categoryData) {
        console.log("Filtrage par catégorie ID:", categoryData.id)
        query = query.eq("category_id", categoryData.id)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la catégorie:", error)
    }
  }

  const { data: products, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return <div>Erreur lors du chargement des produits.</div>
  }

  console.log("Produits récupérés:", products)

  if (!products || products.length === 0) {
    return <div className="text-center py-8">Aucun produit trouvé dans cette catégorie.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 px-4">
      {products.map((product) => {
        const imageUrl = product.image_url
          ? sanitizeImageUrl(product.image_url)
          : "/placeholder.svg?height=200&width=200"

        return (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              description: product.description || "",
              price: product.price,
              category: product.categories?.name || "",
              image: imageUrl,
            }}
            slug={product.slug}
          />
        )
      })}
    </div>
  )
}
