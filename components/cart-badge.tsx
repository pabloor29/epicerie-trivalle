"use client"

import { ShoppingCart } from 'lucide-react'
import { useCart } from "../components/cart-provider" // Ajustez le chemin si nécessaire

export default function CartBadge() {
  const { items } = useCart()
  
  // Nombre total d'articles (en tenant compte des quantités)
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  
  return (
    <div className="relative">
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <div className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full">
            {itemCount}
          </div>
        )}
        <span className="sr-only">Panier</span>
    </div>
  )
}