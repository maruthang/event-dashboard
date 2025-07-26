"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Key } from "lucide-react"

export function SetupInstructions() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Setup Instructions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Step 1: Get Google Sheets API Key</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Go to{" "}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                className="text-blue-600 hover:underline"
                rel="noreferrer"
              >
                Google Cloud Console
              </a>
            </li>
            <li>Create a new project or select existing one</li>
            <li>Enable the Google Sheets API</li>
            <li>Create credentials (API Key)</li>
            <li>Copy your API key</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Step 2: Configure Environment</h3>
          <p className="text-sm mb-2">
            Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root:
          </p>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm flex justify-between items-center">
            <span>NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_api_key_here</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard("NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_api_key_here")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Step 3: Make Your Sheet Public</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open your Google Sheet</li>
            <li>Click "Share" button</li>
            <li>Change access to "Anyone with the link can view"</li>
            <li>Copy the sharing link</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Your Sheet Structure</h3>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm mb-2">Your current sheet should have columns:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Badge variant="outline">A: Team Name</Badge>
              <Badge variant="outline">B: Carrom</Badge>
              <Badge variant="outline">C: Basketball</Badge>
              <Badge variant="outline">D: Chess</Badge>
              <Badge variant="outline">E: Cricket</Badge>
              <Badge variant="outline">F: Football</Badge>
              <Badge variant="outline">G: Badminton</Badge>
              <Badge variant="outline">H: Table Tennis</Badge>
              <Badge variant="outline">I: Volleyball</Badge>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded">
          <p className="text-sm">
            <strong>Note:</strong> After setting up the API key, restart your development server with{" "}
            <code className="bg-gray-100 px-1 rounded">npm run dev</code>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
