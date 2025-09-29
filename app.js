const API_KEY = "04c35731a5ee918f014970082a0088b1";
const APIURL = (page = 1) =>
  `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${page}`;
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = (query, page = 1) =>
  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&page=${page}`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

let currentPage = 1;
let currentAPI = APIURL;

async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();

  showMovies(respData.results);
  updatePagination(respData.page, respData.total_pages);
}

function showMovies(movies) {
  main.innerHTML = "";

  if (movies.length === 0) {
    main.innerHTML = `<h2 class="text-white text-center w-full">No Movies Found 😔</h2>`;
    return;
  }

  movies.forEach((movie) => {
    const { poster_path, title, vote_average, overview } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
      <img src="${poster_path ? IMGPATH + poster_path : "https://via.placeholder.com/300x450"}" alt="${title}" />
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>
    `;

    main.appendChild(movieEl);
  });
}


function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}
function updatePagination(page, totalPages) {
  current.innerText = `Page ${page}`;
  prev.disabled = page <= 1;
  next.disabled = page >= totalPages;
}


prev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getMovies(currentAPI(currentPage));
  }
});

next.addEventListener("click", () => {
  currentPage++;
  getMovies(currentAPI(currentPage));
});


search.addEventListener("keyup", (e) => {
  const searchValue = e.target.value.trim();
  if (e.key === "Enter" && searchValue) {
    currentPage = 1;
    currentAPI = (page) => SEARCHAPI(searchValue, page);
    getMovies(currentAPI(currentPage));
  } else if (e.key === "Enter" && searchValue === "") {
    currentPage = 1;
    currentAPI = APIURL;
    getMovies(currentAPI(currentPage));
  }
});

getMovies(APIURL(currentPage));
