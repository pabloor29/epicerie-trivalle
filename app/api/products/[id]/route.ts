import { type NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { uploadProductImage, deleteProductImage } from "@/lib/supabase/storage"
import { slugify } from "@/lib/utils"

// Récupérer un produit par son ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminSupabaseClient()
    const { id } = params

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(id, name, slug)
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération du produit" }, { status: 500 })
  }
}

// Mettre à jour un produit
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()
    const supabase = createAdminSupabaseClient()
    const { id } = params

    // Vérifier si le produit existe
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Extraire les données du formulaire
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const categoryId = formData.get("category_id") as string
    const inStock = formData.get("in_stock") === "true"
    const imageFile = formData.get("image") as File | null

    // Valider les données
    if (!name || !price) {
      return NextResponse.json({ error: "Nom et prix sont requis" }, { status: 400 })
    }

    // Créer un slug à partir du nom
    const slug = slugify(name)

    // Préparer les données de mise à jour
    const updateData: any = {
      name,
      slug,
      description,
      price,
      category_id: categoryId === "none" ? null : categoryId,
      in_stock: inStock,
      updated_at: new Date().toISOString(),
    }

    // Télécharger la nouvelle image si elle existe
    if (imageFile && imageFile.size > 0) {
      try {
        // Supprimer l'ancienne image si elle existe
        if (existingProduct.image_path) {
          await deleteProductImage(existingProduct.image_path)
        }

        // Télécharger la nouvelle image
        const { path, url } = await uploadProductImage(imageFile, id)

        // Ajouter l'URL et le chemin de l'image aux données de mise à jour
        updateData.image_url = url
        updateData.image_path = path
      } catch (imageError) {
        console.error("Erreur lors du téléchargement de l'image:", imageError)
        // Continuer sans mettre à jour l'image
      }
    }

    // Mettre à jour le produit dans la base de données
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        categories(id, name, slug)
      `)
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Erreur lors de la mise à jour du produit" }, { status: 500 })
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du produit" }, { status: 500 })
  }
}

// Supprimer un produit
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminSupabaseClient()
    const { id } = params

    // Récupérer le produit pour obtenir le chemin de l'image
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("image_path")
      .eq("id", id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Supprimer l'image si elle existe
    if (product.image_path) {
      try {
        await deleteProductImage(product.image_path)
      } catch (imageError) {
        console.error("Erreur lors de la suppression de l'image:", imageError)
      }
    }

    // Supprimer le produit de la base de données
    const { error: deleteError } = await supabase.from("products").delete().eq("id", id)

    if (deleteError) {
      return NextResponse.json({ error: "Erreur lors de la suppression du produit" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du produit" }, { status: 500 })
  }
}

