document.getElementById("extract").addEventListener("click", async () => {
  // Get the currently active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];

    // Use the active tab in your code
    const response = chrome.tabs.sendMessage(activeTab.id, {
      action: "SCRAPE_CONTENT",
    });
  });
});
