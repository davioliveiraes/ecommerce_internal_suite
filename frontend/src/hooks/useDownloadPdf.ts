import { useState } from 'react'
import { apiClient } from '../api/client'

export function useDownloadPdf() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const download = async (
    endpoint: string,
    params: Record<string, unknown>,
    filename: string,
  ) => {
    setIsDownloading(true)
    setError(null)
    try {
      const response = await apiClient.get<Blob>(endpoint, {
        params,
        responseType: 'blob',
        paramsSerializer: {
          indexes: null,
        },
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsDownloading(false)
    }
  }

  return { download, isDownloading, error }
}
