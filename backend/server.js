// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let youtubeData = {};

app.post('/api/youtube-data', (req, res) => {
  console.log('Received data from extension');
  
  const newData = req.body;
  youtubeData = { ...youtubeData, ...newData };
  
  res.status(200).json({ 
    message: 'Data synced successfully',
    tracksCount: Object.keys(youtubeData).length
  });
});

app.get('/api/youtube-data', (req, res) => {
  res.status(200).json(youtubeData);
});

app.listen(PORT, () => {
  console.log(`Echo backend running on http://localhost:${PORT}`);
});