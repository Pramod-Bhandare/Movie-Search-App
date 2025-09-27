
const API_KEY = {"Title":"Guardians of the Galaxy Vol. 2","Year":"2017","Rated":"PG-13","Released":"05 May 2017","Runtime":"136 min","Genre":"Action, Adventure, Comedy","Director":"James Gunn","Writer":"James Gunn, Dan Abnett, Andy Lanning","Actors":"Chris Pratt, Zoe Saldaña, Dave Bautista","Plot":"The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father, the ambitious celestial being Ego.","Language":"English","Country":"United States","Awards":"Nominated for 1 Oscar. 15 wins & 60 nominations total","Poster":"https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"7.6/10"},{"Source":"Rotten Tomatoes","Value":"85%"},{"Source":"Metacritic","Value":"67/100"}],"Metascore":"67","imdbRating":"7.6","imdbVotes":"806,353","imdbID":"tt3896198","Type":"movie","DVD":"N/A","BoxOffice":"$389,813,101","Production":"N/A","Website":"N/A","Response":"True"};

const APIURL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const IMGPATH = "https://image.tmdb.org/t/p/w500";
const SEARCHAPI = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const movieBox = document.querySelector("#movie-box");

// Fetch movies
const getMovies = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  showMovies(data.results);
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
