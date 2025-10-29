"use client"

import { UpcomingMatches } from "@/components/upcoming-matches"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  
  // Verificar se o usuário está logado usando sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true)
      const checkLogin = () => {
        try {
          const loggedIn = sessionStorage.getItem('loggedIn') === 'true'
          console.log('Status de login:', loggedIn)
          setIsLoggedIn(loggedIn)
          
          if (!loggedIn) {
            console.log('Redirecionando para página inicial...')
            window.location.href = 'https://rw-tips.netlify.app/index.html'
          }
        } catch (error) {
          console.error('Erro ao verificar login:', error)
          window.location.href = 'https://rw-tips.netlify.app/index.html'
        }
      }
      
      // Verificar imediatamente e novamente após um pequeno delay
      checkLogin()
      const timer = setTimeout(checkLogin, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!isClient || !isLoggedIn) {
    return null // Evita renderização no servidor ou enquanto redireciona
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <a href="https://rw-tips.netlify.app/visualization.html">
            <Button variant="outline">← Voltar</Button>
          </a>
          {isLoggedIn && (
            <Button 
              variant="ghost" 
              onClick={() => {
                sessionStorage.removeItem('loggedIn')
                window.location.href = 'https://rw-tips.netlify.app/index.html'
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
