const heading = document.getElementById('heading-top');
const navLink = document.getElementById('nav-link');
const searchDiv = document.getElementById('search-form');
const searchBtn = document.getElementById('search-btn');
const result = document.getElementById('result');
const searchInput = document.getElementById('search-input');
const imgContainer = document.getElementById('img-container');
const movieTitle = document.getElementById('movie-title');
const movieRating = document.getElementById('movie-rating');
const movieRuntime = document.getElementById('movie-runtime');
const movieGenre = document.getElementById('movie-genres');
const movieDesc = document.getElementById('description-container');
const moviesDiv = document.getElementById('cards-container');
const movieCard = document.getElementById('movie-card');
const welcome = document.getElementById('welcome');
const welcomeTag = document.getElementById('welcome-tag');
const refresh = document.getElementById('refresh-btn');
const searchObject = [];
const watchlistObject = [];
async function handleSearch(e) {
	e.preventDefault();
	searchObject.length = 0;
	if (searchInput.value != '') {
		moviesDiv.innerHTML = '';
	}
	const res = await fetch(
		`https://www.omdbapi.com/?apikey=3f3c26a6&s=${e.target[0].value}&type=movie&page=1`
	);
	const data = await res.json();
	for (i in data.Search) {
		const movieObj = {
			imageURL: data.Search[i].Poster,
			title: data.Search[i].Title,
			id: data.Search[i].imdbID,
		};
		searchObject.push(movieObj);
		searchObject[i] = movieObj;
		movieObj.id != undefined
			? ((moviesDiv.style.display = 'flex'),
			  moviesDiv.append(await getMoreData(searchObject[i])),
			  //   (imgContainer.style.backgroundImage = `url(${movieObj.imageURL})`),
			  (welcome.style.display = 'none'))
			: (welcome.innerHTML = `<p>Couldn't find a movie with that name... </p>
				<p>error: ${data.Error}</p>
				`),
			(welcome.style.display = 'flex');
	}
}
function renderPage() {
	document.getElementById('cards-container').innerHTML = '';
	if (navLink.innerText == 'My Watchlist') {
		refresh.style.display = 'block';
		welcome.style.display = 'none';
		getWatchlistFromLocalStorage();

		heading.innerText = 'My Watchlist';
		navLink.innerText = 'Find a film';
		searchDiv.style.display = 'none';
	} else if (navLink.innerText == 'Find a film') {
		refresh.style.display = 'none';
		welcome.style.display = 'flex';
		heading.innerText = 'Find a film';
		navLink.innerText = 'My Watchlist';
		searchDiv.style.display = 'flex';
	}
}

function getWatchlistFromLocalStorage() {
	moviesDiv.innerHTML = '';

	var values = [],
		keys = Object.keys(localStorage),
		i = keys.length;

	while (i--) {
		values.push(localStorage.getItem(keys[i]));
	}
	const currentWatchlistString = values;
	var isWatchlistEmpty = currentWatchlistString.length > 0 ? false : true;
	if (isWatchlistEmpty) {
		welcome.style.display = 'flex';
		refresh.style.display = 'block';
		moviesDiv.innerHTML = `<div id="welcome" class="icon-container">
			<p id="welcome-tag">Your watchlist is empty 😔</p>
			<p id="welcome-tag">Find a new film and add it to your watchlist!</p>
			
			<button id="nav-link" onClick="renderPage()">Find a movie</button>
		</div>`;
	}
	for (i in currentWatchlistString) {
		const currentWatchlist = JSON.parse(currentWatchlistString[i]);
		console.log(currentWatchlist);
		renderWatchlist(currentWatchlist, i);
	}
}

function renderWatchlist(obj, i) {
	let newCard = document.createElement('div');
	newCard.id = `movie-card-${i}`;
	moviesDiv?.append(newCard);
	newCard.innerHTML = `
	<div id="img-container" class=${JSON.stringify(
		obj.title
	)} style="background-image: url('${obj.imageURL}')"></div>
	<div id="info-container">
		<div id="title-container">
			<h3 id="movie-title">${obj.title}</h3>
			<i class="fa-solid fa-star"></i>
			<p id="movie-rating">${obj.rated}1</p>
		</div>
		<div id="meta-container">
			<p id="movie-runtime">${obj.runtime}</p>
			<p id="movie-genres">${obj.genre}</p>
			<button id="add-to-watchlist-btn-${i}" onClick="editWatchlist(${i})" style='${
		obj.id ? 'background-color: #ffffff16' : 'background-color: #ffffff00'
	}'>
			<i id="plus-btn-${i}" class='${
		obj.id ? 'fa-solid fa-circle-minus' : 'fa-solid fa-circle-plus'
	}'></i>
				
				<p>Watchlist</p>
			</button>
		</div>
		<div id="description-container">
	<p>${obj.desc}</p>
		</div>
	</div>
	`;

	// console.log(currentWatchlistString);
}
navLink.addEventListener('click', renderPage);
refresh.addEventListener('click', getWatchlistFromLocalStorage);

async function getMoreData(obj) {
	const get = await fetch(
		`https://www.omdbapi.com/?apikey=3f3c26a6&t=${obj.title}&type=movie`
	);
	const info = await get.json();
	obj.runtime = info.Runtime;
	obj.rated = info.imdbRating;
	obj.genre = info.Genre;
	obj.desc = info.Plot;
	// console.log(info);
	searchObject[i] = obj;

	obj.rated > 4 && obj.desc.length > 10
		? renderCards(searchObject[i], i)
		: console.log('no thankyou :)');
}
searchDiv.addEventListener('submit', handleSearch);

function renderCards(obj, i) {
	let newCard = document.createElement('div');
	newCard.id = `movie-card-${i}`;
	moviesDiv.append(newCard);
	newCard.innerHTML = `
	<div id="img-container" class=${JSON.stringify(
		obj.title
	)} style="background-image: url('${obj.imageURL}')"></div>
	<div id="info-container">
		<div id="title-container">
			<h3 id="movie-title">${obj.title}</h3>
			<i class="fa-solid fa-star"></i>
			<p id="movie-rating">${obj.rated}1</p>
		</div>
		<div id="meta-container">
			<p id="movie-runtime">${obj.runtime}</p>
			<p id="movie-genres">${obj.genre}</p>
			<button id="add-to-watchlist-btn-${i}" onClick="editWatchlist(${i})" style='${
		localStorage.getItem(obj.id)
			? 'background-color: #ffffff16'
			: 'background-color: #ffffff00'
	}'>
			<i id="plus-btn-${i}" class='${
		localStorage.getItem(obj.id)
			? 'fa-solid fa-circle-minus'
			: 'fa-solid fa-circle-plus'
	}'></i>
				
				<p>Watchlist</p>
			</button>
		</div>
		<div id="description-container">
	<p>${obj.desc}</p>
		</div>
	</div>
	`;

	return;
	// imgContainer.style.backgroundImage = `url(${obj.imageURL})`;
}

async function editWatchlist(key, id) {
	const plusBtn = document.getElementById(`plus-btn-${key}`);
	const addToWatchlistBtn = document.getElementById(
		`add-to-watchlist-btn-${key}`
	);

	plusBtn.classList == `fa-solid fa-circle-plus` &&
	!localStorage.getItem(`${searchObject[key].id}`)
		? (localStorage.setItem(
				`${searchObject[key].id}`,
				JSON.stringify(searchObject[key])
		  ),
		  plusBtn.classList.replace('fa-circle-plus', 'fa-circle-minus'),
		  (addToWatchlistBtn.style.backgroundColor = '#ffffff16'))
		: (localStorage.removeItem(`${searchObject[key].id}`),
		  plusBtn.classList.replace('fa-circle-minus', 'fa-circle-plus'),
		  (addToWatchlistBtn.style.backgroundColor = '#ffffff00'));
}
