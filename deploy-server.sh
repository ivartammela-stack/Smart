#!/bin/bash
# SmartFollow Server Deployment Script
# Run this on the production server (185.170.198.120)

set -e  # Exit on any error

echo "🚀 SmartFollow Server Deployment"
echo "================================"
echo ""

# 1. Navigate to project
cd ~/smartfollow
echo "✅ In project directory: $(pwd)"

# 2. Pull latest code
echo "📥 Pulling latest code from main..."
git fetch origin
git checkout main
git pull origin main

# 3. Install/update dependencies
echo "📦 Installing server dependencies..."
cd apps/server
npm ci

# 4. Build TypeScript
echo "🏗️  Building TypeScript..."
npm run build

# 5. Restart PM2
echo "🔄 Restarting server..."
pm2 restart smartfollow-server

# 6. Wait a moment
sleep 2

# 7. Check status
echo ""
echo "📊 Server status:"
pm2 status

echo ""
echo "📝 Recent logs:"
pm2 logs smartfollow-server --lines 10 --nostream

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Test endpoints:"
echo "  http://185.170.198.120/health"
echo "  http://185.170.198.120/api/companies"
echo ""

