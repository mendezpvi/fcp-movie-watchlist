import { filmIcon } from "./icons.js"

export function showMessage(msg) {
  const filmContainerEl = document.getElementById("film-container")
  const message = `
    <section class="message-section">
      ${filmIcon}
      <p class="message-text">${msg}</p>
    </section>`

  filmContainerEl.innerHTML = message
}