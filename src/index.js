import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
searchField.addEventListener('input', debounce(handleSearchInput, DEBOUNCE_DELAY));

function handleSearchInput(e) {
  if (e.target.value.trim() === '') {
    clearMarkup();
    return;
  }

  fetchCountries(e.target.value.trim())
    .then(data => {
      if (data.length > 10) {
        clearMarkup();
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }

      if (data.length === 1) {
        clearMarkup();
        countryInfo.innerHTML = createMarkupOnOne(data);
        return;
      }

      clearMarkup();
      countryList.innerHTML = createMarkupOnList(data);
    })
    .catch(() => {
      clearMarkup();
      Notify.failure('Oops, there is no country with that name.');
    });
}

function clearMarkup() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

function createMarkupOnOne(data) {
  const { capital, flags, languages, name, population } = data[0];
  const stringOfLanguages = Object.values(languages).join(', ');

  return `<div class="country-info-container">
          <img src="${flags.svg}" alt="flag" width="70px" />
          <h2>${name.official}</h2>
          </div>
          <ul class="country-info-list">
          <li class="country-info-item"> Capital:
          <span>${capital}</span></li>
          <li class="country-info-item"> Population: 
          <span>${population}</span></li>
          <li class="country-info-item"> Languages:
          <span>${stringOfLanguages}</span></li>
          </ul>`;
}

function createMarkupOnList(data) {
  return data
    .map(({ flags, name }) => {
      return `<li class="country-list-item">
             <img src="${flags.svg}" alt="flag" width="70px" />
             <p>${name.official}</p>
             </li>`;
    })
    .join('');
}
