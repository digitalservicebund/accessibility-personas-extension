// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updatePersona") {
    // Get the CSS and JS file names from the message
    const cssFile = request.cssFile;
    const jsFile = request.jsFile || null;
    //const tabId = sender.tab.id;

    // Insert the CSS and JS files into the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.removeCSS(
        {
          target: { tabId: tabs[0].id },
          files: ["ashleigh.css", "chris.css", "pawel.css", "ron.css"],
        },
        () => {
          chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            files: [cssFile],
          });
        }
      );

      if (jsFile) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: [jsFile],
        });
      }
    });
  }
});
