"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  slug?: string
}

export function ProductCard({ product, slug }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = () => {
    console.log("Ajout au panier :", product) // Vérifie si cette ligne s'affiche
    addItem(product)
    
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté à votre panier.`,
    })
  
    console.log("Toast déclenché") // Vérifie si cette ligne s'affiche
  }

  const handleImageError = () => {
    console.error(`Erreur de chargement de l'image pour ${product.name}:`, product.image)
    setImageError(true)
  }

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
        <Image
          src={
            imageError
              ? "/placeholder.svg?height=200&width=200"
              : product.image || "/placeholder.svg?height=200&width=200"
          }
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
          onError={handleImageError}
        />
      </div>
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="font-bold text-lg text-green-700">{formatPrice(product.price)}</div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{product.description}</p>
      </div>
      <div className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Ajouter au panier
        </Button>
      </div>
    </div>
  )
}

