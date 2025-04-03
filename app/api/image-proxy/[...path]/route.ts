import { type NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { PRODUCT_IMAGES_BUCKET } from "@/lib/supabase/storage"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Récupérer le chemin de l'image depuis les paramètres
    const imagePath = params.path.join("/")
    console.log("Proxy d'image demandé pour:", imagePath)

    // Utiliser le client admin pour télécharger l'image
    const supabaseAdmin = createAdminSupabaseClient()

    // Vérifier si le fichier existe
    const { data: fileExists, error: checkError } = await supabaseAdmin.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .list(imagePath.split("/")[0])

    if (checkError || !fileExists || fileExists.length === 0) {
      console.error("Fichier non trouvé dans le bucket:", checkError || "Aucun fichier trouvé")

      // Rediriger vers une image placeholder au lieu de renvoyer une erreur 404
      return NextResponse.redirect(new URL("/placeholder.svg?height=400&width=400", request.url))
    }

    // Télécharger l'image
    const { data, error } = await supabaseAdmin.storage.from(PRODUCT_IMAGES_BUCKET).download(imagePath)

    if (error) {
      console.error("Erreur lors de la récupération de l'image:", error)
      // Rediriger vers une image placeholder au lieu de renvoyer une erreur 404
      return NextResponse.redirect(new URL("/placeholder.svg?height=400&width=400", request.url))
    }

    // Déterminer le type MIME en fonction de l'extension du fichier
    const fileExtension = imagePath.split(".").pop()?.toLowerCase() || ""
    let contentType = "image/jpeg" // Par défaut

    if (fileExtension === "png") contentType = "image/png"
    else if (fileExtension === "gif") contentType = "image/gif"
    else if (fileExtension === "svg") contentType = "image/svg+xml"
    else if (fileExtension === "webp") contentType = "image/webp"

    // Retourner l'image avec le bon type MIME
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache pendant 1 an
      },
    })
  } catch (error) {
    console.error("Erreur dans le proxy d'image:", error)
    // Rediriger vers une image placeholder au lieu de renvoyer une erreur 500
    return NextResponse.redirect(new URL("/placeholder.svg?height=400&width=400", request.url))
  }
}

