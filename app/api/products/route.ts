import { type NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { uploadProductImage } from "@/lib/supabase/storage"
import { slugify } from "@/lib/utils"

// Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const supabase = createAdminSupabaseClient()

    // Extraire les données du formulaire
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const categoryId = formData.get("category_id") as string
    const inStock = formData.get("in_stock") === "true"
    const imageFile = formData.get("image") as File | null

    console.log("Données reçues:", {
      name,
      price,
      categoryId,
      inStock,
      hasImage: !!imageFile,
      imageSize: imageFile?.size,
      imageType: imageFile?.type,
      imageName: imageFile?.name,
    })

    // Valider les données
    if (!name || !price) {
      return NextResponse.json({ error: "Nom et prix sont requis" }, { status: 400 })
    }

    // Créer un slug à partir du nom
    const slug = slugify(name)

    // Préparer les données du produit
    const productData: any = {
      name,
      slug,
      description,
      price,
      category_id: categoryId === "none" ? null : categoryId,
      in_stock: inStock,
    }

    // Créer d'abord le produit sans image
    const { data: product, error } = await supabase.from("products").insert(productData).select().single()

    if (error) {
      console.error("Erreur lors de la création du produit:", error)
      return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 })
    }

    console.log("Produit créé:", product)

    // Télécharger l'image si elle existe
    if (imageFile && imageFile.size > 0) {
      try {
        console.log("Téléchargement de l'image:", imageFile.name, imageFile.size, imageFile.type)

        const { path, url } = await uploadProductImage(imageFile, product.id)
        console.log("Image téléchargée:", { path, url })

        // Mettre à jour le produit avec l'URL et le chemin de l'image
        const { data: updatedProduct, error: updateError } = await supabase
          .from("products")
          .update({
            image_url: url,
            image_path: path,
          })
          .eq("id", product.id)
          .select(`
            *,
            categories(id, name, slug)
          `)
          .single()

        if (updateError) {
          console.error("Erreur lors de la mise à jour du produit avec l'image:", updateError)
          return NextResponse.json({
            ...product,
            warning: "Le produit a été créé mais l'image n'a pas pu être associée",
          })
        }

        console.log("Produit mis à jour avec l'image:", updatedProduct)
        return NextResponse.json(updatedProduct)
      } catch (imageError) {
        console.error("Erreur lors du téléchargement de l'image:", imageError)

        // Récupérer le produit avec les informations de catégorie
        const { data: productWithCategory, error: fetchError } = await supabase
          .from("products")
          .select(`
            *,
            categories(id, name, slug)
          `)
          .eq("id", product.id)
          .single()

        if (fetchError) {
          console.error("Erreur lors de la récupération du produit avec catégorie:", fetchError)
          return NextResponse.json(product)
        }

        return NextResponse.json({
          ...productWithCategory,
          warning: "Le produit a été créé mais l'image n'a pas pu être téléchargée",
        })
      }
    } else {
      // Récupérer le produit avec les informations de catégorie
      const { data: productWithCategory, error: fetchError } = await supabase
        .from("products")
        .select(`
          *,
          categories(id, name, slug)
        `)
        .eq("id", product.id)
        .single()

      if (fetchError) {
        console.error("Erreur lors de la récupération du produit avec catégorie:", fetchError)
        return NextResponse.json(product)
      }

      return NextResponse.json(productWithCategory)
    }
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la création du produit",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Récupérer tous les produits
export async function GET() {
  try {
    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(id, name, slug)
      `)
      .order("name")

    if (error) {
      console.error("Erreur lors de la récupération des produits:", error)
      return NextResponse.json({ error: "Erreur lors de la récupération des produits" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des produits" }, { status: 500 })
  }
}

