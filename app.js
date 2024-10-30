let allCountries = [];
let favorites = []; 

async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,capital,population,area,languages,tld");
    allCountries = await response.json();
    displayCountries(allCountries);
    displayFavorites();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayCountries(countries) {
  const countryList = document.getElementById('countryList');
  countryList.innerHTML = '';
  countries.forEach(country => {
    const countryCard = document.createElement('div');
    countryCard.classList.add('country-card');
    const isFavorited = favorites.some(item => item.name === country.name.common);
    countryCard.innerHTML = `
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
      <h3>${country.name.common}</h3>
      <button class="like-button ${isFavorited ? 'liked' : ''}" onclick="toggleFavorites('${country.name.common}', '${country.flags.png}', this)">❤️</button>
      <button class="view-button" onclick="showCountryDetails('${country.name.common}')">View Details</button>
    `;
    countryList.appendChild(countryCard);
  });
}

function searchCountry() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const filteredCountries = allCountries.filter(country =>
    country.name.common.toLowerCase().includes(searchValue)
  );
  displayCountries(filteredCountries);
}

function showCountryDetails(countryName) {
  const country = allCountries.find(c => c.name.common === countryName);
  const countryDetails = document.getElementById('countryDetails');
  countryDetails.innerHTML = `
    <div class="details-content">
      <h2>${country.name.common}</h2>
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
      <p><strong>Population:</strong> ${country.population}</p>
      <p><strong>Area:</strong> ${country.area} km²</p>
      <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
      <button onclick="hideCountryDetails()">Close</button>
    </div>
  `;
  countryDetails.style.display = 'block';
}

function hideCountryDetails() {
  const countryDetails = document.getElementById('countryDetails');
  countryDetails.style.display = 'none';
}

function filterCountries() {
  const regionFilter = document.getElementById('regionFilter').value;
  const languageFilter = document.getElementById('languageFilter').value;

  const filteredCountries = allCountries.filter(country => {
    const regionMatch = regionFilter ? country.region === regionFilter : true;
    const languageMatch = languageFilter ? country.languages && Object.values(country.languages).includes(languageFilter) : true;
    return regionMatch && languageMatch;
  });

  displayCountries(filteredCountries);
}

function toggleFavorites(countryName, flagUrl, button) {
  const countryIndex = favorites.findIndex(item => item.name === countryName);
  if (countryIndex > -1) {
    favorites.splice(countryIndex, 1);
    button.classList.remove('liked'); 
  } else {
    favorites.push({ name: countryName, flag: flagUrl });
    button.classList.add('liked'); s
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
}


function displayFavorites() {
    const favoritesList = document.getElementById('favorites');
    favoritesList.innerHTML = ''; 
  
    if (favorites.length > 0) {
      favoritesList.innerHTML = '<h3>Favorites</h3>'; 
      favorites.forEach(item => {
        const favItem = document.createElement('div');
        favItem.className = 'fav-item';
        favItem.style.display = 'flex'; 
        favItem.style.alignItems = 'center'; 
        favItem.innerHTML = `
          <img src="${item.flag}" alt="Flag of ${item.name}" style="width: 50px; height: auto; margin-right: 10px;">
          <p style="margin: 0; flex-grow: 1;">${item.name}</p> <!-- Remove margin and allow text to grow -->
          <button class="remove-button" onclick="removeFavorite('${item.name}')">Remove</button>
        `;
        favoritesList.appendChild(favItem);
      });
      favoritesList.style.display = 'block'; 
    } else {
      favoritesList.style.display = 'none';
    }
  }
  

function removeFavorite(countryName) {
  favorites = favorites.filter(item => item.name !== countryName);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
}

fetchCountries();
