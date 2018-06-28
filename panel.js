console.log('hello from panel.js');

//Create a port with background page for continous message communication
var port = chrome.runtime.connect({ name: "vega-panel" });

// Listen to messages from the background page
port.onMessage.addListener(function (message) {
  console.log('panel got message', message);
  document.querySelector('#content').innerHTML = message.content;
  // port.postMessage(message);
});

