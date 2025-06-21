import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../lib/storage'

export async function DELETE(request: NextRequest) {
  try {
    console.log('=== DELETE REDIRECT API START ===')
    
    // Get slug from URL query parameters
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      console.error('Invalid or missing slug in query parameters')
      return NextResponse.json(
        { error: 'Valid slug is required as query parameter' },
        { status: 400 }
      )
    }
    
    const trimmedSlug = slug.trim()
    console.log('Processing delete for slug:', trimmedSlug)
    
    // Check if redirect exists
    const existingRedirect = await storage.getRedirect(trimmedSlug)
    if (!existingRedirect) {
      console.error(`Redirect "${trimmedSlug}" not found`)
      return NextResponse.json(
        { error: `Redirect "${trimmedSlug}" not found` },
        { status: 404 }
      )
    }
    
    // Delete the redirect
    const deleted = await storage.deleteRedirect(trimmedSlug)
    
    if (deleted) {
      console.log(`Successfully deleted redirect: ${trimmedSlug}`)
      console.log('=== DELETE REDIRECT API END ===')
      
      return NextResponse.json({ 
        success: true, 
        message: `Redirect "${trimmedSlug}" deleted successfully`,
        deletedSlug: trimmedSlug
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete redirect' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('=== DELETE REDIRECT API ERROR ===')
    console.error('Unexpected error deleting redirect:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again later.', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}