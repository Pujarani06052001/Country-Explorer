let currentPage = 1;
const pageSize = 10;
let allCountries = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,capital,population,area,languages,tld");
    allCountries = await response.json();
    displayCountries(allCountries.slice(0, pageSize));
    displayWishlist();
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
    countryCard.innerHTML = `
      <img class='main-img' src="${country.flags.png}" alt="Flag of ${country.name.common}" onclick="showCountryDetails('${country.name.common}')">
      <h3>${country.name.common}</h3>
      <button class="like-button" onclick="toggleWishlist('${country.name.common}', this)">❤️</button>
    `;
    countryList.appendChild(countryCard);
  });

  // Show the "Show more" button if there are more countries to load
  const showMoreBtn = document.getElementById('showMoreBtn');
  showMoreBtn.style.display = currentPage * pageSize < allCountries.length ? 'block' : 'none';
}

function showCountryDetails(countryName) {
  const country = allCountries.find(c => c.name.common === countryName);
  if (country) {
    const detailsPage = document.getElementById('countryDetails');
    detailsPage.innerHTML = `
      <h2>${country.name.common}</h2>
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
      <p><strong>Top Level Domain:</strong> ${country.tld[0]}</p>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
      <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
      <button class='back' onclick="goBack()">Back</button>
    `;
    document.getElementById('mainPage').style.display = 'none';
    detailsPage.style.display = 'block';
  }
}

function goBack() {
  document.getElementById('mainPage').style.display = 'block';
  document.getElementById('countryDetails').style.display = 'none';
}

function toggleWishlist(countryName, button) {
  if (wishlist.includes(countryName)) {
    wishlist = wishlist.filter(name => name !== countryName);
    button.classList.remove('liked');
  } else if (wishlist.length < 5) {
    wishlist.push(countryName);
    button.classList.add('liked');
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  displayWishlist();
}

function displayWishlist() {
  const wishlistList = document.getElementById('wishlist');
  wishlistList.innerHTML = wishlist.length ? '<h3>Wishlist</h3>' : '';
  wishlist.forEach(wished => {
    const country = allCountries.find(c => c.name.common === wished);
    if (country) {
      const wishItem = document.createElement('div');
      wishItem.className = 'wish-item';
      wishItem.innerHTML = `
        <img class='wish-img' src="${country.flags.png}" alt="Flag of ${country.name.common}" class="wishlist-flag">
        <p>${country.name.common} <button class="Remove" onclick="removeWishlist('${wished}')">Remove</button></p>
      `;
      wishlistList.appendChild(wishItem);
    }
  });

  wishlistList.style.display = wishlist.length ? 'block' : 'none';
}

function removeWishlist(countryName) {
  wishlist = wishlist.filter(name => name !== countryName);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  displayWishlist();
}

document.getElementById('searchInput').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const suggestions = allCountries
    .filter(country => country.name.common.toLowerCase().includes(query))
    .slice(0, 5);
  const suggestionsContainer = document.getElementById('searchSuggestions');
  suggestionsContainer.innerHTML = suggestions
    .map(country => `<p class="suggestion-item" onclick="searchCountry('${country.name.common}')">${country.name.common}</p>`)
    .join('');
  const viewAllBtn = `<button onclick="viewAllResults('${query}')">View All</button>`;
  suggestionsContainer.innerHTML += viewAllBtn;
});

// Add this event listener for the search button
document.querySelector('.sBtn').addEventListener('click', function() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const results = allCountries.filter(country => country.name.common.toLowerCase().includes(query));
  displayCountries(results);
  document.getElementById('searchSuggestions').innerHTML = ''; // Clear suggestions when searching
});

function searchCountry(name) {
  const country = allCountries.find(c => c.name.common === name);
  if (country) {
    displayCountries([country]);
    document.getElementById('searchSuggestions').innerHTML = '';
  }
}

function viewAllResults(query) {
  const results = allCountries.filter(country => country.name.common.toLowerCase().includes(query));
  displayCountries(results);
  document.getElementById('searchSuggestions').innerHTML = '';
}

function filterCountries() {
  const language = document.getElementById('languageFilter').value;
  const region = document.getElementById('regionFilter').value;
  let filteredCountries = allCountries;
  if (language) {
    filteredCountries = filteredCountries.filter(country => Object.values(country.languages || {}).includes(language));
  }
  if (region) {
    filteredCountries = filteredCountries.filter(country => country.region === region);
  }
  displayCountries(filteredCountries);
}

document.getElementById('showMoreBtn').addEventListener('click', () => {
  currentPage++;
  const startIndex = (currentPage - 1) * pageSize;
  const newCountries = allCountries.slice(startIndex, startIndex + pageSize);
  displayCountries(newCountries);
});

document.getElementById('languageFilter').addEventListener('change', filterCountries);
document.getElementById('regionFilter').addEventListener('change', filterCountries);

fetchCountries();
