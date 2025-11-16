Echo - Music Tracker
Echo is a personal music analytics dashboard that tracks your YouTube listening history and provides beautiful insights into your music habits.

https://img.shields.io/badge/Echo-Music%2520Tracker-blue
https://img.shields.io/badge/version-1.0.0-green

🎵 Features
Automatic Tracking: Tracks YouTube videos you watch for more than 30 seconds

Beautiful Dashboard: Modern, dark-themed interface with statistics and analytics

Real-time Sync: Automatically syncs data between extension and dashboard

Export Data: Download your listening history as JSON

Cross-Platform: Works on Chrome and other Chromium-based browsers

📊 What Echo Tracks
Number of times you've played each track

Total watch time per track

Your most played songs

Overall listening statistics

🚀 Quick Start
Prerequisites
Node.js (v14 or higher)

npm or yarn

Chrome browser

Installation
Set up the Backend

bash
cd backend
npm install
node server.js
The backend will run on http://localhost:3001

Set up the Frontend

bash
cd frontend
npm install
npm start
The dashboard will open at http://localhost:3000

Install the Browser Extension

Open Chrome and go to chrome://extensions/

Enable "Developer mode"

Click "Load unpacked" and select the youtube-tracker folder

The Echo extension will appear in your toolbar

🎮 How to Use
Start Tracking: Simply browse YouTube as normal - Echo automatically tracks videos you watch for 30+ seconds

Sync Data: Click the Echo extension icon and click "Sync to Dashboard"

View Analytics: Open http://localhost:3000 to see your listening statistics

Export Data: Use the "Export Data" button in the extension to download your history

📁 Project Structure
text
echo-music-tracker/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── App.css
│   ├── public/
│   │   └── index.html
│   └── package.json
└── youtube-tracker/
    ├── manifest.json
    ├── background.js
    ├── content.js
    ├── popup.html
    ├── popup.js
    └── icons/
🔧 Technical Details
Frontend: React.js with modern CSS

Backend: Node.js with Express

Extension: Chrome Extension Manifest V3

Storage: Chrome local storage (extension) + in-memory storage (backend)

🛠️ Development
Backend API Endpoints
POST /api/youtube-data - Receive data from extension

GET /api/youtube-data - Send data to frontend

Extension Components
content.js - Tracks YouTube video plays

background.js - Monitors tab updates

popup.js - Extension popup interface

👨‍💻 Created By
MutuaGift

Note: Echo only tracks data locally and doesn't send any information to external servers. Your listening history remains private and under your control.