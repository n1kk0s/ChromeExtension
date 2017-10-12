// background.js
// Does stuff in the background. Has access to APIs.
// A Single long-running script to manage a task or state

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({"url": "https://github.com/n1kk0s/ChromeExtension"});
});
