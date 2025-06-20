import { NextResponse } from 'next/server'
import { storage } from '../../../lib/storage'

export async function GET() {
  try {
    console.log('=== GET REDIRECTS API START ===')
    
    const redirects = await storage.getAllRedirects()
    
    console.log(`Successfully retrieved ${Object.keys(redirects).length} redirects`)
    console.log('=== GET REDIRECTS API END ===')
    
    return NextResponse.json(redirects)
    
  } catch (error) {
    console.error('=== GET REDIRECTS API ERROR ===')
    console.error('Error reading redirects:', error)
    
    // Return empty object on error instead of failing
    return NextResponse.json({})
  }
}