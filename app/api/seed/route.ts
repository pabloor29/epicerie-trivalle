import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { initializeStorage } from "@/lib/supabase/storage"
import { slugify } from "@/lib/utils"

// Données de départ pour les catégories
const seedCategories = [
  { name: "Fruits et Légumes", slug: "fruits-legumes", icon: "Apple" },
  { name: "Produits Laitiers", slug: "produits-laitiers", icon: "Milk" },
  { name: "Fromages", slug: "fromages", icon: "ChevronsUp" },
  { name: "Charcuterie", slug: "charcuterie", icon: "Beef" },
  { name: "Vins", slug: "vins", icon: "Grape" },
  { name: "Boissons", slug: "boissons", icon: "Beer" },
  { name: "Épicerie Fine", slug: "epicerie-fine", icon: "Coffee" },
]

// Données de départ pour les produits
const seedProducts = [
  {
    name: "Fromage de chèvre",
    description: "Fromage de chèvre artisanal produit localement. Texture crémeuse et goût authentique.",
    price: 6.5,
    category_slug: "fromages",
    image_url: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Vin rouge bio",
    description: "Vin rouge biologique de la région, notes de fruits rouges et tanins équilibrés.",
    price: 12.9,
    category_slug: "vins",
    image_url: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Pain au levain",
    description: "Pain au levain traditionnel, cuit au feu de bois. Mie aérée et croûte croustillante.",
    price: 3.8,
    category_slug: "epicerie-fine",
    image_url: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Pommes Gala",
    description: "Pommes Gala cultivées sans pesticides dans un verger local. Croquantes et juteuses.",
    price: 3.2,
    category_slug: "fruits-legumes",
    image_url: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Yaourt nature",
    description: "Yaourt nature onctueux fabriqué avec du lait entier de vaches élevées en pâturage.",
    price: 2.5,
    category_slug: "produits-laitiers",
    image_url: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Jambon sec",
    description: "Jambon sec affiné pendant 12 mois, peu salé et très savoureux.",
    price: 7.9,
    category_slug: "charcuterie",
    image_url: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Jus de pomme",
    description: "Jus de pomme pressé à froid, sans sucre ajouté ni conservateurs.",
    price: 3.5,
    category_slug: "boissons",
    image_url: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Miel local",
    description: "Miel toutes fleurs récolté dans les environs, texture crémeuse et goût délicat.",
    price: 8.2,
    category_slug: "epicerie-fine",
    image_url: "/placeholder.svg?height=200&width=200",
  },
]

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Initialiser le stockage
    await initializeStorage()

    // Insérer les catégories
    const categoryMap = new Map()

    for (const category of seedCategories) {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: category.name,
          slug: category.slug,
          icon: category.icon,
        })
        .select()
        .single()

      if (error) {
        console.error(`Erreur lors de l'insertion de la catégorie ${category.name}:`, error)
        continue
      }

      categoryMap.set(category.slug, data.id)
    }

    // Insérer les produits
    for (const product of seedProducts) {
      const categoryId = categoryMap.get(product.category_slug)

      if (!categoryId) {
        console.error(`Catégorie non trouvée pour le produit ${product.name}`)
        continue
      }

      const { error } = await supabase.from("products").insert({
        name: product.name,
        slug: slugify(product.name),
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        category_id: categoryId,
        in_stock: true,
      })

      if (error) {
        console.error(`Erreur lors de l'insertion du produit ${product.name}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Données initiales insérées avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données:", error)
    return NextResponse.json({ error: "Erreur lors de l'initialisation des données" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Utilisez la méthode POST pour initialiser les données",
  })
}

