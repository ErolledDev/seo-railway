import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { storage } from '../../lib/storage'
import SlugRedirectPage from './SlugRedirectPage'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  video?: string
  keywords: string
  site_name: string
  type: string
}

async function getRedirectData(slug: string): Promise<RedirectData | null> {
  try {
    return await storage.getRedirect(slug)
  } catch (error) {
    console.error('Error reading redirect data:', error)
    return null
  }
}

async function getAllRedirects(): Promise<{ [slug: string]: RedirectData }> {
  try {
    return await storage.getAllRedirects()
  } catch (error) {
    console.error('Error reading all redirects:', error)
    return {}
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const data = await getRedirectData(params.slug)
  
  if (!data) {
    return {
      title: 'Page Not Found | SEO Redirects Pro',
      description: 'The requested page could not be found.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'
  const canonicalUrl = `${baseUrl}/${params.slug}`

  return {
    title: `${data.title} | SEO Redirects Pro`,
    description: data.desc,
    keywords: data.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data.title,
      description: data.desc,
      type: data.type as any,
      images: data.image ? [data.image] : [],
      siteName: data.site_name,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.desc,
      images: data.image ? [data.image] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const data = await getRedirectData(params.slug)
  const allRedirects = await getAllRedirects()
  
  if (!data) {
    notFound()
  }

  return <SlugRedirectPage data={data} allRedirects={allRedirects} currentSlug={params.slug} />
}