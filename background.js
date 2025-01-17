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
      // Store the relevant file names in local storage
      chrome.storage.local.set({ [tabId]: { cssFile, jsFile, personaName } });

      chrome.runtime.sendMessage({ action: "closePopup" });

      // Insert the CSS and JS files as applicable
      if (cssFile) {
        chrome.scripting.insertCSS({
          target: { tabId },
          files: [cssFile],
        });
      }
      if (jsFile) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: [jsFile],
        });
      }

      // Workaround for simulations that need the chrome.tabs API:

      // Claudia: Set tab zoom to 200%
      if (personaName === "claudia") {
        chrome.tabs.setZoom(tabId, 2.0);
      }
      // Saleem: Mute tab
      else if (personaName === "saleem") {
        chrome.tabs.update(tabId, { muted: true });
      }

      // Show popup again
      setTimeout(() => {
        chrome.tabs.get(tabId, (tab) => {
          chrome.windows.update(tab.windowId, { focused: true });
          chrome.action.openPopup({ windowId: tab.windowId });
        });
      }, 200);
    });
  } else if (request.action == "resetSimulation") {
    // Reset the simulation by closing the current tab and opening a new one
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const currentTabId = currentTab.id;
      const currentTabUrl = currentTab.url;

      // Reset the zoom level
      chrome.tabs.setZoom(currentTabId, 0);

      // Unmute the tab
      chrome.tabs.update(currentTabId, { muted: false });

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

// Listen for tab updates, and re-insert the CSS and JS files if necessary
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    // Get the CSS and JS file names from local storage
    chrome.storage.local.get([tabId.toString()], function (tabData) {
      if (tabData[tabId]) {
        const { cssFile, jsFile } = tabData[tabId];
        // Re-insert CSS
        if (cssFile) {
          chrome.scripting
            .insertCSS({
              target: { tabId },
              files: [cssFile],
            })
            .catch((error) => console.error("Failed to re-insert CSS:", error));
        }

        // Re-execute JS
        if (jsFile) {
          chrome.scripting
            .executeScript({
              target: { tabId },
              files: [jsFile],
            })
            .catch((error) => console.error("Failed to re-insert JS:", error));
        }
      }
    });
  }
});
