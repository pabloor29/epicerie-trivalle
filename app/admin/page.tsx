import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord d'administration</h1>
        <a href="/api/auth/logout" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Déconnexion
        </a>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Bienvenue, Admin</h2>
        <p className="text-gray-600">Vous êtes connecté en tant qu'administrateur.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Gestion des produits</h2>
          <p className="text-gray-600 mb-4">Ajoutez, modifiez ou supprimez des produits de votre catalogue.</p>
          <Link
            href="/admin/produits"
            className="inline-block w-fit bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Gérer les produits
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Gestion des catégories</h2>
          <p className="text-gray-600 mb-4">Créez et gérez les catégories de produits de votre catalogue.</p>
          <Link
            href="/admin/categories"
            className="inline-block w-fit bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Gérer les catégories
          </Link>
        </div>

        {/* <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Gestion des commandes</h2>
          <p className="text-gray-600 mb-4">Consultez et gérez les commandes de vos clients.</p>
          <Link
            href="/admin/commandes"
            className="inline-block w-fit bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Gérer les commandes
          </Link>
        </div> */}
      </div>
    </div>
  )
}

