// Listen for requests to update the persona
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updatePersona") {
    // Get the CSS and JS file names from the message
    const cssFile = request.cssFile;
    const jsFile = request.jsFile || null;
    const personaName = request.personaName;
    const tabId = request.tabId;

    // Insert the CSS and JS files into the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      // Store the relevant file names in local storage
      chrome.storage.local.set({ [tabId]: { cssFile, jsFile, personaName } });

      // Close
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

      // Workaround for simulations that need access to chrome:

      // For persona Claudia: Set tab zoom and contrast mode
      if (personaName === "claudia") {
        chrome.tabs.setZoom(tabId, 2.0);
        const isAttached = await attachDebugger(tabId, chrome);
        if (isAttached) {
          await emulateDarkMode(tabId, true);
          await emulateForcedColors(tabId, true);
        }
      }

      // For persona Saleem: Mute tab
      else if (personaName === "saleem") {
        chrome.tabs.update(tabId, { muted: true });
      }

      // Wait briefly for styles to be applied
      setTimeout(() => {
        chrome.tabs.get(tabId, (tab) => {
          // Focus window to make sure cursor styles are applied
          chrome.windows.update(tab.windowId, { focused: true });
          // Open popup again to show instructions
          chrome.action.openPopup({ windowId: tab.windowId });
        });
      }, 300);
    });
  } else if (request.action == "resetSimulation") {
    // Reset the simulation by closing the current tab and opening a new one
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      const currentTabId = currentTab.id;
      const currentTabUrl = currentTab.url;

      // For persona Claudia: Reset the zoom level and detach the debugger
      chrome.tabs.setZoom(currentTabId, 0);
      try {
        // Attempt to detach, it won't throw an error if not attached.
        await chrome.debugger.detach({ tabId: tabId });
        console.log("Debugger detached on tab removal: " + tabId);
      } catch (e) {
        console.warn(
          "Could not detach debugger on tab removal (might not have been attached):",
          e,
        );
      }

      // For persona Saleem: Unmute the tab
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
    chrome.storage.local.get([tabId.toString()], (tabData) => {
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

// Function to attach the debugger to the current active tab
async function attachDebugger(tabId) {
  try {
    await chrome.debugger.attach({ tabId: tabId }, "1.3");
    console.log("Debugger attached to tab: " + tabId);
    return true;
  } catch (error) {
    console.error("Failed to attach debugger:", error.message);
    return false;
  }
}

// Function to detach the debugger
async function detachDebugger(tabId) {
  try {
    await chrome.debugger.detach({ tabId: tabId });
    console.log("Debugger detached from tab: " + tabId);
  } catch (error) {
    console.error("Failed to detach debugger:", error);
  }
}

// Function to emulate prefers-color-scheme: dark
async function emulateDarkMode(tabId, enabled) {
  try {
    await chrome.debugger.sendCommand(
      { tabId: tabId },
      "Emulation.setEmulatedMedia",
      {
        media: "screen", // Keep other media features as default
        features: [
          { name: "prefers-color-scheme", value: enabled ? "dark" : "light" },
        ],
      },
    );
    console.log(
      `prefers-color-scheme emulated to: ${enabled ? "dark" : "light"}`,
    );
  } catch (error) {
    console.error("Error emulating dark mode:", error);
  }
}

// Function to emulate forced-colors: active
async function emulateForcedColors(tabId, enabled) {
  try {
    await chrome.debugger.sendCommand(
      { tabId: tabId },
      "Emulation.setEmulatedMedia",
      {
        media: "screen",
        features: [
          { name: "forced-colors", value: enabled ? "active" : "none" },
        ],
      },
    );
    console.log(`forced-colors emulated to: ${enabled ? "active" : "none"}`);
  } catch (error) {
    console.error("Error emulating forced colors:", error);
  }
}
