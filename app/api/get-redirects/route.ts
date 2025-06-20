import { NextResponse } from 'next/server'
<<<<<<< HEAD
import { storage } from '../../../lib/storage'
=======
import { promises as fs } from 'fs'
import path from 'path'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  video?: string // Added video field
  keywords: string
  site_name: string
  type: string
}

interface RedirectsData {
  [slug: string]: RedirectData
}
>>>>>>> dfbe932bf1112279626141a25cb1b9aa41ff07e1

export async function GET() {
  try {
    console.log('=== GET REDIRECTS API START ===')
    
<<<<<<< HEAD
    const redirects = await storage.getAllRedirects()
    
    console.log(`Successfully retrieved ${Object.keys(redirects).length} redirects`)
    console.log('=== GET REDIRECTS API END ===')
    
=======
    // Try multiple file path strategies for AWS Amplify
    const possiblePaths = [
      path.join(process.cwd(), 'redirects.json'),
      path.join('/tmp', 'redirects.json'),
      './redirects.json',
      'redirects.json'
    ]
    
    let redirects: RedirectsData = {}
    let fileFound = false
    
    // Try to find and read existing file
    for (const testPath of possiblePaths) {
      try {
        console.log(`Trying to read from: ${testPath}`)
        await fs.access(testPath)
        const fileContents = await fs.readFile(testPath, 'utf8')
        redirects = JSON.parse(fileContents) as RedirectsData
        fileFound = true
        console.log(`Successfully read from: ${testPath}, entries: ${Object.keys(redirects).length}`)
        break
      } catch (error) {
        console.log(`Failed to read from ${testPath}:`, error instanceof Error ? error.message : 'Unknown error')
        continue
      }
    }
    
    if (!fileFound) {
      console.log('No redirects file found, returning empty object')
      // Return empty object if no file exists
      redirects = {}
    }
    
    console.log('=== GET REDIRECTS API END ===')
>>>>>>> dfbe932bf1112279626141a25cb1b9aa41ff07e1
    return NextResponse.json(redirects)
    
  } catch (error) {
    console.error('=== GET REDIRECTS API ERROR ===')
    console.error('Error reading redirects:', error)
    
    // Return empty object on error instead of failing
<<<<<<< HEAD
    return NextResponse.json({})
=======
    const emptyRedirects: RedirectsData = {}
    return NextResponse.json(emptyRedirects)
>>>>>>> dfbe932bf1112279626141a25cb1b9aa41ff07e1
  }
}