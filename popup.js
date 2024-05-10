document.querySelectorAll(".select-persona").forEach((button) => {
  button.addEventListener("click", function () {
    // Get the CSS and JS file names from the data attributes
    const cssFile = this.getAttribute("data-css");
    const jsFile = this.getAttribute("data-js") || null;

    // Send a message to the background script to update the persona
    chrome.runtime.sendMessage({ action: "updatePersona", cssFile, jsFile });

    // Show the overlay with persona details and instructions
    const overlayId = this.getAttribute("data-overlay");
    document.getElementById(overlayId).style.display = "block";
    console.log("overlayId", overlayId);
  });
});

document.querySelectorAll(".close-overlay").forEach((button) => {
  // Hide the overlay when the close button is clicked
  button.addEventListener("click", function () {
    this.parentElement.parentElement.style.display = "none";
  });
});
