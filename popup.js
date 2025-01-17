// Get operating system to adjust some instructions
const getOperatingSystem = () => {
  try {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      return "mac";
    } else if (userAgent.includes("windows")) {
      return "windows";
    } else return "other";
  } catch {
    return "unknown";
  }
};

const operatingSystem = getOperatingSystem();

// Popup content containing the message keys for i18n
const popupContent = {
  title: "popupTitle",
  introduction: "popupIntroduction",
  resetButton: "resetButton",
  personas: [
    {
      name: "ashleigh",
      title: "ashleighTitle",
      description: "ashleighDescription",
      files: { css: true, js: false },
      instructions: [
        "ashleighInstructionBlur",
        "ashleighInstructionScreenReader",
        operatingSystem === "mac"
          ? "ashleighInstructionScreenReaderMac"
          : "ashleighInstructionScreenReaderWindows",
        "ashleighLearnMore",
      ],
    },
    {
      name: "pawel",
      title: "pawelTitle",
      description: "pawelDescription",
      files: { css: true, js: true },
      instructions: [
        "pawelInstructionDistractions",
        "pawelInstructionExtensions",
        "pawelInstructionSoundEffects",
        "pawelInstructionMidnightLizard",
        "pawelLearnMore",
      ],
    },
    {
      name: "simone",
      title: "simoneTitle",
      description: "simoneDescription",
      files: { css: false, js: true },
      instructions: [
        "simoneInstructionScrambledText",
        "simoneInstructionReadParagraphs",
        "simoneLearnMore",
      ],
    },
    {
      name: "ron",
      title: "ronTitle",
      description: "ronDescription",
      files: { css: false, js: true },
      instructions: [
        "ronInstructionShakingCursor",
        "ronInstructionCursorVisibility",
        "ronLearnMore",
      ],
    },
    {
      name: "claudia",
      title: "claudiaTitle",
      description: "claudiaDescription",
      files: { css: false, js: false },
      instructions: [
        "claudiaInstructionMagnification",
        operatingSystem === "mac"
          ? "claudiaInstructionSystemSettingsMac"
          : "claudiaInstructionSystemSettingsWindows",
        "claudiaLearnMore",
      ],
    },
    {
      name: "chris",
      title: "chrisTitle",
      description: "chrisDescription",
      files: { css: true, js: false },
      instructions: [
        "chrisInstructionColorPerception",
        "chrisInstructionCursorVisibility",
        "chrisInstructionKeyboardNavigation",
        "chrisLearnMore",
      ],
    },
    {
      name: "saleem",
      title: "saleemTitle",
      description: "saleemDescription",
      files: { css: false, js: false },
      instructions: [
        "saleemInstructionMute",
        "saleemInstructionVideo",
        "saleemLearnMore",
      ],
    },
  ],
};

// For local testing in standalone tab, check if chrome API is available
const isChromeAvailable =
  typeof chrome !== "undefined" &&
  chrome.tabs &&
  chrome.tabs.query &&
  chrome.i18n &&
  chrome.i18n.getMessage &&
  chrome.storage;

// Set html lang attribute based on browser language
const userLang = isChromeAvailable ? chrome.i18n.getUILanguage() : "en";
document.documentElement.lang = userLang;

// Function to look up the i18n messages later for the correct locale
const translateContent = function (obj) {
  // For local testing, just return keys
  const getMessage = (key) =>
    isChromeAvailable ? chrome.i18n.getMessage(key) : key;

  if (typeof obj === "string") {
    return getMessage(obj) || obj;
  } else if (Array.isArray(obj)) {
    return obj.map(translateContent);
  } else if (typeof obj === "object" && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = translateContent(value);
    }
    return result;
  }
  return obj;
};

// Function to generate a single persona element in the list
const createPersonaElement = function (persona) {
  const personaSection = document.createElement("section");
  personaSection.className = "persona p-4 bg-slate-200 m-4 rounded-md";
  personaSection.setAttribute("persona-name", persona.name);
  const simulateBtnText = translateContent("simulateButton");

  // Give the "simulate" button all necessary attributes so that
  // the correct simulation is started later
  let simulateBtnAttributes = `class="select-persona font-semibold bg-slate-800 rounded-lg text-white px-4 py-2" persona-name="${persona.name}"`;
  if (persona.files.css) {
    simulateBtnAttributes += ` data-css="personas/${persona.name}/${persona.name}.css"`;
  }
  if (persona.files.js) {
    simulateBtnAttributes += ` data-js="personas/${persona.name}/${persona.name}.js"`;
  }

  // Create the HTML for the persona element
  personaSection.innerHTML = `
    <h2 class="text-lg font-semibold">${persona.title}</h2>
    <div class="mb-1">
      <div class="flex items-center py-2">
        <img src="personas/${persona.name}/${persona.name}.png" alt="${
          persona.title
        } persona image" aria-hidden="true"/>
        <p class="persona-description text-base mx-4">${persona.description}</p>
        <button
          ${simulateBtnAttributes}"
        >
          ${simulateBtnText}
        </button>
      </div>
    </div>
    <div
      class="instructions hidden p-4 mt-2 bg-slate-700 rounded-md text-white"
      persona-name="${persona.name}"
    >
      ${persona.instructions
        .map((instruction) => `<p class="mb-2">${instruction}</p>`)
        .join("")}
    </div>
  `;

  return personaSection;
};

// Function to build the entire popup
const buildPopup = function () {
  const personaList = document.getElementById("persona-list");

  ["popup-title", "popup-introduction", "reset-button"].forEach((elementId) => {
    const element = document.getElementById(elementId);
    element.innerText = translateContent(element.dataset.i18n);
  });

  const translatedContent = translateContent(popupContent);

  translatedContent.personas.forEach((persona) => {
    personaList.appendChild(createPersonaElement(persona));
  });
};

// Build the popup when the script is run
buildPopup();

// Function to re-format the popup when a persona is selected
function formatPopup(personaName = null) {
  function updateElements(selectedPersonaName) {
    if (!selectedPersonaName) return;

    // Hide the activation button for the selected persona
    const activationButton = document.querySelector(
      `.select-persona[persona-name="${selectedPersonaName}"]`,
    );
    if (activationButton) activationButton.style.display = "none";

    // Show the instructions for the selected persona
    const instructionsElement = document.querySelector(
      `.instructions[persona-name="${selectedPersonaName}"]`,
    );
    if (instructionsElement) instructionsElement.style.display = "block";

    // Hide all non-selected personas
    document.querySelectorAll(".persona").forEach((persona) => {
      if (persona.getAttribute("persona-name") !== selectedPersonaName) {
        persona.style.display = "none";
      }
    });

    // Show the reset button
    const resetButton = document.getElementById("reset-button");
    if (resetButton) resetButton.style.display = "block";

    // Hide the general introduction in the header
    const popupIntroduction = document.getElementById("popup-introduction");
    if (popupIntroduction) popupIntroduction.style.display = "none";
  }

  if (isChromeAvailable) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabId = tabs[0].id;
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
  } else {
    updateElements(personaName);
  }
}

// Attempt to format the popup based on local storage when it is opened
formatPopup();

// Persona selection button: Reformat the list and start the simulatino
document.querySelectorAll(".select-persona").forEach((button) => {
  button.addEventListener("click", function () {
    // Get the CSS and JS file names from the data attributes
    const cssFile = this.getAttribute("data-css");
    const jsFile = this.getAttribute("data-js") || null;
    const personaName = this.getAttribute("persona-name");

    // Format the persona list
    formatPopup(personaName);

    // Send a message to the background script to start simulation
    if (isChromeAvailable) {
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
    }
  });
});

// Reset button: Open a new tab with the original URL
document.getElementById("reset-button").addEventListener("click", function () {
  if (isChromeAvailable) {
    chrome.runtime.sendMessage({ action: "resetSimulation" });
  }
});

// Close popup if requested in background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "closePopup") {
    window.close();
  }
});
