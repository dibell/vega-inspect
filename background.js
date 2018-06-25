chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
	console.log("The color is green.");
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          css: ["#container"]
        })
	  ],
      actions: [
        new chrome.declarativeContent.ShowPageAction()
      ]
	}]);
  });

  chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  console.log(sender.tab ?
				  "from a content script:" + sender.tab.url :
				  "from the extension");
	  if (request.greeting == "hello")
		sendResponse({farewell: "goodbye"});
	}
  );
});

