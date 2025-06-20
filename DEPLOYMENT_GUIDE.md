# SEO Redirects Pro - Railway + Cloudflare Deployment Guide

## 🚀 Quick Overview
This guide will help you deploy your SEO Redirects Pro app to Railway with Cloudflare for optimal performance and cost savings.

### Benefits of This Setup:
- **Railway**: $5/month for reliable hosting with persistent storage
- **Cloudflare**: Free CDN that caches static content globally
- **Combined**: 80-90% bandwidth savings, global performance, DDoS protection

## 📋 Prerequisites
1. GitHub account with your code repository
2. Railway account (railway.app)
3. Cloudflare account (cloudflare.com)
4. Domain name (optional but recommended)

## 🛠️ Step 1: Prepare Your Repository

### 1.1 Ensure your code is committed and pushed to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 1.2 Verify the new files are in your repository:
- `railway.json` - Railway configuration
- `lib/storage.ts` - Persistent file storage
- `app/api/health/route.ts` - Health check endpoint
- Updated API routes with persistent storage

## 🚂 Step 2: Deploy to Railway

### 2.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your SEO Redirects Pro repository

### 2.2 Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

```env
NODE_ENV=production
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

**Note**: `NEXT_PUBLIC_BASE_URL` will be automatically set by Railway

### 2.3 Deploy
Railway will automatically:
- Detect it's a Next.js app
- Install dependencies
- Build the application
- Deploy to a Railway domain (e.g., `your-app-name.up.railway.app`)

## ☁️ Step 3: Configure Cloudflare (Optional but Recommended)

### 3.1 Add Your Domain to Cloudflare
1. Go to [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Update nameservers at your domain registrar
4. Wait for DNS propagation (usually 24-48 hours)

### 3.2 Create DNS Record
1. In Cloudflare DNS settings
2. Add a CNAME record:
   - **Name**: `@` (or `www`)
   - **Target**: `your-app-name.up.railway.app`
   - **Proxy status**: Proxied (orange cloud)

### 3.3 Configure Caching Rules
1. Go to Caching → Cache Rules
2. Create a new rule:
   - **Rule name**: "Static Assets"
   - **When incoming requests match**: `URI Path contains "/_next/static/"`
   - **Then**: Cache level = Cache everything, Edge TTL = 1 year

### 3.4 Update Railway Environment
In Railway, update the environment variable:
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## 🔧 Step 4: Optimize Performance

### 4.1 Railway Settings
- **Region**: Choose closest to your users
- **Scaling**: Start with 1 replica, scale as needed
- **Health checks**: Already configured via `/api/health`

### 4.2 Cloudflare Settings
- **SSL/TLS**: Full (strict)
- **Always Use HTTPS**: On
- **Auto Minify**: CSS, JavaScript, HTML
- **Brotli**: On
- **HTTP/2**: On

## 📊 Expected Performance & Costs

### Railway Costs:
- **Starter Plan**: $5/month
- **Includes**: 512MB RAM, 1GB storage, 100GB bandwidth
- **Perfect for**: Small to medium traffic sites

### Bandwidth Savings with Cloudflare:
- **Static assets**: 95% cached (CSS, JS, images)
- **HTML pages**: 50% cached (with smart rules)
- **API calls**: Direct to Railway (not cached)
- **Total savings**: 70-80% bandwidth reduction

### Traffic Capacity:
- **Without Cloudflare**: ~50,000 page views/month
- **With Cloudflare**: ~200,000+ page views/month

## 🔍 Step 5: Monitoring & Maintenance

### 5.1 Railway Monitoring
- Check logs in Railway dashboard
- Monitor resource usage
- Set up alerts for downtime

### 5.2 Cloudflare Analytics
- View traffic patterns
- Monitor cache hit rates
- Check security threats blocked

### 5.3 Health Checks
Your app includes a health endpoint at `/api/health` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600,
  "memory": {...},
  "version": "1.0.0"
}
```

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Railway logs
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Data Not Persisting**
   - Check if `data/` directory is being created
   - Verify file permissions
   - Check Railway logs for storage errors

3. **Cloudflare Not Caching**
   - Verify DNS is proxied (orange cloud)
   - Check cache rules are active
   - Use Cloudflare's cache purge if needed

4. **Environment Variables**
   - Ensure `NEXT_PUBLIC_BASE_URL` matches your domain
   - Check all required variables are set
   - Restart deployment after variable changes

## 🎯 Next Steps

1. **Custom Domain**: Point your domain to Railway via Cloudflare
2. **SSL Certificate**: Automatic with Cloudflare
3. **Analytics**: Monitor with Google Analytics
4. **SEO**: Submit sitemap to Google Search Console
5. **Backup**: Consider automated backups of your `data/` directory

## 📞 Support

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Cloudflare**: [developers.cloudflare.com](https://developers.cloudflare.com)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Estimated Total Monthly Cost**: $5 (Railway) + $0 (Cloudflare Free) = **$5/month**

**Estimated Traffic Capacity**: 200,000+ page views/month with global CDN performance! 🚀