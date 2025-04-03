"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DebugImageProps {
  url: string
  name: string
}

export function DebugImage({ url, name }: DebugImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const img = new Image()
    img.onload = () => setStatus("success")
    img.onerror = (e) => {
      setStatus("error")
      setErrorDetails(e instanceof Error ? e.message : "Erreur inconnue")
    }
    img.src = url
  }, [url, isOpen])

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="absolute top-2 right-2 z-10 bg-white/80 h-8 w-8 p-0"
      >
        ?
      </Button>
    )
  }

  return (
    <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Débogage d'image: {name}</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm font-semibold">URL de l'image:</p>
          <p className="text-xs break-all bg-gray-100 p-2 rounded">{url}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Statut:</p>
          {status === "loading" && <p className="text-blue-500">Chargement...</p>}
          {status === "success" && <p className="text-green-500">Image chargée avec succès</p>}
          {status === "error" && (
            <div>
              <p className="text-red-500">Erreur de chargement</p>
              {errorDetails && <p className="text-xs mt-1">{errorDetails}</p>}
            </div>
          )}
        </div>

        {status === "success" && (
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">Aperçu:</p>
            <img
              src={url || "/placeholder.svg"}
              alt={name}
              className="max-h-40 mx-auto object-contain bg-gray-100 rounded"
            />
          </div>
        )}
      </div>
    </div>
  )
}

