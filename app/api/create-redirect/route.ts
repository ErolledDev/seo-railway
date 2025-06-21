import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../lib/storage'

interface FormData {
  title: string
  desc: string
  url: string
  image: string
  video?: string
  keywords: string
  site_name: string
  type: string
  slug: string
}

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

interface CreateRedirectResponse {
  long: string
  short: string
  slug: string
  success: boolean
  warning?: string
  error?: string
  data?: RedirectData
  isUpdate?: boolean
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CREATE REDIRECT API START ===')
    
    const data: FormData = await request.json()
    console.log('Received data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.title || !data.desc || !data.url) {
      console.error('Validation failed: Missing required fields')
      return NextResponse.json(
        { error: 'Title, description, and URL are required' },
        { status: 400 }
      )
    }
    
    // Generate slug if not provided
    let slug = data.slug
    if (!slug) {
      slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 100)
    }
    
    // Ensure slug is valid
    if (!slug) {
      slug = 'redirect-' + Date.now()
    }
    
    console.log('Generated slug:', slug)
    
    // Check if slug already exists (for new redirects, not updates)
    const existingRedirect = await storage.getRedirect(slug)
    const isUpdate = data.slug && existingRedirect
    
    if (!isUpdate && existingRedirect) {
      slug = `${slug}-${Date.now()}`
      console.log('Slug collision, using:', slug)
    }
    
    // Create redirect data object with timestamps
    const currentTime = new Date().toISOString()
    const redirectData: RedirectData = {
      title: data.title.trim(),
      desc: data.desc.trim(),
      url: data.url.trim(),
      image: data.image ? data.image.trim() : '',
      video: data.video ? data.video.trim() : '',
      keywords: data.keywords ? data.keywords.trim() : '',
      site_name: data.site_name ? data.site_name.trim() : '',
      type: data.type || 'website',
      created_at: isUpdate ? (existingRedirect?.created_at || currentTime) : currentTime,
      updated_at: currentTime
    }
    
    // Save redirect using storage class
    await storage.saveRedirect(slug, redirectData)
    
    // Generate URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const params = new URLSearchParams({
      title: redirectData.title,
      desc: redirectData.desc,
      url: redirectData.url,
      ...(redirectData.image && { image: redirectData.image }),
      ...(redirectData.video && { video: redirectData.video }),
      ...(redirectData.keywords && { keywords: redirectData.keywords }),
      ...(redirectData.site_name && { site_name: redirectData.site_name }),
      type: redirectData.type
    })
    
    const longUrl = `${baseUrl}/u?${params.toString()}`
    const shortUrl = `${baseUrl}/${slug}`
    
    console.log(`Successfully ${isUpdate ? 'updated' : 'created'} redirect: ${slug}`)
    console.log('=== CREATE REDIRECT API END ===')
    
    return NextResponse.json({
      long: longUrl,
      short: shortUrl,
      slug: slug,
      success: true,
      isUpdate: isUpdate,
      data: redirectData
    })
    
  } catch (error) {
    console.error('=== CREATE REDIRECT API ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        error: 'Failed to create redirect. Please try again.', 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      },
      { status: 500 }
    )
  }
}