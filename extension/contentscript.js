console.log('hello from content script');

var port = chrome.runtime.connect({name: 'vega-contentscript'});

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "SCENEGRAPH")) {
    console.log("Content script received message");
    port.postMessage({type: "SCENEGRAPH", content: event.data.content}); // send to background script
  }
}, false);
