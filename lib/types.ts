export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Customer {
  name: string
  email: string
  phone: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  date: string
  status: "pending" | "processing" | "completed" | "cancelled"
  subtotal: number
  total: number
  notes?: string
}

// Simplifié pour éviter les problèmes avec les profils
export interface User {
  id: string
  email: string
  fullName?: string
  role?: string
}

