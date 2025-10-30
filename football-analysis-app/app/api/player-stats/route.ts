import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get("teamId")
    const tournamentId = searchParams.get("tournamentId")
    const stat = searchParams.get("stat") || "goals"
    const lastGames = searchParams.get("lastGames") || "5"
    const fixtureId = searchParams.get("fixtureId")

    if (!teamId || !tournamentId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Get current date range (today) automaticamente
    const now = new Date()
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime() / 1000
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime() / 1000

    // Build the API URL (RW Tips public API) com parâmetros mínimos suportados
    const url = new URL(`https://rw-tips.vercel.app/api/player-stats`)
    url.searchParams.set("stat", stat)
    url.searchParams.set("teamId", teamId!)
    url.searchParams.set("tournamentId", tournamentId!)
    url.searchParams.set("lastGames", lastGames)
    
    if (fixtureId) {
      // Versão anterior usa 'fixtureId' (singular)
      url.searchParams.set("fixtureId", fixtureId)
    }

    console.log("[v0] Fetching player stats from:", url.toString())

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("[v0] API error response:", errorBody)
      return NextResponse.json({
        error: "Failed to fetch player stats",
        status: response.status,
        url: url.toString(),
        details: errorBody
      }, { status: response.status })
    }

    const data = await response.json()
    
    // Filter players by teamId
    if (data.players) {
      data.players = data.players.filter((player: any) => player.teamId === Number.parseInt(teamId))
    }

    console.log("[v0] Successfully fetched player stats")
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching player stats:", error)
    return NextResponse.json({ error: "Failed to fetch player stats" }, { status: 500 })
  }
}

