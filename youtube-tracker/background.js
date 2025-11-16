// background.js

// Track active tabs and their video states
const activeTabs = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab update is complete and the URL is a YouTube page
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes("youtube.com/watch")) {
    const videoId = new URL(tab.url).searchParams.get('v');
    
    // Send a message to the content script in that tab
    chrome.tabs.sendMessage(tabId, {
      type: "YT_PAGE_LOADED",
      videoId: videoId
    });
  }
});

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (activeTabs.has(tabId)) {
    activeTabs.delete(tabId);
  }
});