// Simple in-memory database with DynamoDB fallback for Amplify
import { DynamoDBClient, PutItemCommand, GetItemCommand, ScanCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb'

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
const TABLE_NAME = 'seo-redirects'

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

export class RedirectDatabase {
  async saveRedirect(slug: string, data: RedirectData): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        slug: { S: slug },
        title: { S: data.title },
        desc: { S: data.desc },
        url: { S: data.url },
        image: { S: data.image || '' },
        video: { S: data.video || '' },
        keywords: { S: data.keywords || '' },
        site_name: { S: data.site_name || '' },
        type: { S: data.type },
        created_at: { S: data.created_at },
        updated_at: { S: data.updated_at }
      }
    }

    await dynamoClient.send(new PutItemCommand(params))
  }

  async getRedirect(slug: string): Promise<RedirectData | null> {
    const params = {
      TableName: TABLE_NAME,
      Key: { slug: { S: slug } }
    }

    const result = await dynamoClient.send(new GetItemCommand(params))
    if (!result.Item) return null

    return {
      title: result.Item.title.S!,
      desc: result.Item.desc.S!,
      url: result.Item.url.S!,
      image: result.Item.image.S!,
      video: result.Item.video?.S || '',
      keywords: result.Item.keywords.S!,
      site_name: result.Item.site_name.S!,
      type: result.Item.type.S!,
      created_at: result.Item.created_at.S!,
      updated_at: result.Item.updated_at.S!
    }
  }

  async getAllRedirects(): Promise<{ [slug: string]: RedirectData }> {
    const params = { TableName: TABLE_NAME }
    const result = await dynamoClient.send(new ScanCommand(params))
    
    const redirects: { [slug: string]: RedirectData } = {}
    
    result.Items?.forEach(item => {
      const slug = item.slug.S!
      redirects[slug] = {
        title: item.title.S!,
        desc: item.desc.S!,
        url: item.url.S!,
        image: item.image.S!,
        video: item.video?.S || '',
        keywords: item.keywords.S!,
        site_name: item.site_name.S!,
        type: item.type.S!,
        created_at: item.created_at.S!,
        updated_at: item.updated_at.S!
      }
    })

    return redirects
  }

  async deleteRedirect(slug: string): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: { slug: { S: slug } }
    }

    await dynamoClient.send(new DeleteItemCommand(params))
  }
}