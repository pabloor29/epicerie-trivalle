import { createAdminSupabaseClient } from "./admin"

// Nom du bucket pour stocker les images des produits
export const PRODUCT_IMAGES_BUCKET = "product-images"

// Initialiser le bucket de stockage pour les images des produits
export async function initializeStorage() {
  // Utiliser le client admin pour créer le bucket
  const supabaseAdmin = createAdminSupabaseClient()

  try {
    // Vérifier si le bucket existe déjà
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()

    if (bucketsError) {
      console.error("Erreur lors de la récupération des buckets:", bucketsError)
      throw bucketsError
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === PRODUCT_IMAGES_BUCKET)

    // Créer le bucket s'il n'existe pas
    if (!bucketExists) {
      console.log("Création du bucket:", PRODUCT_IMAGES_BUCKET)
      const { data, error } = await supabaseAdmin.storage.createBucket(PRODUCT_IMAGES_BUCKET, {
        public: true, // Les images seront accessibles publiquement
        fileSizeLimit: 5242880, // 5MB
      })

      if (error) {
        console.error("Erreur lors de la création du bucket:", error)
        throw error
      }

      console.log(`Bucket ${PRODUCT_IMAGES_BUCKET} créé avec succès:`, data)

      // Configurer explicitement une politique d'accès public pour le bucket
      try {
        // Politique pour permettre la lecture publique des fichiers
        const { error: policyError } = await supabaseAdmin.storage
          .from(PRODUCT_IMAGES_BUCKET)
          .createPolicy("public-read", {
            name: "Public Read Access",
            definition: {
              type: "READ",
              permissions: ["anon", "authenticated"],
              condition: {},
            },
          })

        if (policyError) {
          console.error("Erreur lors de la création de la politique d'accès public:", policyError)
        } else {
          console.log("Politique d'accès public créée avec succès")
        }
      } catch (policyError) {
        console.error("Exception lors de la création de la politique d'accès:", policyError)
      }
    } else {
      console.log(`Bucket ${PRODUCT_IMAGES_BUCKET} existe déjà`)
    }

    return true
  } catch (error) {
    console.error("Erreur lors de l'initialisation du stockage:", error)
    throw error
  }
}

// Modifier la fonction uploadProductImage pour utiliser directement les URLs Supabase
export async function uploadProductImage(file: File, productId: string) {
  if (!file || file.size === 0) {
    throw new Error("Fichier invalide")
  }

  // Utiliser le client admin pour le téléchargement
  const supabaseAdmin = createAdminSupabaseClient()

  try {
    // S'assurer que le bucket existe
    await initializeStorage()

    // Générer un nom de fichier unique
    const fileExt = file.name.split(".").pop()
    const fileName = `${productId}-${Date.now()}.${fileExt}`
    const filePath = `${productId}/${fileName}`

    console.log("Téléchargement du fichier:", {
      filePath,
      fileSize: file.size,
      fileType: file.type,
      fileName: file.name,
    })

    // Convertir le File en ArrayBuffer pour le téléchargement
    const arrayBuffer = await file.arrayBuffer()
    const fileData = new Uint8Array(arrayBuffer)

    // Télécharger le fichier
    const { data, error } = await supabaseAdmin.storage.from(PRODUCT_IMAGES_BUCKET).upload(filePath, fileData, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Erreur lors du téléchargement de l'image:", error)
      throw error
    }

    console.log("Fichier téléchargé avec succès:", data)

    // Obtenir l'URL publique directe de Supabase
    const { data: publicUrlData } = supabaseAdmin.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filePath)

    if (!publicUrlData.publicUrl) {
      throw new Error("Impossible d'obtenir l'URL publique de l'image")
    }

    // Ajouter un timestamp à l'URL pour éviter les problèmes de cache
    const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
    console.log("URL publique générée:", publicUrl)

    return {
      path: filePath,
      url: publicUrl,
    }
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image:", error)
    throw error
  }
}

// Supprimer une image de produit
export async function deleteProductImage(filePath: string) {
  if (!filePath) return true

  const supabaseAdmin = createAdminSupabaseClient()

  try {
    const { error } = await supabaseAdmin.storage.from(PRODUCT_IMAGES_BUCKET).remove([filePath])

    if (error) {
      console.error("Erreur lors de la suppression de l'image:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error)
    throw error
  }
}

