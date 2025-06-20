import { notFound } from 'next/navigation'
<<<<<<< HEAD
import { Metadata } from 'next'
import { storage } from '../../lib/storage'
=======
import { promises as fs } from 'fs'
import path from 'path'
import { Metadata } from 'next'
>>>>>>> dfbe932bf1112279626141a25cb1b9aa41ff07e1
import SlugRedirectPage from './SlugRedirectPage'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
<<<<<<< HEAD
  video?: string
=======
>>>>>>> dfbe932bf1112279626141a25cb1b9aa41ff07e1
  keywords: string
  site_name: string
  type: string
}

<<<<<<< HEAD
async function getRedirectData(slug: string): Promise<RedirectData | null> {
  try {
    return await storage.getRedirect(slug)
  } catch (error) {
    console.error('Error reading redirect data:', error)
=======
interface RedirectsData {
  [slug: string]: RedirectData
}

async function getRedirectData(slug: string): Promise<RedirectData | null> {
  try {
    const filePath = path.join(process.cwd(), 'redirects.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const redirects: RedirectsData = JSON.parse(fileContents)
    return redirects[slug] || null
  } catch (error) {
    console.error('Error reading redirects file:', error)
>>>>>>> dfbe932bf1112279626141a25cb1b9aa41ff07e1
    return null
  }
}

<<<<<<< HEAD
async function getAllRedirects(): Promise<{ [slug: string]: RedirectData }> {
  try {
    return await storage.getAllRedirects()
  } catch (error) {
    console.error('Error reading all redirects:', error)
=======
async function getAllRedirects(): Promise<RedirectsData> {
  try {
    const filePath = path.join(process.cwd(), 'redirects.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading redirects file:', error)
>>>>>>> dfbe932bf1112279626141a25cb1b9aa41ff07e1
    return {}
  }
}

<<<<<<< HEAD
=======
// Remove generateStaticParams for SSR
// export async function generateStaticParams() {
//   const redirects = await getAllRedirects()
//   
//   return Object.keys(redirects).map((slug) => ({
//     slug: slug,
//   }))
// }

>>>>>>> dfbe932bf1112279626141a25cb1b9aa41ff07e1
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const data = await getRedirectData(params.slug)
  
  if (!data) {
    return {
<<<<<<< HEAD
      title: 'Page Not Found | SEO Redirects Pro',
=======
      title: 'Page Not Found | seo360',
>>>>>>> dfbe932bf1112279626141a25cb1b9aa41ff07e1
      description: 'The requested page could not be found.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'
  const canonicalUrl = `${baseUrl}/${params.slug}`

  return {
<<<<<<< HEAD
    title: `${data.title} | SEO Redirects Pro`,
=======
    title: `${data.title} | seo360`,
>>>>>>> dfbe932bf1112279626141a25cb1b9aa41ff07e1
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