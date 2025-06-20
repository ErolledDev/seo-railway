import { promises as fs } from 'fs'
import path from 'path'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  video?: string
  keywords: string
  site_name: string
  type: string
  created_at: string
  updated_at: string
}

interface RedirectsData {
  [slug: string]: RedirectData
}

export class FileStorage {
  private dataDir: string
  private filePath: string

  constructor() {
    // Use persistent storage directory for Railway
    this.dataDir = path.join(process.cwd(), 'data')
    this.filePath = path.join(this.dataDir, 'redirects.json')
  }

  async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(this.dataDir)
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true })
      console.log('Created data directory:', this.dataDir)
    }
  }

  async readRedirects(): Promise<RedirectsData> {
    try {
      await this.ensureDataDirectory()
      const data = await fs.readFile(this.filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.log('No existing redirects file, starting with empty data')
      return {}
    }
  }

  async writeRedirects(redirects: RedirectsData): Promise<void> {
    try {
      await this.ensureDataDirectory()
      await fs.writeFile(this.filePath, JSON.stringify(redirects, null, 2), 'utf8')
      console.log('Successfully wrote redirects to:', this.filePath)
    } catch (error) {
      console.error('Failed to write redirects:', error)
      throw error
    }
  }

  async saveRedirect(slug: string, data: RedirectData): Promise<void> {
    const redirects = await this.readRedirects()
    redirects[slug] = data
    await this.writeRedirects(redirects)
  }

  async getRedirect(slug: string): Promise<RedirectData | null> {
    const redirects = await this.readRedirects()
    return redirects[slug] || null
  }

  async deleteRedirect(slug: string): Promise<boolean> {
    const redirects = await this.readRedirects()
    if (redirects[slug]) {
      delete redirects[slug]
      await this.writeRedirects(redirects)
      return true
    }
    return false
  }

  async getAllRedirects(): Promise<RedirectsData> {
    return await this.readRedirects()
  }
}

// Singleton instance
export const storage = new FileStorage()