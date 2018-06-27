chrome.runtime.onConnect.addListener(function(devToolsConnection) {
    console.log('onConnect', devToolsConnection);

    // assign the listener function to a variable so we can remove it later
    var devToolsListener = function(message, sender, sendResponse) {
        console.log('devToolsListener', message.scriptToInject, sender.tabId);
        // Inject a content script into the identified tab
        chrome.tabs.executeScript(message.tabId,
            { file: message.scriptToInject });
    }

    // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);

    devToolsConnection.onDisconnect.addListener(function() {
         console.log('onDisconnect');
         devToolsConnection.onMessage.removeListener(devToolsListener);
    });
    console.log('done');
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (!sender.tab) {
    return;
  }
  console.log('onMessage', sender.tab, request.type); //request, sender, sendResponse);
});

chrome.tabs.onUpdated.addListener(function(tabId) {
  console.log('onUpdated', tabId);
});
