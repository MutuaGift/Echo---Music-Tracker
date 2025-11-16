// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [youtubeTracks, setYoutubeTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchYouTubeData();
    const interval = setInterval(fetchYouTubeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchYouTubeData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/youtube-data");
      const data = await response.json();
      const dataArray = Object.values(data);
      
      dataArray.sort((a, b) => b.playCount - a.playCount);
      setYoutubeTracks(dataArray);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching YouTube data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getTotalStats = () => {
    const totalPlays = youtubeTracks.reduce((sum, track) => sum + track.playCount, 0);
    const totalWatchTime = youtubeTracks.reduce((sum, track) => sum + track.totalWatchTime, 0);
    const uniqueTracks = youtubeTracks.length;
    return { totalPlays, totalWatchTime, uniqueTracks };
  };

  const { totalPlays, totalWatchTime, uniqueTracks } = getTotalStats();

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <h1>Echo</h1>
            </div>
            <p className="tagline">Track Your Music Journey</p>
          </div>
          
          {/* Stats Overview - ADDED BACK */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-number">{uniqueTracks}</div>
              <div className="stat-label">Unique Tracks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalPlays}</div>
              <div className="stat-label">Total Plays</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{formatTime(totalWatchTime)}</div>
              <div className="stat-label">Total Listen Time</div>
            </div>
          </div>
        </div>

        <div className="data-section">
          <div className="section-header">
            <h2>Your Listening History</h2>
            <div className="header-actions">
              {lastUpdated && (
                <span className="last-updated">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button 
                onClick={fetchYouTubeData} 
                className={`action-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Refreshing...
                  </>
                ) : (
                  'Refresh'
                )}
              </button>
            </div>
          </div>
          
          <div className="track-list">
            {youtubeTracks.length > 0 ? (
              youtubeTracks.map((track, index) => (
                <div key={track.id} className="track-item">
                  <div className="track-rank">
                    <div className="rank-number">{index + 1}</div>
                  </div>
                  <div className="track-info">
                    <div className="track-title">{track.title}</div>
                    <div className="track-meta">
                      <span className="play-count">
                        {track.playCount} {track.playCount === 1 ? 'play' : 'plays'}
                      </span>
                      <span className="watch-time">
                        {formatTime(track.totalWatchTime)}
                      </span>
                    </div>
                  </div>
                  <div className="track-actions">
                    <a 
                      href={`https://www.youtube.com/watch?v=${track.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="watch-link"
                    >
                      Watch
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>Your music journey begins here</h3>
                <p>Start watching YouTube videos and Echo will track your listening history automatically.</p>
                <div className="tips">
                  <div className="tip-item">
                    Make sure the Echo extension is enabled
                  </div>
                  <div className="tip-item">
                    Watch videos for at least 30 seconds
                  </div>
                  <div className="tip-item">
                    Click "Sync Data" in the extension popup
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="footer">
          <p>Created by Liwu</p>
        </footer>
      </header>
    </div>
  );
}

export default App;