// src/utils/drive.ts
/**
 * Recebe uma URL do Google Drive e retorna o ID do arquivo,
 * ou null se não encontrar.
 */
export function extractDriveFileId(url: string): string | null {
  // Tenta o padrão /d/ID/
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return match[1]

  // Tenta o padrão open?id=ID
  const params = new URL(url).searchParams
  if (params.has('id')) return params.get('id')

  return null
}
