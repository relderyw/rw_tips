"use client"

import { useEffect, useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Event {
  id: number
  slug: string
  timeStartTimestamp: number
  homeTeamId: number
  awayTeamId: number
  homeScoreCurrent: number
  awayScoreCurrent: number
  status: string
  tournamentId: number
}

interface Team {
  id: number
  name: string
  slug: string
  shortname: string
}

interface Tournament {
  id: number
  name: string
  slug: string
}

interface UniqueTournament {
  id: number
  name: string
  slug: string
}

interface Category {
  id: number
  name: string
  slug: string
}

interface MatchData {
  events: Event
  tournaments: Tournament
  unique_tournaments: UniqueTournament
  categories: Category
  homeTeam: Team
  awayTeam: Team
}

export function UpcomingMatches({ isPremium = false }: { isPremium?: boolean }) {
  const [matches, setMatches] = useState<MatchData[]>([])
  const [loading, setLoading] = useState(true)
  const [teamFilter, setTeamFilter] = useState("")
  const [leagueFilter, setLeagueFilter] = useState("")

  useEffect(() => {
    async function fetchMatches() {
      try {
        // Get current date timestamps
        const now = new Date()
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime() / 1000
        const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime() / 1000

        const response = await fetch(`/api/matches?startOfDay=${startOfDay}&endOfDay=${endOfDay}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setMatches(data.data || [])
      } catch (error) {
        console.error("[v0] Error fetching matches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  // Get unique teams and leagues for filters
  const uniqueTeams = useMemo(() => {
    const teamSet = new Set<string>()
    matches.forEach((match) => {
      teamSet.add(match.homeTeam.name)
      teamSet.add(match.awayTeam.name)
    })
    return Array.from(teamSet).sort()
  }, [matches])

  const uniqueLeagues = useMemo(() => {
    const leagueSet = new Set<string>()
    matches.forEach((match) => {
      leagueSet.add(match.tournaments.name)
    })
    return Array.from(leagueSet).sort()
  }, [matches])

  // Filter and group matches
  const filteredAndGroupedMatches = useMemo(() => {
    let filtered = matches

    // Apply filters
    if (teamFilter) {
      filtered = filtered.filter(
        (match) => match.homeTeam.name.toLowerCase().includes(teamFilter.toLowerCase()) 
          || match.awayTeam.name.toLowerCase().includes(teamFilter.toLowerCase())
      )
    }

    if (leagueFilter) {
      filtered = filtered.filter((match) => match.tournaments.name === leagueFilter)
    }

    // Sort by time
    filtered.sort((a, b) => a.events.timeStartTimestamp - b.events.timeStartTimestamp)

    // Group by league
    const grouped = filtered.reduce((acc, match) => {
      const leagueName = match.tournaments.name
      if (!acc[leagueName]) {
        acc[leagueName] = []
      }
      acc[leagueName].push(match)
      return acc
    }, {} as Record<string, MatchData[]>)

    return grouped
  }, [matches, teamFilter, leagueFilter])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading matches...</div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">No matches found for today</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Matches</h2>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Filtrar por Time</label>
          <Input
            placeholder="Digite o nome do time..."
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Filtrar por Liga</label>
          <Select value={leagueFilter === "" ? "all" : leagueFilter} onValueChange={(value) => setLeagueFilter(value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as ligas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as ligas</SelectItem>
              {uniqueLeagues.map((league) => (
                <SelectItem key={league} value={league}>
                  {league}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grouped matches by league */}
      <div className="space-y-6">
        {Object.entries(filteredAndGroupedMatches).map(([leagueName, leagueMatches]) => (
          <div key={leagueName}>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={`https://pcvvirceciavsxxfinvv.supabase.co/storage/v1/object/public/images/unique-tournament/${leagueMatches[0].unique_tournaments?.id || leagueMatches[0].tournaments.id}.png`}
                alt={leagueName}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/medieval-jousting-tournament.png"
                }}
              />
              <h3 className="text-lg font-semibold text-foreground">{leagueName}</h3>
              <span className="text-sm text-muted-foreground">({leagueMatches.length} jogos)</span>
            </div>
            
            <div className="grid gap-4">
              {leagueMatches.map((match) => (
                <Card key={match.events.id} className="p-4 hover:bg-accent/50 transition-colors">
                  <Link
                    href={isPremium ? `/match/${match.events.id}?homeTeamId=${match.homeTeam.id}&awayTeamId=${match.awayTeam.id}&tournamentId=${match.tournaments.id}` : "#"}
                    onClick={(e) => !isPremium && e.preventDefault()}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={`https://pcvvirceciavsxxfinvv.supabase.co/storage/v1/object/public/images/unique-tournament/${match.unique_tournaments?.id || match.tournaments.id}.png`}
                            alt={match.tournaments.name}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "/medieval-jousting-tournament.png"
                            }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {match.tournaments.name} • {match.categories.name}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <img
                              src={`https://pcvvirceciavsxxfinvv.supabase.co/storage/v1/object/public/images/team/${match.homeTeam.id}.png`}
                              alt={match.homeTeam.name}
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "/diverse-professional-team.png"
                              }}
                            />
                            <span className="font-semibold text-foreground">{match.homeTeam.name}</span>
                          </div>

                          <div className="flex items-center gap-3 px-4">
                            <span className="text-sm text-muted-foreground">
                              {new Date(match.events.timeStartTimestamp * 1000).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-1 justify-end">
                            <span className="font-semibold text-foreground">{match.awayTeam.name}</span>
                            <img
                              src={`https://pcvvirceciavsxxfinvv.supabase.co/storage/v1/object/public/images/team/${match.awayTeam.id}.png`}
                              alt={match.awayTeam.name}
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "/diverse-professional-team.png"
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" className="ml-4">
                        {isPremium ? "Analyze" : "Bloqueado"}
                      </Button>
                      
                      {!isPremium && (
                        <div className="mt-2 text-center">
                          <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-md">
                            Faça login para acessar
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
