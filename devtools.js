console.log('devtools.js');

chrome.devtools.panels.create("Vega",
  "vega_inspect.png",
  "panel.html",
  function(panel) {
    // code invoked on panel creation
    console.log('devtools.js panel created');
  }
);
