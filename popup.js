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
      name: "pawel",
      title: "pawelTitle",
      description: "pawelDescription",
      warning: "pawelWarning",
      files: { css: false, js: true },
      learnMoreLink: {
        en: "https://www.gov.uk/government/publications/understanding-disabilities-and-impairments-user-profiles/pawel-user-with-aspergers",
        de: "https://digitalservicebund.usercontent.opencode.de/accessibility/barrierefreiheits-personas/personas/pawel/",
      },
      instructions: ["pawelInstructionDistractions"],
    },
    {
      name: "simone",
      title: "simoneTitle",
      description: "simoneDescription",
      files: { css: false, js: true },
      learnMoreLink: {
        en: "https://www.gov.uk/government/publications/understanding-disabilities-and-impairments-user-profiles/simone-dyslexic-user",
        de: "https://digitalservicebund.usercontent.opencode.de/accessibility/barrierefreiheits-personas/personas/simone/",
      },
      instructions: [
        "simoneInstructionScrambledText",
        "simoneInstructionReadParagraphs",
      ],
    },
    {
      name: "ron",
      title: "ronTitle",
      description: "ronDescription",
      files: { css: false, js: true },
      learnMoreLink: {
        en: "https://www.gov.uk/government/publications/understanding-disabilities-and-impairments-user-profiles/ron-older-user-with-multiple-conditions",
        de: "https://digitalservicebund.usercontent.opencode.de/accessibility/barrierefreiheits-personas/personas/ron/",
      },
      instructions: [
        "ronInstructionShakingCursor",
        { key: "ronInstructionCursorVisibility", type: "info" },
      ],
    },
    {
      name: "claudia",
      title: "claudiaTitle",
      description: "claudiaDescription",
      files: { css: true, js: false },
      learnMoreLink: {
        en: "https://www.gov.uk/government/publications/understanding-disabilities-and-impairments-user-profiles/claudia-partially-sighted-screen-magnifier-user",
        de: "https://digitalservicebund.usercontent.opencode.de/accessibility/barrierefreiheits-personas/personas/claudia/",
      },
      instructions: [
        "claudiaInstructionMagnification",
        operatingSystem === "mac"
          ? "claudiaInstructionSystemSettingsMac"
          : "claudiaInstructionSystemSettingsWindows",
      ],
    },
    {
      name: "chris",
      title: "chrisTitle",
      description: "chrisDescription",
      files: { css: true, js: false },
      learnMoreLink: {
        en: "https://www.gov.uk/government/publications/understanding-disabilities-and-impairments-user-profiles/christopher-user-with-rheumatoid-arthritis",
        de: "https://digitalservicebund.usercontent.opencode.de/accessibility/barrierefreiheits-personas/personas/christopher/",
      },
      instructions: [
        "chrisInstructionColorPerception",
        "chrisInstructionKeyboardNavigation",
        { key: "chrisInstructionCursorVisibility", type: "info" },
      ],
    },
    {
      name: "ashleigh",
      title: "ashleighTitle",
      description: "ashleighDescription",
      files: { css: true, js: false },
      learnMoreLink: {
        en: "https://www.gov.uk/government/publications/understanding-disabilities-and-impairments-user-profiles/ashleigh-partially-sighted-screenreader-user",
        de: "https://digitalservicebund.usercontent.opencode.de/accessibility/barrierefreiheits-personas/personas/ashleigh/",
      },
      instructions: [
        "ashleighInstructionBlur",
        "ashleighInstructionScreenReader",
        operatingSystem === "mac"
          ? "ashleighInstructionScreenReaderMac"
          : "ashleighInstructionScreenReaderWindows",
      ],
    },
    {
      name: "saleem",
      title: "saleemTitle",
      description: "saleemDescription",
      files: { css: false, js: false },
      learnMoreLink: {
        en: "https://www.gov.uk/government/publications/understanding-disabilities-and-impairments-user-profiles/saleem-profoundly-deaf-user",
      },
      instructions: ["saleemInstructionMute", "saleemInstructionVideo"],
    },
  ],
};

const isChromeAvailable =
  typeof chrome !== "undefined" &&
  chrome.tabs &&
  chrome.tabs.query &&
  chrome.i18n &&
  chrome.i18n.getMessage &&
  chrome.storage;

const userLang = isChromeAvailable ? chrome.i18n.getUILanguage() : "en";
document.documentElement.lang = userLang;

const translateContent = function (obj, substitutions) {
  const getMessage = (key) =>
    isChromeAvailable ? chrome.i18n.getMessage(key, substitutions) : key;

  if (typeof obj === "string") {
    return getMessage(obj) || obj;
  } else if (Array.isArray(obj)) {
    return obj.map((item) => translateContent(item));
  } else if (typeof obj === "object" && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = translateContent(value);
    }
    return result;
  }
  return obj;
};

const resolveLearnMoreLink = function (links, lang) {
  if (!links) return "";
  return links[lang] || links[lang.split("-")[0]] || links.en || "";
};

const createPersonaElement = function (persona) {
  const personaCard = document.createElement("article");
  personaCard.className = "kern-card persona";
  personaCard.setAttribute("data-persona-name", persona.name);

  const simulateBtn = document.createElement("button");
  simulateBtn.className = "select-persona kern-btn kern-btn--primary";
  simulateBtn.setAttribute("data-persona-name", persona.name);
  if (persona.files.css) {
    simulateBtn.setAttribute(
      "data-css",
      `personas/${persona.name}/${persona.name}.css`,
    );
  }
  if (persona.files.js) {
    simulateBtn.setAttribute(
      "data-js",
      `personas/${persona.name}/${persona.name}.js`,
    );
  }
  const simulateBtnLabel = document.createElement("span");
  simulateBtnLabel.className = "kern-label";
  simulateBtnLabel.textContent = translateContent("simulateButton");
  simulateBtn.appendChild(simulateBtnLabel);

  let warningElement = "";
  if (persona.warning) {
    warningElement = `
      <div class="warning kern-alert kern-alert--warning" role="alert">
        <div class="kern-alert__header">
          <span class="kern-icon kern-icon--warning" aria-hidden="true"></span>
          <span class="kern-title kern-title--small">${translateContent(persona.warning)}</span>
        </div>
      </div>`;
  }

  personaCard.innerHTML = `
    <div class="kern-card__container">
      <div class="flex gap-16 w-full">
        <div class="shrink-0">
          <img src="personas/${persona.name}/${persona.name}.png" alt="${persona.title} persona image" aria-hidden="true"/>
        </div>
        <div class="flex-1 min-w-0 flex flex-col gap-4">
          <header class="kern-card__header">
            <hgroup>
              <h2 class="kern-title">${persona.title}</h2>
            </hgroup>
          </header>
          <section class="kern-card__body">
            <div>
              <p class="persona-description kern-subline">${persona.description}</p>
            </div>
            ${warningElement}
            <div
              class="instructions hidden"
              data-persona-name="${persona.name}"
            >
              ${persona.instructions
                .map((instruction) => {
                  if (typeof instruction === "string") {
                    return `<p class="kern-body">${instruction}</p>`;
                  }
                  return `
                    <div class="kern-alert kern-alert--${instruction.type} mt-16" role="note">
                      <div class="kern-alert__header">
                        <span class="kern-icon kern-icon--${instruction.type}" aria-hidden="true"></span>
                        <span class="kern-title kern-title--small">${instruction.key}</span>
                      </div>
                    </div>`;
                })
                .join("")}
            </div>
          </section>
          <div id="persona-actions-${persona.name}" class="flex flex-col gap-8 pt-16 items-start">
            <button class="persona-reset kern-btn kern-btn--primary hidden" data-persona-name="${persona.name}">
              <span class="kern-label">${translateContent("resetButton")}</span>
            </button>
            <a href="${resolveLearnMoreLink(persona.learnMoreLink, userLang)}" class="kern-link learn-more" target="_blank" rel="noopener noreferrer">
              <span class="kern-icon kern-icon--open-in-new kern-icon--default" aria-hidden="true"></span>
              <span>${translateContent("learnMore", [persona.title])}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  const actionsContainer = personaCard.querySelector(
    `#persona-actions-${persona.name}`,
  );
  actionsContainer.insertBefore(simulateBtn, actionsContainer.firstChild);

  return personaCard;
};

const buildPopup = function () {
  const personaList = document.getElementById("persona-list");

  ["popup-title", "popup-introduction"].forEach((elementId) => {
    const element = document.getElementById(elementId);
    element.textContent = translateContent(element.dataset.i18n);
  });

  const translatedContent = translateContent(popupContent);

  translatedContent.personas.forEach((persona) => {
    personaList.appendChild(createPersonaElement(persona));
  });
};

// Build the popup when the script is run
buildPopup();

// Function to re-format the popup when a persona is selected
const formatPopup = function (personaName = null) {
  const updateElements = function (selectedPersonaName) {
    if (!selectedPersonaName) return;

    // Hide the activation button for the selected persona
    const activationButton = document.querySelector(
      `.select-persona[data-persona-name="${selectedPersonaName}"]`,
    );
    if (activationButton) activationButton.classList.add("hidden");

    // Show the instructions for the selected persona
    const instructionsElement = document.querySelector(
      `.instructions[data-persona-name="${selectedPersonaName}"]`,
    );
    if (instructionsElement) instructionsElement.classList.remove("hidden");

    // Hide the warning if there is one (only for Pawel atm)
    const personaElement = document.querySelector(
      `.persona[data-persona-name="${selectedPersonaName}"]`,
    );
    if (personaElement) {
      const warningElement = personaElement.querySelector(".warning");
      if (warningElement) warningElement.classList.add("hidden");
    }

    // Hide all non-selected personas
    document.querySelectorAll(".persona").forEach((persona) => {
      if (persona.getAttribute("data-persona-name") !== selectedPersonaName) {
        persona.classList.add("hidden");
      }
    });

    // Show the in-card reset button for the selected persona
    const inCardResetButton = document.querySelector(
      `.persona-reset[data-persona-name="${selectedPersonaName}"]`,
    );
    if (inCardResetButton) inCardResetButton.classList.remove("hidden");

    // Hide the general introduction in the header
    const popupIntroduction = document.getElementById("popup-introduction");
    if (popupIntroduction) popupIntroduction.classList.add("hidden");
  };

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
};

// Attempt to format the popup based on local storage when it is opened
formatPopup();

// Start simulation when a simulate button is clicked
document.querySelectorAll(".select-persona").forEach((button) => {
  button.addEventListener("click", function () {
    // Get the CSS and JS file names from the data attributes
    const cssFile = this.getAttribute("data-css");
    const jsFile = this.getAttribute("data-js") || null;
    const personaName = this.getAttribute("data-persona-name");

    // Format the persona list
    formatPopup(personaName);

    // Start simulation
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

// Stop the simulation if reset button is clicked
document.querySelectorAll(".persona-reset").forEach((button) => {
  button.addEventListener("click", function () {
    if (isChromeAvailable) {
      chrome.runtime.sendMessage({ action: "resetSimulation" });
    }
  });
});

// Close popup if requested in background.js
if (isChromeAvailable) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "closePopup") {
      window.close();
    }
  });
}
