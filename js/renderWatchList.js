import { renderFilmCardHTML } from "./renderFilmCard.js"
import { showMessage } from "./showMessage.js"

const filmContainerEl = document.getElementById("film-container")

function renderWatchList() {
  // Retrieve the watchlist from localStorage, or use an empty array if it doesn't exist
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

  if (watchlist.length === 0) {
    showMessage(`Your watchlist is empty. Add some films to get started!`)
  } else {
    // Generate the HTML for the watchlist and render it in the container
    const watchlistHTML = watchlist
      .map(film => renderFilmCardHTML(film, "remove"))
      .join("")
    filmContainerEl.innerHTML = watchlistHTML
  }
}

function handleRemoveFilm(e) {
  // Identify the clicked button and its related elements
  const button = e.target.closest(".watchlist-btn")
  const filmCard = button.closest(".film-card")
  const filmID = button.dataset.id

  // Ensure the button is valid and its action is "remove"
  if (!button || button.dataset.action !== "remove") return

  // Retrieve the current watchlist from localStorage
  let watchlist = JSON.parse( localStorage.getItem("watchlist") ) || []
  
  // Filter out the film with the matching ID and update localStorage
  watchlist = watchlist.filter( film => film.imdbID !== filmID )
  localStorage.setItem("watchlist", JSON.stringify( watchlist ))
  
  // Remove the film card from the DOM
  filmCard.remove()
  
  // Check if the container is now empty and show a message if true
  if (filmContainerEl.children.length === 0) {
    showMessage("Your watchlist is empty. Add some films to get started!")
  }
}


document.addEventListener("DOMContentLoaded", renderWatchList)
filmContainerEl.addEventListener("click", handleRemoveFilm)
