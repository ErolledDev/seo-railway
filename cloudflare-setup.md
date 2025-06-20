# Cloudflare + Railway Hybrid Setup

## Benefits
- **Massive bandwidth savings** (Cloudflare caches static content)
- **Global performance** (CDN edge locations)
- **DDoS protection**
- **Free tier available**

## Setup Steps

### 1. Deploy to Railway ($5 plan)
- Your app runs on Railway
- Database/API calls handled by Railway

### 2. Add Cloudflare (Free)
- Point your domain to Cloudflare
- Cloudflare proxies traffic to Railway
- Static assets cached globally

### 3. Cloudflare Configuration
```javascript
// Add to your next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ]
  },
}
```

### 4. Expected Bandwidth Reduction
- **Static assets**: 90% cached by Cloudflare
- **HTML pages**: 50% cached (with smart caching rules)
- **Railway bandwidth usage**: ~20-30GB instead of 80GB

## Cost Breakdown
- Railway Starter: $5/month
- Cloudflare: Free
- **Total**: $5/month for 1M+ views