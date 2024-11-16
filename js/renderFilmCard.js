import { minusIcon, plusIcon } from "./icons.js"

function getButtonConfig(buttonState) {
  const config = {
    add: {
      icon: plusIcon,
      label: "Add to Watchlist",
      action: "add",
      labelBtn: "Watchlist"
    },
    remove: {
      icon: minusIcon,
      label: "Remove from Watchlist",
      action: "remove",
      labelBtn: "Remove"
    }
  }

  // Returns the configuration corresponding to the state or the default for ‘add’
  return config[buttonState] || config.add
}

// Generates the HTML for a film card based on the film's details and button state.
export function renderFilmCardHTML(film, buttonState = "add") {
  const { Poster, Title, Year, imdbRating, Runtime, Genre, Plot, imdbID } = film
  const { icon, label, action, labelBtn } = getButtonConfig(buttonState)

  return `
    <article class="film-card">
      <figure class="film-poster">
        <img src="${Poster}" alt="Poster of ${Title}">
      </figure>
      
      <section class="film-details">
        <header class="film-header flex">
          <h3 class="film-name">${Title} ${Year}</h3>
          <p>⭐ <span class="film-rating">${imdbRating}</span></p>
        </header>
          
        <div class="film-meta flex">
          <p class="film-duration">${Runtime}</p>
          <p class="film-genre">${Genre}</p>
          <button 
            type="button"
            aria-label="${label}"
            class="watchlist-btn flex"
            data-id="${imdbID}" data-action="${action}">
            ${icon} ${labelBtn}
          </button>
        </div>
        
        <p class="film-plot">${Plot}</p>
      </section>
    </article>`
}
