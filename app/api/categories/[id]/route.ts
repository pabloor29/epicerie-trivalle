import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"

// Récupérer une catégorie par son ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const { id } = params

    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de la catégorie" }, { status: 500 })
  }
}

// Mettre à jour une catégorie
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, icon } = await request.json()
    const supabase = createServerSupabaseClient()
    const { id } = params

    // Vérifier si la catégorie existe
    const { data: existingCategory, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 })
    }

    // Valider les données
    if (!name) {
      return NextResponse.json({ error: "Le nom de la catégorie est requis" }, { status: 400 })
    }

    // Créer un slug à partir du nom
    const slug = slugify(name)

    // Mettre à jour la catégorie dans la base de données
    const { data: updatedCategory, error: updateError } = await supabase
      .from("categories")
      .update({
        name,
        slug,
        icon,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Erreur lors de la mise à jour de la catégorie" }, { status: 500 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la catégorie" }, { status: 500 })
  }
}

// Supprimer une catégorie
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const { id } = params

    // Vérifier si la catégorie existe
    const { data: existingCategory, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 })
    }

    // Supprimer la catégorie de la base de données
    const { error: deleteError } = await supabase.from("categories").delete().eq("id", id)

    if (deleteError) {
      return NextResponse.json({ error: "Erreur lors de la suppression de la catégorie" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de la catégorie" }, { status: 500 })
  }
}

