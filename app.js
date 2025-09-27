// 👇 Replace with your actual API key from TMDB dashboard
const API_KEY = "6c2a6dcb1f23a4567e9d12345abcdef6";  

const APIURL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const IMGPATH = "https://image.tmdb.org/t/p/w500";
const SEARCHAPI = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const movieBox = document.querySelector("#movie-box");

// Fetch movies
const getMovies = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    showMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

// Display movies
const showMovies = (movies) => {
  movieBox.innerHTML = "";

  if (!movies || movies.length === 0) {
    movieBox.innerHTML = `<h2>No results found ❌</h2>`;
    return;
  }

  movies.forEach((movie) => {
    const imagePath = movie.poster_path
      ? IMGPATH + movie.poster_path
      : "img/image-missing.png";

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <img src="${imagePath}" alt="${movie.title}">
      <div class="movie-info">
        <h2>${movie.title}</h2>
        <p>${movie.overview || "No overview available."}</p>
        <span class="rating">⭐ ${movie.vote_average}</span>
      </div>
    `;

    movieBox.appendChild(movieCard);
  });
};

// Initial load
getMovies(APIURL);

// Search movies
document.querySelector("#search").addEventListener("keyup", (e) => {
  const searchValue = e.target.value.trim();

  if (searchValue) {
    getMovies(SEARCHAPI + searchValue);
  } else {
    getMovies(APIURL);
  }
});
