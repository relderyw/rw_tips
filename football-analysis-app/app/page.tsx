import { UpcomingMatches } from "@/components/upcoming-matches"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // Verificar se o usuário está logado usando sessionStorage
  useEffect(() => {
    setIsClient(true)
    const loggedIn = sessionStorage.getItem('loggedIn') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  if (!isClient) {
    return null // Evita renderização no servidor
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <Link href="https://rw-tips.netlify.app/visualization">
            <Button variant="outline">← Voltar</Button>
          </Link>
          {isLoggedIn && (
            <Button 
              variant="ghost" 
              onClick={() => {
                sessionStorage.removeItem('loggedIn')
                setIsLoggedIn(false)
              }}
            >
              Sair
            </Button>
          )}
        </div>
        <div className="mb-8 flex items-center gap-4">
          <img
            src="https://i.ibb.co/G4Y8sHMk/Chat-GPT-Image-21-de-abr-de-2025-16-14-34-1.png"
            alt="Logo"
            className="h-16 w-auto object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Football Analysis</h1>
            <p className="text-muted-foreground">Analyze upcoming matches and team statistics</p>
          </div>
        </div>
        
        {isLoggedIn ? (
          <UpcomingMatches isPremium={true} />
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <UpcomingMatches isPremium={false} />
            </div>
            <div className="flex flex-col justify-center">
              <LoginForm />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
