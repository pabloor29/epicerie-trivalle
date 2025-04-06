import { Mail, MapPin, Phone, Clock } from "lucide-react"

export const metadata = {
  title: "Contact - Épicerie du Quartier",
  description: "Contactez-nous et trouvez nos informations pratiques.",
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Venez nous rendre visite !</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="flex items-center justify-center">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.021857641856!2d2.3590742763361434!3d43.2090308810449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12ae2db0bf9f7179%3A0x2c61c00ed9ed09f9!2sL&#39;%C3%A9choppe%20rue%20trivalle!5e0!3m2!1sfr!2sfr!4v1743965978615!5m2!1sfr!2sfr" 
            width="600"
            height="450" 
            loading="lazy"
            style={{ 
              border: 10,
              borderRadius: 25
             }}
          >
          </iframe>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6">Informations pratiques</h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 mr-3 text-blue-800 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Adresse</h3>
                <p className="mt-1">
                  30 rue Trivalle
                  <br />
                  11000 Carcassonne, France
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-6 w-6 mr-3 text-blue-800 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Horaires d&apos;ouverture</h3>
                <p className="mt-1">
                  Lundi - Dimanche: 8h00 - 21h00
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-6 w-6 mr-3 text-blue-800 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Téléphone</h3>
                <a href="tel:+33603920724">+33 6 03 92 07 24</a>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-6 w-6 mr-3 text-blue-800 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Email</h3>
                <a href="mailto:">
                  example@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

