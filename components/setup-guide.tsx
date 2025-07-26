"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Key, ExternalLink, CheckCircle } from "lucide-react"
import { useState } from "react"

export function SetupGuide() {
  const [copiedStep, setCopiedStep] = useState<string | null>(null)

  const copyToClipboard = (text: string, step: string) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const steps = [
    {
      id: "step1",
      title: "Get Google Sheets API Key",
      description: "Create an API key in Google Cloud Console",
      action: (
        <Button onClick={() => window.open("https://console.cloud.google.com/", "_blank")} variant="outline" size="sm">
          <ExternalLink className="h-3 w-3 mr-1" />
          Open Console
        </Button>
      ),
      details: [
        "Go to Google Cloud Console",
        "Create a new project or select existing",
        "Enable Google Sheets API",
        "Create credentials (API Key)",
        "Copy your API key",
      ],
    },
    {
      id: "step2",
      title: "Create Environment File",
      description: "Add your API key to .env.local",
      action: (
        <Button
          onClick={() => copyToClipboard("NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_api_key_here", "step2")}
          variant="outline"
          size="sm"
        >
          {copiedStep === "step2" ? <CheckCircle className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {copiedStep === "step2" ? "Copied!" : "Copy"}
        </Button>
      ),
      details: [
        "Create .env.local file in project root",
        "Add: NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_actual_key",
        "Replace 'your_actual_key' with your API key",
        "Restart your development server",
      ],
    },
    {
      id: "step3",
      title: "Make Sheet Public",
      description: "Allow API access to your spreadsheet",
      action: (
        <Button
          onClick={() =>
            window.open(
              "https://docs.google.com/spreadsheets/d/1Uh0CH4OBi1DCYn4dHWPPIsNaDvaiEpaWwGkcDyQbkTs/edit",
              "_blank",
            )
          }
          variant="outline"
          size="sm"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Open Sheet
        </Button>
      ),
      details: [
        "Open your Google Sheet",
        "Click 'Share' button",
        "Change to 'Anyone with the link can view'",
        "Click 'Done'",
      ],
    },
  ]

  return (
    <Card className="w-full max-w-2xl bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Key className="h-5 w-5" />
          <span>Setup Guide</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-blue-200">{step.description}</p>
                </div>
              </div>
              {step.action}
            </div>

            <div className="ml-11 space-y-1">
              {step.details.map((detail, idx) => (
                <div key={idx} className="text-xs text-blue-200 flex items-center space-x-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-blue-900/30 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Expected Sheet Format:</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Badge variant="outline" className="text-blue-200 border-blue-400">
              A: Team Name
            </Badge>
            <Badge variant="outline" className="text-blue-200 border-blue-400">
              B: Carrom
            </Badge>
            <Badge variant="outline" className="text-blue-200 border-blue-400">
              C: Basketball
            </Badge>
            <Badge variant="outline" className="text-blue-200 border-blue-400">
              D: Chess
            </Badge>
            <Badge variant="outline" className="text-blue-200 border-blue-400">
              E: Cricket
            </Badge>
            <Badge variant="outline" className="text-blue-200 border-blue-400">
              F: Football
            </Badge>
          </div>
        </div>

        <div className="bg-green-900/20 p-3 rounded text-sm text-green-300">
          <strong>Good News:</strong> The dashboard works even without Google Sheets connection! It will use sample data
          until you set up the integration.
        </div>
      </CardContent>
    </Card>
  )
}
