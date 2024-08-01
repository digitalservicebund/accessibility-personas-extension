// adapted from https://github.com/alphagov/accessibility-personas

let shakeSpeed = 40;
let shakePositionInterval = 250;

let cursor,
  posInterval,
  cursorPosX,
  cursorPosY,
  viewportPosX,
  viewportPosY,
  offsetX,
  offsetY,
  css,
  clickedElement;

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function mousemoveHandler(e) {
  // Save the position of the fake cursor
  cursorPosX = e.pageX + offsetX;
  cursorPosY = e.pageY + offsetY;

  // Save the viewport position of the fake cursor (position without scroll)
  // We use this later to get the clicked element
  viewportPosX = e.clientX + offsetX;
  viewportPosY = e.clientY + offsetY;

  cursor.style.left = cursorPosX + "px";
  cursor.style.top = cursorPosY + "px";
}

function elementClickHandler(e) {
  const fakeClickedElement = document.elementFromPoint(
    viewportPosX,
    viewportPosY
  );

  // If the fake cursor and invisible default cursor are over the same element,
  // do nothing and reset the clicked element to prevent double clicks.
  if (e.target === fakeClickedElement) {
    return;
  }

  // If the fake cursor and invisible default cursor are over different elements,
  // trigger a click on the element that the fake cursor would click.
  e.preventDefault();
  if (fakeClickedElement) {
    fakeClickedElement.click();
  }
}

function setOffset() {
  offsetX = randomInt(-shakeSpeed, shakeSpeed);
  offsetY = randomInt(-shakeSpeed, shakeSpeed);
}

function addStyles(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

// Remove hover effects from all elements because these
// would give away the invisible default cursor position
function removeHoverEffects() {
  const hoverStyles = `
    *:hover, *:hover::before, *:hover::after {
      cursor: none !important;
      text-decoration: none !important;
      outline: none !important;
    }
  `;
  addStyles(hoverStyles);
}

(function () {
  "use strict";

  removeHoverEffects();

  addStyles("body {cursor: none !important;}");
  addStyles(
    "#fakeCursor {background-color: black; opacity: 0.8; border-radius: 50%;}"
  );
  addStyles(
    "#fakeCursor {position: absolute !important;z-index: 9999999 !important;width: 21px;height: 21px;pointer-events: none;background-repeat: no-repeat;transition: left 0.05s, top 0.05s;}"
  );

  cursor = document.createElement("div");

  cursor.setAttribute("id", "fakeCursor");

  document.body.appendChild(cursor);

  document.addEventListener("mousemove", mousemoveHandler);
  document.addEventListener("click", elementClickHandler);

  posInterval = setInterval(setOffset, shakePositionInterval);

  // addStyles("body {filter: blur(.1em) brightness(120%);}"); // Add blur and brightness to simulate vision impairment
})();
