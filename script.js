// http://www.omdbapi.com/?i=tt3896198&apikey=f38d00be

const searchContainer = document.querySelector(".search-container");
const movieSearchBar = document.querySelector("#movie-search-bar");
const searchList = document.querySelector(".search-list");
const movieDetailContainer = document.querySelector(".result-grid");
const favouritesContainer = document.querySelector(".favourites-container");
const linkFavourites = document.querySelector("#favourites-link");
const favIcon = document.querySelector(".favouritesIcon");
let movieWishlists = [];

/**
 * Displays the search list
 * @param {movie data to be displayed} movieData
 */
function displayMovies(movieData) {
  searchList.innerHTML = "";
  movieData.forEach((movie) => {
    const html = `
    <div class="search-list-item" data-id="${movie.imdbID}">
      <div class="search-item-thumbnail">
        <img src="${
          movie.Poster === "N/A" ? "image_not_found.png" : movie.Poster
        }" />
      </div>
      <div class="search-item-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
      <div class="favouritesIcon">
        <i class="bi bi-bookmark-heart"></i>
      </div>
    </div>`;
    searchList.insertAdjacentHTML("beforeend", html);
  });
  loadMovieDetails(".search-list-item");
}

/**
 * Fetch the movie list related to serach term
 * @param {string from the input} searchTerm
 */
async function loadMovies(searchTerm) {
  const url = `http://www.omdbapi.com/?s=${searchTerm}&apikey=f38d00be`;
  const res = await fetch(`${url}`);
  const data = await res.json();
  if (data.Response == "True") {
    displayMovies(data.Search);
  }
}

/**
 * Gets the value from input bar and pass the string to loadMovies
 */
function findMovies() {
  let searchTerm = movieSearchBar.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hidden");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hidden");
  }
}
// Runs when key is pressed
document.addEventListener("keyup", findMovies);

/**
 * Remove the movie object form the movieWishliists array
 * @param {uniqueID the find the object} dataid
 */
function removeMovie(dataid) {
  let index = movieWishlists.findIndex((item) => item.imdbID === dataid);
  movieWishlists.splice(index, 1);
}

/**
 * Toggle the favourite button and adds the clicked object to
 * movieWishlists array
 * @param {DOM element} ele
 * @param {movie details object} movieDetail
 */
function toggleWishlist(ele, movieDetail) {
  if (ele.className === "bi bi-bookmark-heart") {
    ele.classList.remove("bi-bookmark-heart");
    ele.classList.add("bi-bookmark-heart-fill");
    let fav = {
      title: movieDetail.Title,
      poster: movieDetail.Poster,
      imdbID: movieDetail.imdbID,
      isFavourite: true,
    };
    movieWishlists.push(fav);
    addToFavourites();
  } else {
    ele.classList.remove("bi-bookmark-heart-fill");
    ele.classList.add("bi-bookmark-heart");
    removeMovie(movieDetail.imdbID);
    addToFavourites();
  }
}

/**
 * Gets the detailed movie data from the api and adds a click event
 * to display movie details
 * @param {class of DOM element on which we have to handle click} elementClass
 */
function loadMovieDetails(elementClass) {
  const moviesList = document.querySelectorAll(elementClass);
  moviesList.forEach((item) => {
    item.addEventListener("click", async function (e) {
      const result = await fetch(
        `http://www.omdbapi.com/?i=${item.dataset.id}&apikey=f38d00be`
      );
      const movieDetail = await result.json();
      if (
        e.target.className === "bi bi-bookmark-heart-fill" ||
        e.target.className === "bi bi-bookmark-heart"
      ) {
        toggleWishlist(e.target, movieDetail);
        return;
      }
      movieSearchBar.value = "";
      displayMovieDetails(movieDetail);
    });
  });
}
/**
 * Displays the detailed movie data
 * @param {Ddetailed movie object} detail
 */
function displayMovieDetails(detail) {
  searchContainer.classList.add("hidden");
  favouritesContainer.classList.add("hidden");
  movieDetailContainer.classList.remove("hidden");
  movieDetailContainer.innerHTML = `
        <div class="movie-poster">
            <img src="${
              detail.Poster === "N/A" ? "image_not_found.png" : detail.Poster
            }" alt="movie poster" />
            </div>
            <div class="movie-info">
            <h3 class="movie-title">${detail.Title}</h3>
            <ul class="movie-misc-info">
            <li class="year">Year: ${detail.Year}</li>
                <li class="rated">Ratings: ${detail.Rated}</li>
                <li class="released">Released: ${detail.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b>${detail.Genre}</p>
            <p class="writer">
                <b>Writer:</b>${detail.Writer}
                </p>
            <p class="actors">
            <b>Actors: </b>${detail.Actors}
            </p>
            <p class="plot">
                <b>Plot:</b>${detail.Plot}
                </p>
            <p class="language"><b>Language:</b> ${detail.Language}</p>
            `;
}

/**
 * Add the clicked movie to favourites in th DOM
 */
function addToFavourites() {
  favouritesContainer.innerHTML = "";
  movieWishlists.forEach(function (item) {
    const html = `<div class="fav-movie" data-id="${item.imdbID}">
    <div class="fav-movie-image">
      <img src="${
        item.poster === "N/A" ? "image_not_found.png" : item.poster
      }" alt="movie poster" />
      </div>
    <div class="fav-movie-info">
    <div class="fav-movie-title">
        <h3>${item.title}</h3>
      </div>
      <div class="fav-movie-icon">
        <i class="bi bi-bookmark-heart-fill"></i>
      </div>
    </div>
  </div>`;
    favouritesContainer.insertAdjacentHTML("beforeend", html);
  });
  loadMovieDetails(".fav-movie");
}

/**
 * Displays the favourites list
 */
function displayFavourites() {
  favouritesContainer.classList.remove("hidden");
  searchContainer.classList.add("hidden");
  movieDetailContainer.classList.add("hidden");
}
// click event on favourites in navigation bar
linkFavourites.addEventListener("click", displayFavourites);
