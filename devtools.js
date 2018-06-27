console.log('devtools.js');

chrome.devtools.panels.create("Vega",
  "vega_inspect.png",
  "panel.html",
  function(panel) {
    // code invoked on panel creation
    console.log('devtools.js panel created');
  }
);

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
  // Handle responses from the background page, if any
  console.log('devtools.js message', message);
});

// Relay the tab ID to the background page
chrome.runtime.sendMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  scriptToInject: "contentscript.js"
});
