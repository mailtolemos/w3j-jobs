# $W3J - Web3 Jobs Aggregator

A beautiful, Mac terminal-styled job aggregator that scrapes Web3 job postings and automatically posts them to a Telegram group.

![Mac Terminal Style](https://img.shields.io/badge/style-mac_terminal-green)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## 🚀 Features

- **Mac Terminal Aesthetic** - Beautiful terminal-styled interface with authentic Mac window design
- **Admin Dashboard** - Secure login-protected admin panel to manage job sources
- **Automated Scraping** - Configurable automatic scraping of job websites
- **Telegram Integration** - Auto-posts new jobs to Telegram group with formatted messages
- **Flexible Scraping** - Generic scraper that works with CSS selectors or custom scrapers
- **Job Management** - Track all scraped jobs, statistics, and posting status
- **Responsive Design** - Works on desktop, tablet, and mobile

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Setting Up Telegram Bot](#setting-up-telegram-bot)
- [Adding Job Sources](#adding-job-sources)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **Telegram Bot** (optional but recommended)
- **npm** or **yarn**

## 📦 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd w3j-project
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Copy the environment template:

```bash
cd backend
cp .env.example .env
```

2. Edit `.env` file with your settings:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (update with your connection string)
MONGODB_URI=mongodb://localhost:27017/w3j

# JWT Secret (change to a random secure string)
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_random

# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_group_chat_id_here

# Scraping Configuration
SCRAPE_INTERVAL_MINUTES=30
```

### Frontend Configuration

1. Copy the environment template:

```bash
cd frontend
cp .env.example .env
```

2. Edit `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SCRAPE_INTERVAL=30
```

## 🤖 Setting Up Telegram Bot

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the **Bot Token** (it looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Paste it in your `.env` file as `TELEGRAM_BOT_TOKEN`

### 2. Get Your Chat ID

1. Create a Telegram group for job postings
2. Add your bot to the group
3. Make the bot an admin (required to post messages)
4. Send a message in the group
5. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
6. Look for `"chat":{"id":-123456789` - copy this number
7. Paste it in your `.env` file as `TELEGRAM_CHAT_ID`

### 3. Test the Connection

Once your bot is set up, you can test it from the admin dashboard using the "Test Telegram Bot" button.

## 🏃‍♂️ Running the Application

### Development Mode

**Option 1: Run Backend and Frontend Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

**Option 2: Using a Process Manager**

Create a `start.sh` script:
```bash
#!/bin/bash
cd backend && npm run dev &
cd frontend && npm start &
wait
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin

**Default Login Credentials:**
- Username: `admin`
- Password: (what you set in `.env`)

⚠️ **IMPORTANT**: Change the default admin credentials in `.env` before deployment!

## 📝 Adding Job Sources

### Via Admin Dashboard

1. Log in to the admin panel
2. Navigate to the "Sources" tab
3. Click "Add Source"
4. Fill in the form:
   - **Source Name**: A friendly name (e.g., "Web3 Jobs Board")
   - **URL**: The jobs page URL
   - **CSS Selectors** (optional for custom scraping):
     - Job Container: `.job-listing`
     - Title: `.job-title`
     - Company: `.company-name`
     - Link: `a.apply-link`

### Example Sources

Here are some CSS selector examples for popular job boards:

**Generic Job Board:**
```json
{
  "name": "Example Jobs",
  "url": "https://example.com/jobs",
  "selectors": {
    "jobContainer": ".job-post",
    "title": ".job-title h2",
    "company": ".company-name",
    "location": ".job-location",
    "salary": ".salary-range",
    "link": "a.apply-button"
  }
}
```

## 📁 Project Structure

```
w3j-project/
├── backend/
│   ├── models/          # MongoDB schemas
│   │   ├── Job.js
│   │   └── WebsiteSource.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── sources.js
│   │   └── scraper.js
│   ├── middleware/      # Auth middleware
│   │   └── auth.js
│   ├── utils/           # Utilities
│   │   ├── scraper.js
│   │   ├── telegram.js
│   │   └── scrapingService.js
│   ├── server.js        # Main server file
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   │   ├── TerminalWindow.js
    │   │   └── TerminalWindow.css
    │   ├── pages/       # Page components
    │   │   ├── Login.js
    │   │   ├── Login.css
    │   │   ├── Dashboard.js
    │   │   └── Dashboard.css
    │   ├── utils/       # API utilities
    │   │   └── api.js
    │   ├── styles/      # Global styles
    │   │   └── index.css
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔌 API Documentation

### Authentication

**POST** `/api/auth/login`
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**GET** `/api/auth/verify` (requires token)

### Jobs

**GET** `/api/jobs` - Get all jobs (admin, paginated)
**GET** `/api/jobs/recent?limit=20` - Get recent jobs (public)
**GET** `/api/jobs/stats` - Get job statistics (admin)
**DELETE** `/api/jobs/:id` - Delete a job (admin)

### Sources

**GET** `/api/sources` - Get all sources (admin)
**POST** `/api/sources` - Create new source (admin)
**PUT** `/api/sources/:id` - Update source (admin)
**PATCH** `/api/sources/:id/toggle` - Toggle source active status (admin)
**DELETE** `/api/sources/:id` - Delete source (admin)

### Scraper

**POST** `/api/scraper/scrape` - Start manual scrape (admin)
**GET** `/api/scraper/status` - Get scraper status (admin)
**POST** `/api/scraper/retry-posts` - Retry failed Telegram posts (admin)
**GET** `/api/scraper/test-telegram` - Test Telegram connection (admin)

## 🚀 Deployment

### Backend Deployment (Heroku Example)

1. Create a Heroku app
2. Add MongoDB addon or use MongoDB Atlas
3. Set environment variables in Heroku dashboard
4. Deploy:

```bash
cd backend
git init
heroku git:remote -a your-app-name
git add .
git commit -m "Initial commit"
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to Vercel or Netlify

3. Update `REACT_APP_API_URL` to your backend URL

### Environment Variables for Production

Don't forget to set all environment variables in your hosting platform:
- MongoDB connection string
- JWT secret
- Admin credentials
- Telegram bot token
- Telegram chat ID

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseServerSelectionError`

**Solution**: 
- Check MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- For MongoDB Atlas, whitelist your IP

### Telegram Not Working

**Error**: `Telegram connection failed`

**Solutions**:
- Verify bot token is correct
- Ensure bot is admin in the group
- Check chat ID is correct (should be negative for groups)
- Test bot manually: `https://api.telegram.org/bot<TOKEN>/getMe`

### Scraping Returns No Jobs

**Solutions**:
- Check the website allows scraping (robots.txt)
- Verify CSS selectors are correct
- Try Puppeteer mode (automatic fallback)
- Some sites require JavaScript - Puppeteer handles this

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 📝 To-Do / Future Enhancements

- [ ] Add support for API-based job sources
- [ ] Email notifications
- [ ] Discord integration
- [ ] Advanced filtering options
- [ ] Job application tracking
- [ ] Multiple admin users
- [ ] Custom Telegram message templates
- [ ] Analytics dashboard
- [ ] Export jobs to CSV/JSON

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 💬 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review existing GitHub issues
3. Open a new issue with details

---

Built with ❤️ for the Web3 community

**$W3J** - Connecting talent with opportunities in the decentralized world.
