// content.js

let currentVideoId = "";
let currentVideoTitle = "";
let playTimer = null;
let startTime = null;
let currentWatchTime = 0;
const WATCH_THRESHOLD = 10000;

const getVideoTitle = () => {
  const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string') ||
                  document.querySelector('.title.ytd-video-primary-info-renderer') ||
                  document.querySelector('h1.ytd-watch-metadata') ||
                  document.querySelector('h1.yt-video-title');
  
  if (titleEl) {
    return titleEl.textContent.trim();
  }
  
  return document.title.replace(' - YouTube', '').trim();
};

const getVideoPlayer = () => {
  return document.querySelector('video');
};

const startTracking = (videoId) => {
  if (currentVideoId === videoId) return;

  stopTracking();
  
  currentVideoId = videoId;
  currentVideoTitle = getVideoTitle();
  startTime = Date.now();
  currentWatchTime = 0;

  const video = getVideoPlayer();
  if (video) {
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);
    video.addEventListener('ended', handleVideoEnd);
    
    if (!video.paused) {
      handleVideoPlay();
    }
  }
};

const stopTracking = () => {
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
  }
  
  const video = getVideoPlayer();
  if (video) {
    video.removeEventListener('play', handleVideoPlay);
    video.removeEventListener('pause', handleVideoPause);
    video.removeEventListener('ended', handleVideoEnd);
  }
  
  if (currentVideoId && currentWatchTime > 0) {
    saveWatchTime(currentVideoId, currentVideoTitle, currentWatchTime);
  }
  
  currentVideoId = "";
  currentVideoTitle = "";
  currentWatchTime = 0;
  startTime = null;
};

const handleVideoPlay = () => {
  startTime = Date.now();
  
  playTimer = setInterval(() => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    
    currentWatchTime += 1000;
    startTime = currentTime;
    
    if (currentWatchTime >= WATCH_THRESHOLD && currentWatchTime % WATCH_THRESHOLD === 0) {
      logPlay(currentVideoId, currentVideoTitle, currentWatchTime);
    }
    
  }, 1000);
};

const handleVideoPause = () => {
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
  }
  
  if (currentVideoId && currentWatchTime > 0) {
    saveWatchTime(currentVideoId, currentVideoTitle, currentWatchTime);
  }
};

const handleVideoEnd = () => {
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
  }
  
  if (currentVideoId && currentWatchTime > 0) {
    saveWatchTime(currentVideoId, currentVideoTitle, currentWatchTime);
    logPlay(currentVideoId, currentVideoTitle, currentWatchTime);
  }
};

const saveWatchTime = (videoId, title, watchTime) => {
  const videoKey = `yt_${videoId}`;

  chrome.storage.local.get([videoKey], (result) => {
    const data = result[videoKey] || {
      id: videoId,
      title: title,
      platform: "youtube",
      playCount: 0,
      totalWatchTime: 0
    };

    data.totalWatchTime = Math.round((data.totalWatchTime * 1000 + watchTime) / 1000);
    data.title = title;

    chrome.storage.local.set({ [videoKey]: data });
  });
};

const logPlay = (videoId, title, watchTime) => {
  const videoKey = `yt_${videoId}`;

  chrome.storage.local.get([videoKey], (result) => {
    const data = result[videoKey] || {
      id: videoId,
      title: title,
      platform: "youtube",
      playCount: 0,
      totalWatchTime: 0
    };

    if (watchTime >= WATCH_THRESHOLD) {
      data.playCount += 1;
    }

    data.title = title;

    chrome.storage.local.set({ [videoKey]: data });
  });
};

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, { subtree: true, childList: true });

const onUrlChange = () => {
  if (location.href.includes("youtube.com/watch")) {
    const videoId = new URL(location.href).searchParams.get('v');
    if (videoId) {
      setTimeout(() => {
        startTracking(videoId);
      }, 1000);
    }
  } else {
    stopTracking();
  }
};

if (location.href.includes("youtube.com/watch")) {
  const videoId = new URL(location.href).searchParams.get('v');
  if (videoId) {
    setTimeout(() => {
      startTracking(videoId);
    }, 1000);
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
  } else {
    const video = getVideoPlayer();
    if (video && !video.paused && currentVideoId) {
      handleVideoPlay();
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "YT_PAGE_LOADED") {
    startTracking(message.videoId);
  }
});