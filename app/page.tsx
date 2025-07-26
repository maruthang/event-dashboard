"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { GoogleSheetsIntegration } from "@/components/google-sheets-integration"
import Image from "next/image"
import { calculateTeamTotal } from "@/lib/utils"
import GoldMedal from "@/public/gold-medal.svg"
import SilverMedal from "@/public/silver-medal.svg"
import BronzeMedal from "@/public/bronze-medal.svg"
import Celebration from "@/public/celebration.svg"


// Dynamic sports interface
interface Sport {
  name: string
  displayName: string
}

// Team interface with dynamic games
interface Team {
  id: number
  name: string
  totalPoints: number
  games: Record<string, number> // Dynamic sports
  previousRank?: number
  currentRank: number
  memberPhotos: string[]
}

// Default teams structure for 8 teams with 3 photos each
const defaultTeams: Team[] = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `Team ${index + 1}`,
  totalPoints: 0,
  currentRank: 0,
  memberPhotos: [
    "/placeholder.svg?height=60&width=60",
    "/placeholder.svg?height=60&width=60",
    "/placeholder.svg?height=60&width=60",
  ],
  games: {},
}))

// Hardcoded max points for each game
const GAME_MAX_POINTS: Record<string, number> = {
  alangkar: 10,
  "Social Media": 10,
  "Photo Contest": 10,
  carrom: 15,
  chess: 15,
  rangoli: 10,
  "Treasure Hunt": 10,
  // Add other games below, default to 5 if not listed
}

function normalizeKey(key: string) {
  return key
    .normalize('NFKC')
    .replace(/\s+/g, '') // remove all whitespace
    .toLowerCase();
}

function getGameMaxPoints(game: string) {
  const key = game.trim().toLowerCase();
  // Use the same logic as CUSTOM_GAME_SCORES in utils.ts
  const customScores: Record<string, number> = {
    alangkar: 10,
    "social media": 10,
    "photo contest": 10,
    carrom: 15,
    chess: 15,
    rangoli: 10,
    "treasure hunt": 10,
  };
  return customScores.hasOwnProperty(key) ? customScores[key] : 5;
}

export default function Dashboard() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [sports, setSports] = useState<Sport[]>([])

  // Handle Google Sheets data updates
  const handleGoogleSheetsUpdate = (data: { teams: any[], gameNames: any }) => {
    if (data.teams.length === 0) return

    // Extract sports from the gameNames object
    const extractedSports: Sport[] = []
    Object.keys(data.gameNames).forEach(key => {
      extractedSports.push({
        name: key,
        displayName: data.gameNames[key]
      })
    })
    setSports(extractedSports)

    // Build teams with correct totalPoints
    const updatedTeams = data.teams.map((teamData, index) => {
      const games: Record<string, number> = {}
      Object.keys(data.gameNames).forEach(gameKey => {
        if (teamData[gameKey] !== undefined) {
          games[gameKey] = teamData[gameKey] || 0
        }
      })

      // Set center image based on team name
      const teamName = teamData.name || `Team ${index + 1}`
      let centerImage = teamData.photo2 || "/placeholder.svg?height=60&width=60"
      let leftImage = teamData.photo1 || "/placeholder.svg?height=60&width=60"
      let rightImage = teamData.photo3 || "/placeholder.svg?height=60&width=60"

      if (teamName === "SkyReach") {
        centerImage = "/shastipriyan.jpeg"
        leftImage = "/soorya.jpeg"
        rightImage = "/ajithkumar.jpeg"
      } else if (teamName === "BoldHeart") {
        centerImage = "/aravind.png"
        leftImage = "/elavarasan.jpeg"
        rightImage = "/harish.png"
      } else if (teamName === "BlazeWard") {
        centerImage = "/shakthiprasath.jpeg"
        leftImage = "/sivakaman.jpg"
        rightImage = "/nisha.jpeg"
      } else if (teamName === "EarthHold") {
        centerImage = "/bharadwaj.jpeg"
        leftImage = "/mani.png"
        rightImage = "/stalin.jpeg"
      } else if (teamName === "WingSpire") {
        centerImage = "/vivek.png"
        leftImage = "/baskar.png"
        rightImage = "/harini.jpeg"
      } else if (teamName === "JoyVale") {
        centerImage = "/arjun.png"
        leftImage = "/saketh.jpeg"
        rightImage = "/aishwarya.jpeg"
      } else if (teamName === "MightBorne") {
        centerImage = "/sarath.jpeg"
        leftImage = "/reho.jpeg"
        rightImage = "/preethi.jpeg"
      } else if (teamName === "WaveCrest") {
        centerImage = "/prakash.jpeg"
        leftImage = "/avinash.png"
        rightImage = "/kalashree.jpeg"
      }

      return {
        id: teamData.id || index + 1,
        name: teamName,
        totalPoints: calculateTeamTotal(games),
        currentRank: 0, // will be set after sorting
        previousRank: teams.find((t) => t.id === (teamData.id || index + 1))?.currentRank,
        memberPhotos: [
          leftImage,
          centerImage,
          rightImage,
        ],
        games,
      }
    })

    // Sort by total points (highest first) and update ranks
    const sortedTeams = updatedTeams
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((team, index) => ({
        ...team,
        currentRank: index + 1,
      }))

    setTeams(sortedTeams)
    setIsConnected(true)
  }

  // Get card styling based on rank and score
  const getCardStyle = (team: Team) => {
    const totalPoints = Object.values(team.games).reduce((sum, points) => sum + (points || 0), 0)
    const maxPossiblePoints = sports.length * 5
    const scorePercentage = (totalPoints / maxPossiblePoints) * 100

    if (team.currentRank <= 3) {
      // Top 3 teams - premium styling
      if (team.currentRank === 1) {
        return "bg-gradient-to-br from-yellow-600/90 to-yellow-800/90 border-yellow-500/50 hover:from-yellow-500/90 hover:to-yellow-700/90"
      } else if (team.currentRank === 2) {
        return "bg-gradient-to-br from-gray-600/90 to-gray-800/90 border-gray-500/50 hover:from-gray-500/90 hover:to-gray-700/90"
      } else {
        return "bg-gradient-to-br from-amber-600/90 to-amber-800/90 border-amber-500/50 hover:from-amber-500/90 hover:to-amber-700/90"
      }
    } else {
      // Other teams - score-based styling
      if (scorePercentage >= 80) {
        return "bg-gradient-to-br from-green-600/80 to-green-800/80 border-green-500/50 hover:from-green-500/80 hover:to-green-700/80"
      } else if (scorePercentage >= 60) {
        return "bg-gradient-to-br from-blue-600/80 to-blue-800/80 border-blue-500/50 hover:from-blue-500/80 hover:to-blue-700/80"
      } else if (scorePercentage >= 40) {
        return "bg-gradient-to-br from-orange-600/80 to-orange-800/80 border-orange-500/50 hover:from-orange-500/80 hover:to-orange-700/80"
      } else {
        return "bg-gradient-to-br from-red-600/80 to-red-800/80 border-red-500/50 hover:from-red-500/80 hover:to-red-700/80"
      }
    }
  }

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Image src={GoldMedal} alt="Medal" width={100} height={100} />
        )
      case 2:
        return (
          <Image src={SilverMedal} alt="Medal" width={100} height={100} />
        )
      case 3:
        return (
          <Image src={BronzeMedal} alt="Medal" width={100} height={100} />
        )
      default:
        return null
    }
  }
  const getCelebrationText = () => {
    return (
      <Image src={Celebration} alt="Celebration" width={100} height={100} />
    )
  }

  if (selectedTeam) {
    return <TeamDetails team={selectedTeam} sports={sports} onBack={() => setSelectedTeam(null)} />
  }

  // Show connection screen if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-10 w-28 h-28 bg-cyan-400 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-md mx-auto relative z-10 flex items-center justify-center min-h-screen">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/50 backdrop-blur-sm shadow-2xl w-full">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Image src="/finstein_logo.svg" alt="Finstein" width={200} height={150} className="mx-auto" />
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">Score Board</h1>
              <p className="text-blue-200 mb-8">Connect to Google Sheets to view live scores</p>

              <div className="space-y-4">
                <GoogleSheetsIntegration onDataUpdate={handleGoogleSheetsUpdate} />
                {/* <SetupGuide /> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-cyan-400 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            {/* <div className="text-3xl font-bold text-white flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded"></div>
              <span>Finstein</span>
            </div> */}
            <Image src="/finstein_logo.svg" alt="Finstein" width={200} height={150} />
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Score Board</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right text-white">
              {/* <div className="text-6xl font-bold text-cyan-400 relative">
                  5
                  <sup className="absolute -top-2 -right-2 text-sm font-normal">th</sup>
                </div>
                <div className="text-sm">Anniversary</div>
                <div className="text-xs opacity-75">Celebration</div> */}
              {getCelebrationText()}
            </div>
            {/* <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button> */}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-center space-x-4"
          >
            <Button
              onClick={() => {
                setTeams([])
                setIsConnected(false)
                setShowSettings(false)
              }}
              variant="outline"
              className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30"
            >
              Disconnect
            </Button>
          </motion.div>
        )}

        {/* Top 3 Teams */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {teams
              .slice() // copy to avoid mutating state
              .sort((a, b) => b.totalPoints - a.totalPoints)
              .slice(0, 3)
              .map((team: Team, index: number) => (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="cursor-pointer "
                  onClick={() => setSelectedTeam(team)}
                >
                  <Card className="bg-[#094F94]/90 border-[#094F94]/50 backdrop-blur-sm hover:bg-[#094F94] transition-all duration-300 transform hover:scale-105">
                    <CardContent className="p-6 h-80 flex flex-col">
                      {/* Top Section with Medal and Photos */}
                      <div className="flex-1 flex flex-col">
                        {/* Medal */}
                        <div className="flex justify-start absolute top-0 left-0">{getMedalIcon(team.currentRank)}</div>

                        {/* Team Photos - Positioned slightly above the card */}
                        <div className="flex justify-center -mt-14 mb-4 z-10 relative">
                          <div className="flex justify-center items-center -space-x-4">
                            {/* Left Image (small) */}
                            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-gray-300">
                              <img
                                src={team.memberPhotos[0] || "/placeholder.svg"}
                                alt="Team member 1"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Center Image (larger) */}
                            <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-300 z-10">
                              <img
                                src={team.memberPhotos[1] || "/placeholder.svg"}
                                alt="Team member 2"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Right Image (small) */}
                            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-gray-300">
                              <img
                                src={team.memberPhotos[2] || "/placeholder.svg"}
                                alt="Team member 3"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Bottom Section with Name and Stats */}
                      <div className="flex flex-col">
                        {/* Team Name */}
                        <h3 className="text-2xl font-bold text-white text-center mb-4">{team.name}</h3>

                        {/* Rank and Points */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-700/50 rounded-lg p-3 text-center">
                            <div className="text-sm text-blue-200 mb-1">Rank</div>
                            <div className="text-3xl font-bold text-cyan-400">{team.currentRank}</div>
                          </div>
                          <div className="bg-blue-700/50 rounded-lg p-3 text-center">
                            <div className="text-sm text-blue-200 mb-1">Points</div>
                            <div className="text-3xl font-bold text-cyan-400">
                              {calculateTeamTotal(team.games)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Remaining Teams */}
        <div className="space-y-4">
          <AnimatePresence>
            {teams
              .slice() // copy to avoid mutating state
              .sort((a, b) => b.totalPoints - a.totalPoints)
              .slice(3)
              .map((team: Team, index: number) => (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 3) * 0.1 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedTeam(team)}
                >
                  <Card className="bg-[#094F94]/90 border-[#094F94]/50 backdrop-blur-sm hover:bg-[#094F94] transition-all duration-300 transform hover:scale-105">
                    <CardContent className="p-4 sm:p-6">
                      {/* Mobile Layout */}
                      <div className="block sm:hidden">
                        {/* Team Photos - Top */}
                        <div className="flex justify-center mb-3">
                          <div className="flex justify-center -space-x-2">
                            {team.memberPhotos.map((photo, idx) => (
                              <div
                                key={idx}
                                className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-300"
                              >
                                <img
                                  src={photo || "/placeholder.svg"}
                                  alt={`Team member ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Team Name - Middle */}
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-white">{team.name}</h3>
                        </div>

                        {/* Rank and Points - Bottom */}
                        <div className="flex items-center justify-center space-x-4">
                          {/* Rank */}
                          <div className="bg-blue-700/50 rounded-lg p-2 text-center min-w-[60px]">
                            <div className="text-xs text-blue-200 mb-1">Rank</div>
                            <div className="text-xl font-bold text-cyan-400">{team.currentRank}</div>
                          </div>

                          {/* Points */}
                          <div className="bg-blue-700/50 rounded-lg p-2 text-center min-w-[60px]">
                            <div className="text-xs text-blue-200 mb-1">Points</div>
                            <div className="text-xl font-bold text-cyan-400">
                              {calculateTeamTotal(team.games)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        {/* Rank */}
                        <div className="bg-blue-700/50 rounded-lg p-3 min-w-[80px] text-center">
                          <div className="text-sm text-blue-200 mb-1">Rank</div>
                          <div className="text-2xl font-bold text-cyan-400">{team.currentRank}</div>
                        </div>

                        {/* Team Name */}
                        <div className="flex items-center flex-1 justify-evenly">
                          <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">{team.name}</h3>
                          </div>
                          <div className="flex justify-center -space-x-2">
                            {team.memberPhotos.map((photo, idx) => (
                              <div
                                key={idx}
                                className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-gray-300"
                              >
                                <img
                                  src={photo || "/placeholder.svg"}
                                  alt={`Team member ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Points */}
                        <div className="bg-blue-700/50 rounded-lg p-3 min-w-[80px] text-center">
                          <div className="text-sm text-blue-200 mb-1">Points</div>
                          <div className="text-2xl font-bold text-cyan-400">
                            {calculateTeamTotal(team.games)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function TeamDetails({ team, sports, onBack }: { team: Team; sports: Sport[]; onBack: () => void }) {
  // Calculate total points dynamically from the games object
  const calculatedTotalPoints = calculateTeamTotal(team.games)
  const maxPoints = 100

  // Generate display names for sports dynamically
  const getSportDisplayName = (sportKey: string) => {
    // Find the sport in the sports array to get the display name
    const sport = sports.find(s => s.name === sportKey)
    return sport ? sport.displayName : sportKey.charAt(0).toUpperCase() + sportKey.slice(1).replace(/([A-Z])/g, ' $1')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10 pt-30">
        <div className="mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-14 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/50 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6">
              {/* Team Photos - Centered at top */}
              <div className="flex justify-center -mt-14 mb-4 z-10 relative">
                <div className="flex justify-center items-center -space-x-4">
                  {/* Left Image (small) */}
                  <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-gray-300">
                    <img
                      src={team.memberPhotos[0] || "/placeholder.svg"}
                      alt="Team member 1"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Center Image (larger) */}
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-300 z-10">
                    <img
                      src={team.memberPhotos[1] || "/placeholder.svg"}
                      alt="Team member 2"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Right Image (small) */}
                  <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-gray-300">
                    <img
                      src={team.memberPhotos[2] || "/placeholder.svg"}
                      alt="Team member 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Team Name */}
              <h1 className="text-3xl font-bold text-white text-center mb-6">{team.name}</h1>

              {/* Games List */}
              <div className="space-y-2 mb-6">
                {Object.entries(team.games).map(([game, points]) => (
                  <motion.div
                    key={game}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Object.keys(team.games).indexOf(game) * 0.1 }}
                    className="bg-blue-800/60 rounded-lg p-3 flex justify-between items-center"
                  >
                    <span className="text-white font-medium">{getSportDisplayName(game)}</span>
                    <span className="text-cyan-300 font-bold">{points}/{getGameMaxPoints(game)}</span>
                  </motion.div>
                ))}
              </div>

              {/* Total */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 flex justify-between items-center"
              >
                <span className="text-white font-bold">Total</span>
                <span className="text-white font-bold text-xl">
                  {calculatedTotalPoints}/{maxPoints}
                </span>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
