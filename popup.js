function formatPersonaList() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTabId = tabs[0].id;

    chrome.storage.local.get([currentTabId.toString()], function (result) {
      if (result[currentTabId]) {
        // Extract the personaName
        const personaName = result[currentTabId].personaName;

        if (personaName !== undefined) {
          // Disable all buttons
          document.querySelectorAll(".select-persona").forEach((button) => {
            button.disabled = true;
          });

          // Hide the selected button
          document.getElementById(personaName).style.display = "none";
          // Display the respective instruction button instead
          const selector = `.instructions[data-overlay="${personaName}Overlay"]`;
          console.log("selector", selector);
          const personaInstructionButton = document.querySelector(selector);
          console.log("personaInstructionButton", personaInstructionButton);
          personaInstructionButton.style.display = "block";

          // Format the selected persona
          personaInstructionButton.parentElement.parentElement.classList.add(
            "selected-persona"
          );

          // Show the hint to open a new tab for a new persona
          document.getElementById("new-tab-hint").style.display = "block";
        }
      }
    });
  });
}

formatPersonaList();

// Listen to clicks on the select-persona buttons
document.querySelectorAll(".select-persona").forEach((button) => {
  button.addEventListener("click", function () {
    // Get the CSS and JS file names from the data attributes
    const cssFile = this.getAttribute("data-css");
    const jsFile = this.getAttribute("data-js") || null;
    const personaName = this.getAttribute("id");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabId = tabs[0].id;

      // Send a message to the background script to update the persona and enable simulation
      chrome.runtime.sendMessage({
        action: "updatePersona",
        cssFile,
        jsFile,
        personaName,
        tabId: currentTabId,
      });
    });

    // Show the overlay with persona details and instructions
    const overlayId = this.getAttribute("data-overlay");
    document.getElementById(overlayId).style.display = "block";

    // Format the persona list
    formatPersonaList();
  });
});

// Listen to clicks on the instructions buttons, and show the overlay
document.querySelectorAll(".instructions").forEach((button) => {
  button.addEventListener("click", function () {
    // Show the overlay with persona details and instructions
    const overlayId = this.getAttribute("data-overlay");
    document.getElementById(overlayId).style.display = "block";
  });
});

// Listen to clicks on the close-overlay button
document.querySelectorAll(".close-overlay").forEach((button) => {
  button.addEventListener("click", function () {
    // Hide the overlay
    this.parentElement.parentElement.style.display = "none";

    // Format the persona list
    formatPersonaList();
  });
});
