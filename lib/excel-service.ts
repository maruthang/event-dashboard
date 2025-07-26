// Excel Integration Service
// This file handles the connection to Excel and data parsing

export interface TeamData {
  id: number
  name: string
  carrom: number
  cricket: number
  football: number
  chess: number
  badminton: number
  tabletennis: number
  volleyball: number
  basketball: number
}

export class ExcelService {
  private static instance: ExcelService
  private isConnected = false
  private updateCallbacks: Array<(data: TeamData[]) => void> = []

  static getInstance(): ExcelService {
    if (!ExcelService.instance) {
      ExcelService.instance = new ExcelService()
    }
    return ExcelService.instance
  }

  // Connect to Excel file or API
  async connect(excelSource: string | File): Promise<boolean> {
    try {
      // Implementation depends on your Excel integration method:

      // Option 1: File upload and parsing
      if (excelSource instanceof File) {
        return await this.parseExcelFile(excelSource)
      }

      // Option 2: Excel Online API
      if (typeof excelSource === "string") {
        return await this.connectToExcelOnline(excelSource)
      }

      return false
    } catch (error) {
      console.error("Failed to connect to Excel:", error)
      return false
    }
  }

  // Parse uploaded Excel file
  private async parseExcelFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          // You'll need to install xlsx library: npm install xlsx
          // import * as XLSX from 'xlsx'

          // const workbook = XLSX.read(e.target?.result, { type: 'binary' })
          // const sheetName = workbook.SheetNames[0]
          // const worksheet = workbook.Sheets[sheetName]
          // const data = XLSX.utils.sheet_to_json(worksheet)

          // Parse and validate data
          // const teamData = this.validateAndTransformData(data)
          // this.notifyCallbacks(teamData)

          this.isConnected = true
          resolve(true)
        } catch (error) {
          console.error("Error parsing Excel file:", error)
          resolve(false)
        }
      }
      reader.readAsBinaryString(file)
    })
  }

  // Connect to Excel Online (Office 365)
  private async connectToExcelOnline(workbookId: string): Promise<boolean> {
    try {
      // Implementation for Excel Online API
      // You'll need Microsoft Graph API integration

      // const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${workbookId}/workbook/worksheets/Sheet1/usedRange`, {
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json'
      //   }
      // })

      // const data = await response.json()
      // const teamData = this.parseExcelData(data.values)
      // this.notifyCallbacks(teamData)

      this.isConnected = true
      return true
    } catch (error) {
      console.error("Failed to connect to Excel Online:", error)
      return false
    }
  }

  // Subscribe to data updates
  onDataUpdate(callback: (data: TeamData[]) => void): void {
    this.updateCallbacks.push(callback)
  }

  // Notify all subscribers of data changes
  private notifyCallbacks(data: TeamData[]): void {
    this.updateCallbacks.forEach((callback) => callback(data))
  }

  // Validate and transform Excel data
  private validateAndTransformData(rawData: any[]): TeamData[] {
    return rawData.map((row, index) => ({
      id: index + 1,
      name: row["Team Name"] || `Team ${index + 1}`,
      carrom: Math.max(0, Math.min(5, Number.parseInt(row["Carrom"]) || 0)),
      cricket: Math.max(0, Math.min(5, Number.parseInt(row["Cricket"]) || 0)),
      football: Math.max(0, Math.min(5, Number.parseInt(row["Football"]) || 0)),
      chess: Math.max(0, Math.min(5, Number.parseInt(row["Chess"]) || 0)),
      badminton: Math.max(0, Math.min(5, Number.parseInt(row["Badminton"]) || 0)),
      tabletennis: Math.max(0, Math.min(5, Number.parseInt(row["Table Tennis"]) || 0)),
      volleyball: Math.max(0, Math.min(5, Number.parseInt(row["Volleyball"]) || 0)),
      basketball: Math.max(0, Math.min(5, Number.parseInt(row["Basketball"]) || 0)),
    }))
  }

  // Start polling for changes (for file-based integration)
  startPolling(intervalMs = 5000): void {
    if (!this.isConnected) return

    setInterval(async () => {
      // Check for file changes and update data
      // Implementation depends on your setup
    }, intervalMs)
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected
  }
}
