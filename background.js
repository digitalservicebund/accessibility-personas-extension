// Listen for requests to update the persona
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updatePersona") {
    // Get the CSS and JS file names from the message
    const cssFile = request.cssFile;
    const jsFile = request.jsFile || null;
    const personaName = request.personaName;
    const tabId = request.tabId;

    // Insert the CSS and JS files into the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Store the relevant files in local storage
      chrome.storage.local.set({ [tabId]: { cssFile, jsFile, personaName } });

      // Remove any existing CSS files
      if (cssFile) {
        chrome.scripting.removeCSS(
          {
            target: { tabId },
            files: ["ashleigh.css", "chris.css", "pawel.css", "ron.css"],
          },
          // Insert the new CSS file
          () => {
            chrome.scripting.insertCSS({
              target: { tabId },
              files: [cssFile],
            });
          }
        );
      }

      if (jsFile) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: [jsFile],
        });
      }
    });
  } else if (request.action == "resetSimulation") {
    // Open a new tab with the same URL, which ends the persona simulation
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const currentTabId = currentTab.id;
      const currentTabUrl = currentTab.url;

      // Open a new tab with the same URL
      chrome.tabs.create({ url: currentTabUrl }, (newTab) => {
        // Close the current tab after opening the new one
        chrome.tabs.remove(currentTabId, () => {
          if (chrome.runtime.lastError) {
            console.error("Error closing tab:", chrome.runtime.lastError);
          } else {
            console.log("Old tab closed successfully.");
          }
        });
      });
    });
  }
});

//
chrome.runtime.onMessage.addListener();

// Listen for tab updates, and re-insert the CSS and JS files if necessary
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    chrome.storage.local.get([tabId.toString()], function (result) {
      if (result[tabId]) {
        const { cssFile, jsFile } = result[tabId];
        // Reinsert CSS
        if (cssFile) {
          chrome.scripting
            .insertCSS({
              target: { tabId },
              files: [cssFile],
            })
            .catch((error) => console.error("Failed to insert CSS:", error));
        }

        // Re-execute JS
        if (jsFile) {
          chrome.scripting
            .executeScript({
              target: { tabId },
              files: [jsFile],
            })
            .catch((error) => console.error("Failed to execute JS:", error));
        }
      }
    });
  }
});
