console.log('hello from background.js');

let contentScriptPort;
let panelPort;

chrome.runtime.onConnect.addListener(function(portFrom) {  
  console.log('background onConnect', portFrom.name);


  if(portFrom.name === 'vega-contentscript') {
    portFrom.onMessage.addListener(function(message) {
      contentScriptPort = portFrom;
      console.log('background got message from contentscript');
      if (panelPort) {
        console.log('sending on to panel');
        panelPort.postMessage(message);
      }
    });
  }

  if(portFrom.name === 'vega-panel') {
    panelPort = portFrom;
    portFrom.onMessage.addListener(function(message) {
      console.log('background got message from panel', message);
    });
  }
});
