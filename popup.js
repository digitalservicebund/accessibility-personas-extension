function formatPersonaList(personaName = null) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTabId = tabs[0].id;

    function updateElements(selectedPersonaName) {
      // Hide the activation button for the selected persona
      const activationButton = document.querySelector(
        `.select-persona[persona-name="${selectedPersonaName}"]`
      );
      activationButton.style.display = "none";

      // Show the instructions for the selected persona
      const instructionsElement = document.querySelector(
        `.instructions[persona-name="${selectedPersonaName}"]`
      );
      instructionsElement.style.display = "block";

      // Hide all non-selected personas
      document.querySelectorAll(".persona").forEach((persona) => {
        if (persona.getAttribute("persona-name") !== selectedPersonaName) {
          persona.style.display = "none";
        }
      });

      // Show the reset button
      document.getElementById("reset-button").style.display = "block";

      // Hide the general introduction in the header
      document.getElementById("introduction").style.display = "none";
    }

    if (personaName) {
      updateElements(personaName);
    } else {
      chrome.storage.local.get([currentTabId.toString()], function (result) {
        if (
          result[currentTabId] &&
          result[currentTabId].personaName !== undefined
        ) {
          updateElements(result[currentTabId].personaName);
        }
      });
    }
  });
}

// Attempt to format the persona list based on local storage when the popup is opened
formatPersonaList();

// Persona selection button: Reformat the list and start the simulatino
document.querySelectorAll(".select-persona").forEach((button) => {
  button.addEventListener("click", function () {
    // Get the CSS and JS file names from the data attributes
    const cssFile = this.getAttribute("data-css");
    const jsFile = this.getAttribute("data-js") || null;
    const personaName = this.getAttribute("persona-name");

    // Format the persona list
    formatPersonaList(personaName);

    // Send a message to the background script to start simulation
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabId = tabs[0].id;
      chrome.runtime.sendMessage({
        action: "updatePersona",
        cssFile,
        jsFile,
        personaName,
        tabId: currentTabId,
      });
    });
  });
});

// Reset button: Open a new tab with the original URL
document.getElementById("reset-button").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "resetSimulation" });
});
