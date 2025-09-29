const API_KEY = "6c2a6dcb1f23a4567e9d12345abcdef6";

let currentPage = 1;
const APIURL = (page = 1) =>
  `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
const TRENDINGAPI = (page = 1) =>
  `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${page}`;
const IMGPATH = "https://image.tmdb.org/t/p/w500";
const SEARCHAPI = (query, page = 1) =>
  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;

const movieBox = document.querySelector("#movie-box");
const loader = document.querySelector("#loader");
const modal = document.querySelector("#modal");

let currentAPI = APIURL; // To track which API is being used (popular, trending, search)

// Loader
const showLoader = () => (loader.style.display = "block");
const hideLoader = () => (loader.style.display = "none");

// Fetch Movies
const getMovies = async (url) => {
  try {
    showLoader();
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch movies");
    const data = await response.json();
    showMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
    movieBox.innerHTML = `<h2 class="error">⚠️ Something went wrong. Please try again later.</h2>`;
  } finally {
    hideLoader();
  }
};

// Show Movies
const showMovies = (movies) => {
  movieBox.innerHTML = "";

  if (!movies || movies.length === 0) {
    movieBox.innerHTML = `<h2 class="no-results">No results found ❌</h2>`;
    return;
  }

  movies.forEach((movie) => {
    const imagePath = movie.poster_path
      ? IMGPATH + movie.poster_path
      : "img/image-missing.png";

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const ratingClass =
      movie.vote_average >= 7 ? "green" : movie.vote_average >= 5 ? "orange" : "red";

    movieCard.innerHTML = `
      <img src="${imagePath}" alt="${movie.title}">
      <div class="movie-info">
        <h2>${movie.title}</h2>
        <p><strong>Release:</strong> ${movie.release_date || "N/A"}</p>
        <p><strong>Lang:</strong> ${movie.original_language.toUpperCase()}</p>
        <p>${movie.overview ? movie.overview.slice(0, 120) + "..." : "No overview available."}</p>
        <span class="rating ${ratingClass}">⭐ ${movie.vote_average}</span>
      </div>
    `;

    movieCard.addEventListener("click", () => showMovieDetails(movie));
    movieBox.appendChild(movieCard);
  });
};

// Show Movie Details in Modal
const showMovieDetails = (movie) => {
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${movie.title}</h2>
      <img src="${movie.poster_path ? IMGPATH + movie.poster_path : "img/image-missing.png"}" alt="${movie.title}">
      <p><strong>Release:</strong> ${movie.release_date || "N/A"}</p>
      <p><strong>Language:</strong> ${movie.original_language.toUpperCase()}</p>
      <p><strong>Rating:</strong> ⭐ ${movie.vote_average}</p>
      <p>${movie.overview || "No overview available."}</p>
    </div>
  `;

  modal.querySelector(".close").addEventListener("click", () => {
    modal.style.display = "none";
  });
};

// Search movies
document.querySelector("#search").addEventListener("keyup", (e) => {
  const searchValue = e.target.value.trim();
  currentPage = 1;

  if (searchValue) {
    currentAPI = (page) => SEARCHAPI(searchValue, page);
    getMovies(currentAPI(currentPage));
  } else {
    currentAPI = APIURL;
    getMovies(currentAPI(currentPage));
  }
});

// Trending button
document.querySelector("#trending-btn").addEventListener("click", () => {
  currentPage = 1;
  currentAPI = TRENDINGAPI;
  getMovies(currentAPI(currentPage));
});

// Pagination
document.querySelector("#next-btn").addEventListener("click", () => {
  currentPage++;
  getMovies(currentAPI(currentPage));
});

document.querySelector("#prev-btn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getMovies(currentAPI(currentPage));
  }
});

// Initial load
getMovies(APIURL(currentPage));
