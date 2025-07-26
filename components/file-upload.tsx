"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, CheckCircle } from "lucide-react"
import { ExcelService } from "@/lib/excel-service"

interface FileUploadProps {
  onDataUpdate: (data: any[]) => void
}

export function FileUpload({ onDataUpdate }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const excelService = ExcelService.getInstance()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please upload an Excel file (.xlsx or .xls)")
      return
    }

    setIsUploading(true)

    try {
      const success = await excelService.connect(file)
      if (success) {
        setUploadedFile(file.name)
        // Subscribe to data updates
        excelService.onDataUpdate(onDataUpdate)
      } else {
        alert("Failed to parse Excel file. Please check the format.")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Error uploading file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileSpreadsheet className="h-5 w-5" />
          <span>Upload Excel File</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
          variant={uploadedFile ? "secondary" : "default"}
        >
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-pulse" />
              Uploading...
            </>
          ) : uploadedFile ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              File Uploaded
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Choose Excel File
            </>
          )}
        </Button>

        {uploadedFile && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">✓ {uploadedFile} uploaded successfully</div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Excel Format Required:</strong>
          </p>
          <p>• Column A: Team Name</p>
          <p>• Column B: Carrom (0-5)</p>
          <p>• Column C: Cricket (0-5)</p>
          <p>• Column D: Football (0-5)</p>
          <p>• Column E: Chess (0-5)</p>
          <p>• Column F: Badminton (0-5)</p>
          <p>• Column G: Table Tennis (0-5)</p>
          <p>• Column H: Volleyball (0-5)</p>
          <p>• Column I: Basketball (0-5)</p>
        </div>
      </CardContent>
    </Card>
  )
}
