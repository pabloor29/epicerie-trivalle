import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Fonction pour formater un prix
export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

// Fonction pour créer un slug à partir d'une chaîne
export function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

// Fonction pour générer un numéro de commande
export function generateOrderNumber() {
  return `ORD-${Date.now().toString().slice(-6)}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

