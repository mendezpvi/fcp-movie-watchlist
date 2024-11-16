import { showMessage } from "./showMessage.js";
import { minusIcon, plusIcon } from "./icons.js"
import { renderFilmCardHTML } from "./renderFilmCard.js"

const filmContainerEl = document.getElementById("film-container")
const searchFormEl = document.getElementById("search-form")


let filmsList = []

// Function to fetch films based on the film name using the OMDB API
async function fetchFilm(filmName) {
  const API_URL = `https://www.omdbapi.com/?s=${filmName}&apikey=4459648f`

  try {
    const res = await fetch(API_URL)
    const data = await res.json()

    if (!res.ok || data.Response === "False") {
      showMessage("Unable to find what you’re looking for. Please try another search.")
      throw new Error(data.Error)
    }

    // If films are found, extract their IMDb IDs
    filmsList = data.Search.map(film => film.imdbID)

    fetchFilmDetails(filmsList)

  } catch (err) {
    console.error(err)
  }
}


// Function to fetch detailed information about films using their IMDb IDs
function fetchFilmDetails(filmIds) {
  filmIds.forEach(async filmId => {
    const API_URL = `https://www.omdbapi.com/?i=${filmId}&apikey=4459648f`
    const res = await fetch(API_URL)
    const filmData = await res.json()

    renderFilms(filmData)
  })
}


// Function to render films inside the container
function renderFilms(filmData) {
  filmContainerEl.innerHTML += renderFilmCardHTML(filmData)
}


// Function to handle click events on the "Add to Watchlist" button
function addToLocalStorage(e) {
  // Check if the click happened on a "watchlist" button
  if (e.target.closest(".watchlist-btn")) {
    const button = e.target.closest(".watchlist-btn")
    const card = button.closest(".film-card")

    // Extract film data from the DOM
    const filmData = {
      Poster: card.querySelector(".film-poster img").src,
      Title: card.querySelector(".film-name").textContent,
      imdbRating: card.querySelector(".film-rating").textContent,
      Runtime: card.querySelector(".film-duration").textContent,
      Genre: card.querySelector(".film-genre").textContent,
      Plot: card.querySelector(".film-plot").textContent,
      imdbID: button.dataset.id,
    }

    // Retrieve the current watchlist from localStorage, or initialize an empty array
    let currentWatchList = JSON.parse(localStorage.getItem("watchlist")) || []

    // Check whether the button is for adding or removing from the watchlist
    if (button.dataset.action === "add") {

      // Add the film if it's not already in the watchlist
      if (!currentWatchList.some(film => film.imdbID === filmData.imdbID)) {
        currentWatchList.push(filmData)
        localStorage.setItem("watchlist", JSON.stringify(currentWatchList))

        // Change the button to "Remove" action
        button.dataset.action = "remove"
        button.innerHTML = `${minusIcon} Remove`
        button.setAttribute("aria-label", "Remove from watchlist")
      }
    } else {
      // Remove the film from the watchlist
      currentWatchList = currentWatchList.filter(film => film.imdbID !== filmData.imdbID)
      localStorage.setItem("watchlist", JSON.stringify(currentWatchList))

      // Change the button to "Add" action
      button.dataset.action = "add"
      button.innerHTML = `${plusIcon} Watchlist`
      button.setAttribute("aria-label", "Add to Watchlist")
    }
  }
}


// Function to handle the search form submission
function handleSearchSubmit(e) {
  e.preventDefault()
  const searchFormData = new FormData(searchFormEl)
  const filmName = searchFormData.get("search")

  // Clear the current film container before performing a new search
  filmContainerEl.innerHTML = ""

  // Perform the film search
  fetchFilm(filmName)
  resetForm()
}


// Function to reset the search form
function resetForm() {
  searchFormEl.reset()
}


// Initialize the app
function initializeApp() {
  showMessage("Start exploring")
  searchFormEl.addEventListener("submit", handleSearchSubmit)
  filmContainerEl.addEventListener('click', addToLocalStorage)
}


document.addEventListener("DOMContentLoaded", initializeApp)
