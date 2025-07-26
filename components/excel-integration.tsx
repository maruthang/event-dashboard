"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface ExcelData {
  teams: Array<{
    name: string
    carrom: number
    cricket: number
    football: number
    chess: number
    badminton: number
    tabletennis: number
    volleyball: number
    basketball: number
  }>
}

export function ExcelIntegration() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate Excel connection
  const connectToExcel = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnected(true)
    setLastUpdate(new Date())
    setIsLoading(false)
  }

  // Function to read Excel data (you'll implement this with your Excel API)
  const readExcelData = async (): Promise<ExcelData> => {
    // This is where you'd integrate with Excel API
    // For now, returning mock data
    return {
      teams: [
        {
          name: "Team Alpha",
          carrom: 5,
          cricket: 4,
          football: 5,
          chess: 3,
          badminton: 4,
          tabletennis: 5,
          volleyball: 3,
          basketball: 3,
        },
        // ... other teams
      ],
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Excel Integration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
        </div>

        {lastUpdate && <div className="text-xs text-gray-600">Last updated: {lastUpdate.toLocaleTimeString()}</div>}

        <Button onClick={connectToExcel} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {isConnected ? "Reconnect" : "Connect to Excel"}
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Upload your Excel file with team data</p>
          <p>• Changes in Excel will reflect immediately</p>
          <p>• Supports real-time updates</p>
        </div>
      </CardContent>
    </Card>
  )
}
