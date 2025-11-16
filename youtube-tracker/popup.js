// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const exportButton = document.getElementById('exportData');
  const clearButton = document.getElementById('clearData');
  const syncButton = document.getElementById('syncData');
  const statusEl = document.getElementById('status');
  const trackCountEl = document.getElementById('trackCount');
  const playCountEl = document.getElementById('playCount');

  // Load stats when popup opens - ADDED BACK
  loadStats();

  syncButton.addEventListener('click', () => {
    statusEl.textContent = 'Syncing...';
    syncButton.disabled = true;
    
    chrome.storage.local.get(null, (items) => {
      if (chrome.runtime.lastError) {
        showError('Error getting data.');
        return;
      }

      const youtubeItems = {};
      Object.keys(items).forEach(key => {
        if (key.startsWith('yt_') && items[key].platform === "youtube") {
          youtubeItems[key] = items[key];
        }
      });

      fetch('http://localhost:3001/api/youtube-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(youtubeItems),
      })
      .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        statusEl.textContent = data.message;
        setTimeout(() => {
          statusEl.textContent = 'Sync complete';
          syncButton.disabled = false;
        }, 2000);
      })
      .catch(error => {
        console.error('Error syncing data:', error);
        showError('Sync failed');
      });
    });
  });

  exportButton.addEventListener('click', () => {
    chrome.storage.local.get(null, (items) => {
      if (chrome.runtime.lastError) {
        showError('Error getting data.');
        return;
      }
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "echo_data.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      statusEl.textContent = 'Data exported';
    });
  });

  clearButton.addEventListener('click', () => {
    if (confirm('Clear all tracking data?')) {
      chrome.storage.local.clear(() => {
        statusEl.textContent = 'Data cleared';
        loadStats(); // Refresh stats after clearing
      });
    }
  });

  // Load stats function - ADDED BACK
  function loadStats() {
    chrome.storage.local.get(null, (items) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      let totalTracks = 0;
      let totalPlays = 0;

      Object.keys(items).forEach(key => {
        if (key.startsWith('yt_') && items[key].platform === "youtube") {
          totalTracks++;
          totalPlays += items[key].playCount || 0;
        }
      });

      trackCountEl.textContent = totalTracks;
      playCountEl.textContent = totalPlays;
    });
  }

  function showError(message) {
    statusEl.textContent = message;
    syncButton.disabled = false;
  }
});