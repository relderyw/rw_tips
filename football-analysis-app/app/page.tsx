"use client"

import { UpcomingMatches } from "@/components/upcoming-matches"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return

    setIsClient(true)

    const raw = sessionStorage.getItem("loggedIn")
    const loggedIn = !!raw && raw !== "false" && raw !== "0"
    console.log("🔐 Status de login (raw):", raw, "=> parsed:", loggedIn)
    setIsLoggedIn(loggedIn)
  }, [])

  // Caso já tenha determinado que o usuário NÃO está logado, redireciona
  useEffect(() => {
    if (isClient && isLoggedIn === false) {
      console.log("🚪 Usuário não autenticado, redirecionando...")
      window.location.href = "https://rw-tips.netlify.app/index.html"
    }
  }, [isClient, isLoggedIn])

  // Evita renderização enquanto carrega o estado
  if (!isClient || isLoggedIn === null) {
    return null
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
                sessionStorage.removeItem("loggedIn")
                window.location.href = "https://rw-tips.netlify.app/index.html"
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
            <p className="text-muted-foreground">
              Analyze upcoming matches and team statistics
            </p>
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
