document.querySelectorAll('.select-persona').forEach(button => {
  button.addEventListener('click', function() {
    const cssFile = this.getAttribute('data-css');
    const jsFile = this.getAttribute('data-js') || null;
    const overlayId = this.getAttribute('data-overlay');

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.removeCSS({
        target: {tabId: tabs[0].id},
        files: ["ashleigh.css", "chris.css", "pawel.css", "ron.css"]
      }, () => {
        chrome.scripting.insertCSS({
          target: {tabId: tabs[0].id},
          files: [cssFile]
        });
      });

      if (jsFile) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          files: [jsFile]
        });
      }
    });
    
    document.getElementById(overlayId).style.display = 'block';
  });
});

document.querySelectorAll('.close-overlay').forEach(button => {
  button.addEventListener('click', function() {
    this.parentElement.parentElement.style.display = 'none';
  });
});
