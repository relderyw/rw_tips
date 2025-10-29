"use client"

import { UpcomingMatches } from "@/components/upcoming-matches"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function Home() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = sessionStorage.getItem("loggedIn")
    const loggedIn = !!raw && raw !== "false" && raw !== "0"
    if (!loggedIn) {
      window.location.replace("https://rw-tips.netlify.app/index.html")
      return
    }
    setReady(true)
  }, [])

  // Não renderiza nada enquanto verifica/aguarda login
  if (!ready) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <a href="https://rw-tips.netlify.app/visualization.html">
            <Button variant="outline">← Voltar</Button>
          </a>
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

        <UpcomingMatches isPremium={true} />
      </div>
    </main>
  )
}
