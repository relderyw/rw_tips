'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UpcomingMatches } from "@/components/upcoming-matches"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticação no client-side
    const checkAuth = async () => {
      try {
        // Fazer uma requisição para verificar se os cookies estão válidos
        const response = await fetch('/api/verify-auth')
        
        if (!response.ok) {
          // Não autenticado, redirecionar
          window.location.href = 'https://rw-tips.netlify.app/index.html'
          return
        }
        
        const data = await response.json()
        
        if (!data.authenticated) {
          window.location.href = 'https://rw-tips.netlify.app/index.html'
          return
        }
        
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        window.location.href = 'https://rw-tips.netlify.app/index.html'
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // O redirect já foi feito no useEffect
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <Link href="https://rw-tips.netlify.app/visualization.html">
            <Button variant="outline">← Voltar</Button>
          </Link>
          <Button 
            variant="destructive" 
            onClick={() => {
              // Limpar autenticação
              document.cookie = 'authToken=; Max-Age=0; path=/;'
              document.cookie = 'tokenExpiry=; Max-Age=0; path=/;'
              window.location.href = 'https://rw-tips.netlify.app/index.html'
            }}
          >
            Sair
          </Button>
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
        <UpcomingMatches />
      </div>
    </main>
  )
}