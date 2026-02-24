# $W3J - Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites Check
```bash
node --version  # Should be v16+
mongod --version  # Or use MongoDB Atlas
```

### 2. Setup
```bash
cd w3j-project
./setup.sh  # Automated setup
```

### 3. Configure
Edit `backend/.env`:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
MONGODB_URI=mongodb://localhost:27017/w3j
TELEGRAM_BOT_TOKEN=your_bot_token  # Optional
TELEGRAM_CHAT_ID=your_chat_id      # Optional
```

### 4. Run
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

### 5. Access
Open http://localhost:3000/admin

## 📱 Telegram Setup (3 Minutes)

1. **Create Bot**: Message [@BotFather](https://t.me/botfather) on Telegram
   ```
   /newbot
   ```

2. **Get Token**: Copy the token BotFather gives you

3. **Create Group**: Create a new Telegram group for jobs

4. **Add Bot**: Add your bot to the group, make it admin

5. **Get Chat ID**:
   - Send a message in the group
   - Visit: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   - Copy the chat ID (negative number)

6. **Update .env**:
   ```env
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
   TELEGRAM_CHAT_ID=-123456789
   ```

## 🎯 Adding Your First Job Source

1. Login to admin panel
2. Go to "Sources" tab
3. Click "Add Source"
4. Fill in:
   ```
   Name: Web3 Careers
   URL: https://web3.career/
   ```
5. Click "Add Source"
6. Go to "Scraper" tab
7. Click "Start Scrape Now"
8. Check your Telegram group!

## 📊 Common CSS Selectors

Most job boards use similar patterns:

```javascript
{
  jobContainer: ".job-listing",        // or ".job-card", ".position"
  title: ".job-title",                 // or "h2", "h3.title"
  company: ".company-name",            // or ".employer"
  location: ".job-location",           // or ".location"
  salary: ".salary",                   // or ".compensation"
  link: "a.apply-button"               // or "a.job-link"
}
```

**Pro Tip**: Right-click on a job listing → Inspect Element → Find the selectors

## 🔧 Troubleshooting

### MongoDB Won't Connect
```bash
# Start MongoDB locally
mongod

# Or use Docker
docker run -d -p 27017:27017 mongo:7

# Or use MongoDB Atlas (cloud)
# Get connection string from atlas.mongodb.com
```

### Port Already in Use
```bash
# Find what's using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>
```

### Scraping Returns No Jobs
1. Check the website's robots.txt
2. Try different CSS selectors
3. The scraper will auto-fallback to Puppeteer
4. Some sites need JavaScript (Puppeteer handles this)

### Telegram Not Posting
1. Verify bot is admin in group
2. Check chat ID is negative for groups
3. Test in admin panel: "Test Telegram Bot"

## 📝 Environment Variables Reference

### Backend (.env)
```env
# Required
MONGODB_URI=mongodb://localhost:27017/w3j
JWT_SECRET=random_secure_string_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password

# Optional (for Telegram)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Optional (defaults shown)
PORT=5000
NODE_ENV=development
SCRAPE_INTERVAL_MINUTES=30
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SCRAPE_INTERVAL=30
```

## 🐳 Docker Quick Start

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📚 API Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

### Get Jobs
```bash
curl http://localhost:5000/api/jobs/recent?limit=10
```

### Add Source (with auth)
```bash
curl -X POST http://localhost:5000/api/sources \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Source",
    "url": "https://example.com/jobs",
    "active": true
  }'
```

## 🎨 Customization

### Change Terminal Colors
Edit `frontend/src/styles/index.css`:
```css
/* Change green to blue */
--terminal-green: #33ff33;  /* Change to #3399ff */
```

### Change Scrape Interval
Edit `backend/.env`:
```env
SCRAPE_INTERVAL_MINUTES=15  # Scrape every 15 minutes
```

### Change Admin Credentials
Edit `backend/.env`:
```env
ADMIN_USERNAME=myadmin
ADMIN_PASSWORD=MySecurePass123!
```

## 🚀 Deployment Checklist

- [ ] Set strong admin password
- [ ] Use production MongoDB (Atlas recommended)
- [ ] Set secure JWT_SECRET
- [ ] Configure Telegram bot
- [ ] Set NODE_ENV=production
- [ ] Use environment variables (not .env files)
- [ ] Enable HTTPS
- [ ] Set CORS origins
- [ ] Monitor logs
- [ ] Setup backups

## 📞 Need Help?

1. Check README.md
2. Search existing GitHub issues
3. Create new issue with details
4. Join discussions

---

**That's it! You're ready to start aggregating jobs! 🎉**
