console.log('hello');

// var port = chrome.runtime.connect('pkogbgncpklkcicifnpmfmfgedcjpcpk');

window.addEventListener("message", function(event) {
  console.log('content script got event');
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
    // port.postMessage(event.data.text);
	chrome.runtime.sendMessage('pkogbgncpklkcicifnpmfmfgedcjpcpk',
                               {greeting: "hello"}, function(response) {
	  console.log(response.farewell);
	});
  }
}, false);
