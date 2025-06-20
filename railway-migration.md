# Migrating SEO Redirects Pro to Railway

## Step 1: Prepare Your Repository
1. Ensure your code is pushed to GitHub
2. Add a `railway.json` configuration file (optional but recommended)

## Step 2: Railway Configuration
Create `railway.json` in your project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## Step 3: Environment Variables
Set these in Railway dashboard:
- `NEXT_PUBLIC_BASE_URL` (Railway will provide the domain)
- `NEXT_PUBLIC_GA_ID` (your Google Analytics ID)
- `NODE_ENV=production`

## Step 4: Update File Storage Path
Modify your API routes to use a persistent directory:

```javascript
// In your API routes, replace the file path logic with:
const filePath = path.join(process.cwd(), 'data', 'redirects.json')

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}
```

## Step 5: Deploy
1. Go to railway.app
2. Connect your GitHub repository
3. Railway will auto-deploy
4. Update your domain settings

## Benefits You'll Get:
- ✅ Persistent file storage
- ✅ No cold starts
- ✅ Better performance
- ✅ Simpler debugging
- ✅ Cost-effective scaling