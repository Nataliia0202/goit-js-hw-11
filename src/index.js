import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
// import { fetchImages, DEFAULT_PAGE, page, perPage } from './js/fetchImages';
import { imageCreate } from './js/imageCreate';

const form = document.querySelector('.search-form');
const input = document.querySelector('.input');
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const DEFAULT_PAGE = 1;
let page = DEFAULT_PAGE;

const perPage = 40;

async function fetchImages(searchValue) {
  const searchParams = new URLSearchParams({
    key: '30517728-589fd0b92afb9aae41e5e4126',
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: perPage,
    page,
  });
  const images = await axios
    .get(`https://pixabay.com/api/?${searchParams}`)
    .then((page += 1));
  return images.data;
}

form.addEventListener('submit', onSubmit);
buttonLoadMore.addEventListener('click', onNextImagesAdd);

let searchValue = '';

const optionsSL = {
  overlayOpacity: 0.5,
  captionsData: 'alt',
  captionDelay: 250,
};
let simpleLightbox;

async function onSubmit(event) {
  event.preventDefault();
  searchValue = input.value.trim();
  if (searchValue === '') {
    gallery.innerHTML = '';
    buttonLoadMore.classList.add('visually-hidden');
    Notiflix.Notify.info('You cannot search by empty field, try again.');
    return;
  } else {
    try {
      page = DEFAULT_PAGE;
      const result = await fetchImages(searchValue);
      if (result.hits < 1) {
        form.reset();
        gallery.innerHTML = '';
        buttonLoadMore.classList.add('visually-hidden');
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        form.reset();
        gallery.innerHTML = imageCreate(result.hits);
        simpleLightbox = new SimpleLightbox('.gallery a', optionsSL).refresh();
        buttonLoadMore.classList.remove('visually-hidden');

        Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      }
    } catch (error) {
      onError();
    }
  }
}

async function onNextImagesAdd() {
  simpleLightbox.destroy();
  try {
    const result = await fetchImages(searchValue);
      const totalPages = page * perPage;
      console.log(totalPages);
      if (result.totalHits <= totalPages) {
      buttonLoadMore.classList.add('visually-hidden');
      Notiflix.Report.info(
        'Wow',
        "We're sorry, but you've reached the end of search results.",
        'Okay'
      );
    }
    gallery.insertAdjacentHTML('beforeend', imageCreate(result.hits));
    smothScroll();
    simpleLightbox = new SimpleLightbox('.gallery a', optionsSL).refresh();
  } catch (error) {
    onError();
  }
}

function onError() {
  gallery.innerHTML = '';
  buttonLoadMore.classList.add('visually-hidden');
  Notiflix.Report.info('Something get wrong, please try again');
}

// commit
const toTopBtn = document.querySelector('.btn-to-top');
    
window.addEventListener('scroll', onScroll);
toTopBtn.addEventListener('click', onToTopBtn);

function onScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
        toTopBtn.classList.add('btn-to-top--visible');
    };
    if (scrolled < coords) {
        toTopBtn.classList.remove('btn-to-top--visible');
    };
};

function onToTopBtn() {
    if (window.pageYOffset > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
};
function smothScroll() {
    const { height: cardHeight } =
        document.querySelector(".gallery--card").firstElementChild.getBoundingClientRect();
    window.scrollBy({
    top: cardHeight * 4,
    behavior: "smooth",
});
};








