// Google Sheets Integration Service
// This connects to your specific Google Sheets document

export interface TeamData {
  id: number
  name: string
  carrom: number
  basketball: number
  chess: number
  cricket: number
  football: number
  badminton: number
  tabletennis: number
  volleyball: number
  [key: string]: any // Allow dynamic game properties
}

export interface GameNames {
  [key: string]: string // gameKey -> displayName mapping
}

export class GoogleSheetsService {
  private static instance: GoogleSheetsService
  private readonly SHEET_ID = "1Uh0CH4OBi1DCYn4dHWPPIsNaDvaiEpaWwGkcDyQbkTs"
  private readonly API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || ""
  private updateCallbacks: Array<(data: { teams: TeamData[], gameNames: GameNames }) => void> = []
  private isPolling = false

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService()
    }
    return GoogleSheetsService.instance
  }

  // Fetch data from Google Sheets with better error handling
  async fetchTeamData(): Promise<{ teams: TeamData[], gameNames: GameNames }> {
    try {
      // Check if API key is provided
      if (!this.API_KEY) {
        throw new Error(
          "Google Sheets API key not found. Please add NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY to your .env.local file.",
        )
      }

      const range = "Sheet1!A1:ZZ1000" // Large range to handle many columns and rows
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${range}?key=${this.API_KEY}`


      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Response Error:", errorData)

        if (response.status === 403) {
          throw new Error("Access denied. Please make sure your Google Sheet is public and your API key is valid.")
        } else if (response.status === 404) {
          throw new Error("Spreadsheet not found. Please check the sheet ID.")
        } else {
          throw new Error(`API Error: ${response.status} - ${errorData.error?.message || "Unknown error"}`)
        }
      }

      const data = await response.json()

      if (data.values && data.values.length > 0) {
      }

      if (!data.values || data.values.length === 0) {
        console.warn("No data found in spreadsheet, using fallback data")
        const fallbackData = this.getFallbackData()
        return {
          teams: fallbackData,
          gameNames: {
            carrom: 'Carrom',
            basketball: 'Basketball',
            chess: 'Chess',
            cricket: 'Cricket',
            football: 'Football',
            badminton: 'Badminton',
            tabletennis: 'Table Tennis',
            volleyball: 'Volleyball'
          }
        }
      }

      return this.parseSheetData(data.values)
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error)

      // Return fallback data instead of throwing error
      const fallbackData = this.getFallbackData()
      return {
        teams: fallbackData,
        gameNames: {
          carrom: 'Carrom',
          basketball: 'Basketball',
          chess: 'Chess',
          cricket: 'Cricket',
          football: 'Football',
          badminton: 'Badminton',
          tabletennis: 'Table Tennis',
          volleyball: 'Volleyball'
        }
      }
    }
  }

  // Provide fallback data when Google Sheets is not available
  private getFallbackData(): TeamData[] {
    return [
      {
        id: 1,
        name: "Maruthu 1",
        carrom: 1,
        basketball: 2,
        chess: 3,
        cricket: 0,
        football: 0,
        badminton: 0,
        tabletennis: 0,
        volleyball: 0,
      },
      {
        id: 2,
        name: "Maruthu 2",
        carrom: 1,
        basketball: 3,
        chess: 0,
        cricket: 0,
        football: 0,
        badminton: 0,
        tabletennis: 0,
        volleyball: 0,
      },
      {
        id: 3,
        name: "Maruthu 3",
        carrom: 3,
        basketball: 2,
        chess: 0,
        cricket: 0,
        football: 0,
        badminton: 0,
        tabletennis: 0,
        volleyball: 0,
      },
      {
        id: 4,
        name: "Maruthu 4",
        carrom: 0,
        basketball: 0,
        chess: 0,
        cricket: 0,
        football: 0,
        badminton: 0,
        tabletennis: 0,
        volleyball: 0,
      },
      {
        id: 5,
        name: "Maruthu 5",
        carrom: 0,
        basketball: 0,
        chess: 0,
        cricket: 0,
        football: 0,
        badminton: 0,
        tabletennis: 0,
        volleyball: 0,
      },
      {
        id: 6,
        name: "Maruthu 6",
        carrom: 0,
        basketball: 0,
        chess: 0,
        cricket: 0,
        football: 0,
        badminton: 0,
        tabletennis: 0,
        volleyball: 0,
      },
      {
        id: 7,
        name: "Maruthu 7",
        carrom: 0,
        basketball: 0,
        chess: 0,
        cricket: 0,
        football: 0,
        badminton: 0,
        tabletennis: 0,
        volleyball: 0,
      },
      {
        id: 8,
        name: "Maruthu 8",
        carrom: 0,
        basketball: 0,
        chess: 0,
        cricket: 0,
        football: 0,
        badminton: 0,
        tabletennis: 0,
        volleyball: 0,
      },
    ]
  }

  // Parse the raw sheet data into our team format
  private parseSheetData(values: string[][]): { teams: TeamData[], gameNames: GameNames } {

    if (values.length < 2) {
      console.warn("Not enough data rows, using fallback")
      const fallbackData = this.getFallbackData()
      return {
        teams: fallbackData,
        gameNames: {
          carrom: 'Carrom',
          basketball: 'Basketball',
          chess: 'Chess',
          cricket: 'Cricket',
          football: 'Football',
          badminton: 'Badminton',
          tabletennis: 'Table Tennis',
          volleyball: 'Volleyball'
        }
      }
    }

    const headers = values[0] // First row contains game names
    const rows = values.slice(1) // Skip header row

    // Extract game names from headers
    const gameNames: GameNames = {}
    for (let i = 1; i < headers.length; i++) {
      const originalName = headers[i]?.trim() || `Game ${i}`
      gameNames[originalName] = originalName
    }

    const teams = rows
      .filter((row) => row[0] && row[0].trim()) // Filter out empty rows
      .map((row, index) => {
        // Create a dynamic games object based on the headers
        const games: Record<string, number> = {}
        
        // Start from index 1 (skip the team name at index 0)
        for (let i = 1; i < headers.length; i++) {
          const gameName = headers[i]?.trim() || `game${i}`
          // If the score is missing, fill with 0
          const score = row[i] !== undefined && row[i] !== null && row[i] !== '' ? this.parseScore(row[i], gameName) : 0;
          games[gameName] = score;
        }

        const teamData: TeamData = {
          id: index + 1,
          name: row[0] || `Team ${index + 1}`,
          carrom: games.carrom || 0,
          basketball: games.basketball || 0,
          chess: games.chess || 0,
          cricket: games.cricket || 0,
          football: games.football || 0,
          badminton: games.badminton || 0,
          tabletennis: games.tabletennis || 0,
          volleyball: games.volleyball || 0,
          // Add dynamic games to the team data
          ...games
        }
        return teamData
      })

    return { teams, gameNames }
  }

  // Parse and validate score with game-specific max points
  private parseScore(value: string | undefined, gameName?: string): number {
    if (!value || value.trim() === "") return 0
    const score = Number.parseInt(value.toString().trim())
    const actualScore = Math.max(0, isNaN(score) ? 0 : score)
    
    // If no game name provided, don't cap
    if (!gameName) return actualScore
    
    // Define max points for each game
    const gameMaxPoints: Record<string, number> = {
      alangkar: 10,
      "social media": 10,
      "photo contest": 10,
      carrom: 15,
      chess: 15,
      rangoli: 10,
      "treasure hunt": 10,
    }
    
    // Normalize game name for comparison
    const normalizedGameName = gameName.trim().toLowerCase()
    const maxPoints = gameMaxPoints[normalizedGameName] || 5
    
    // Cap the score at the game's maximum
    return Math.min(actualScore, maxPoints)
  }

  // Subscribe to data updates
  onDataUpdate(callback: (data: { teams: TeamData[], gameNames: GameNames }) => void): void {
    this.updateCallbacks.push(callback)
  }

  // Start polling for changes with better error handling
  startPolling(intervalMs = 10000): void {
    if (this.isPolling) return

    this.isPolling = true

    setInterval(async () => {
      try {
        const data = await this.fetchTeamData()
        this.notifyCallbacks(data)
      } catch (error) {
        console.error("Polling error:", error)
        // Continue polling even if there's an error
      }
    }, intervalMs)
  }

  // Stop polling
  stopPolling(): void {
    this.isPolling = false
  }

  // Notify all subscribers of data changes
  private notifyCallbacks(data: { teams: TeamData[], gameNames: GameNames }): void {
    this.updateCallbacks.forEach((callback) => callback(data))
  }

  // Get the public URL for the spreadsheet
  getSpreadsheetUrl(): string {
    return `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/edit`
  }

  // Test connection to Google Sheets
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.API_KEY) {
        return {
          success: false,
          message: "API key not found. Please add NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY to your .env.local file.",
        }
      }

      const range = "Sheet1!A1:A1"
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${range}?key=${this.API_KEY}`

      const response = await fetch(url)

      if (response.ok) {
        return { success: true, message: "Successfully connected to Google Sheets!" }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          message: `Connection failed: ${errorData.error?.message || "Unknown error"}`,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }
}
