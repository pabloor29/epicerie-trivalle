import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    const supabaseAdmin = createAdminSupabaseClient()

    // Récupérer tous les produits avec des images
    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("id, image_url, image_path")
      .not("image_path", "is", null)

    if (error) {
      throw error
    }

    console.log(`Migration de ${products?.length || 0} images de produits`)

    const results = {
      total: products?.length || 0,
      success: 0,
      failed: 0,
      details: [] as any[],
    }

    // Mettre à jour chaque produit avec une URL de proxy
    for (const product of products || []) {
      try {
        if (!product.image_path) continue

        // Créer une URL de proxy
        const proxyUrl = `/api/image-proxy/${product.image_path}?t=${Date.now()}`

        // Mettre à jour le produit
        const { error: updateError } = await supabaseAdmin
          .from("products")
          .update({ image_url: proxyUrl })
          .eq("id", product.id)

        if (updateError) {
          throw updateError
        }

        results.success++
        results.details.push({
          id: product.id,
          status: "success",
          oldUrl: product.image_url,
          newUrl: proxyUrl,
        })
      } catch (err) {
        results.failed++
        results.details.push({
          id: product.id,
          status: "error",
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Erreur lors de la migration des images:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la migration des images",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

