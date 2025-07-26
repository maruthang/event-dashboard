"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, RefreshCw, CheckCircle, AlertCircle, Settings, TestTube } from "lucide-react"
import { GoogleSheetsService } from "@/lib/google-sheets-service"

interface GoogleSheetsIntegrationProps {
  onDataUpdate: (data: { teams: any[], gameNames: any }) => void
}

export function GoogleSheetsIntegration({ onDataUpdate }: GoogleSheetsIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionMessage, setConnectionMessage] = useState<string>("")

  const sheetsService = GoogleSheetsService.getInstance()

  // Test connection to Google Sheets
  const testConnection = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await sheetsService.testConnection()
      if (result.success) {
        setConnectionMessage(result.message)
        setError(null)
      } else {
        setError(result.message)
        setConnectionMessage("")
      }
    } catch (err) {
      setError("Failed to test connection")
    } finally {
      setIsLoading(false)
    }
  }

  // Connect to Google Sheets
  const connectToSheets = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await sheetsService.fetchTeamData()
      setIsConnected(true)
      setLastUpdate(new Date())
      setConnectionMessage("Successfully loaded data from Google Sheets!")
      onDataUpdate(data)

      // Start polling for updates
      sheetsService.onDataUpdate(onDataUpdate)
      sheetsService.startPolling(10000) // Poll every 10 seconds
    } catch (err) {
      setError("Failed to connect to Google Sheets. Using fallback data.")
      setIsConnected(false)

      // Still load fallback data
      const fallbackData = await sheetsService.fetchTeamData()
      onDataUpdate(fallbackData)
    } finally {
      setIsLoading(false)
    }
  }

  // Manual refresh
  const refreshData = async () => {
    setIsLoading(true)
    try {
      const data = await sheetsService.fetchTeamData()
      setLastUpdate(new Date())
      onDataUpdate(data)
      setConnectionMessage("Data refreshed successfully!")
    } catch (err) {
      setError("Failed to refresh data")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Settings className="h-5 w-5" />
          <span>Google Sheets Integration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Status:</span>
          <Badge variant={isConnected ? "default" : error ? "destructive" : "secondary"}>
            {isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : error ? (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Using Fallback Data
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
        </div>

        {lastUpdate && <div className="text-xs text-blue-200">Last updated: {lastUpdate.toLocaleTimeString()}</div>}

        {error && (
          <div className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
            <strong>Note:</strong> {error}
          </div>
        )}

        {connectionMessage && (
          <div className="text-xs text-green-300 bg-green-900/20 p-2 rounded">{connectionMessage}</div>
        )}

        <div className="flex space-x-2">
          {/* <Button
            onClick={testConnection}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <TestTube className="h-3 w-3" />}
          </Button> */}

          <Button onClick={connectToSheets} disabled={isLoading} className="flex-1 bg-blue-400 hover:bg-blue-500">
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                {isConnected ? "Reconnect" : "Connect"}
              </>
            )}
          </Button>

          {isConnected && (
            <Button
              onClick={refreshData}
              disabled={isLoading}
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>

        {/* <Button
          onClick={() => window.open(sheetsService.getSpreadsheetUrl(), "_blank")}
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Google Sheets
        </Button>

        <div className="text-xs text-blue-200 space-y-1">
          <p>• Click "Test" to check your API key</p>
          <p>• Dashboard works with or without Google Sheets</p>
          <p>• Real-time updates when connected</p>
        </div>

        {!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY && (
          <div className="text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
            <strong>Setup Required:</strong> Add your Google Sheets API key to .env.local file
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}
