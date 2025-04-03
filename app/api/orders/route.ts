import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Créer une nouvelle commande
export async function POST(request: NextRequest) {
  try {
    const { customer, items, notes, subtotal, total } = await request.json()
    const supabase = createServerSupabaseClient()

    // Valider les données
    if (!customer || !items || items.length === 0 || !subtotal || !total) {
      return NextResponse.json({ error: "Données de commande incomplètes" }, { status: 400 })
    }

    // Générer un numéro de commande unique
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

    // Insérer la commande dans la base de données
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        notes,
        subtotal,
        total,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: "Erreur lors de la création de la commande" }, { status: 500 })
    }

    // Insérer les articles de la commande
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      // Supprimer la commande si l'insertion des articles échoue
      await supabase.from("orders").delete().eq("id", order.id)

      return NextResponse.json({ error: "Erreur lors de la création des articles de la commande" }, { status: 500 })
    }

    return NextResponse.json({
      ...order,
      items: orderItems,
    })
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la commande" }, { status: 500 })
  }
}

// Récupérer toutes les commandes
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Erreur lors de la récupération des commandes" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des commandes" }, { status: 500 })
  }
}

