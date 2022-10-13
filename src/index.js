import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchImages, page, perPage } from './js/fetchImages';
import { imageCreate } from './js/imageCreate';

const form = document.querySelector('.search-form');
const input = document.querySelector('.input');
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

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
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            } else {
                form.reset();
                gallery.innerHTML = imageCreate(result.hits);
                simpleLightbox = new SimpleLightbox(".gallery a", optionsSL).refresh();
                buttonLoadMore.classList.remove('visually-hidden');
                
                Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
            };
        } catch (error) {
            onError();
        };
    };
};

async function onNextImagesAdd() {
    
    simpleLightbox.destroy();
    try {
        const result = await fetchImages(searchValue);
        const totalPages = page * perPage;
            if (result.totalHits <= totalPages) {
                buttonLoadMore.classList.add('visually-hidden');
                Notiflix.Report.info('Wow', "We're sorry, but you've reached the end of search results.", 'Okay');
            }
        gallery.insertAdjacentHTML('beforeend', imageCreate(result.hits));
        
        simpleLightbox = new SimpleLightbox(".gallery a", optionsSL).refresh();
    } catch (error) {
        onError();
    };
};

function onError() {
    gallery.innerHTML = '';
    buttonLoadMore.classList.add('visually-hidden');
    Notiflix.Report.info('Something get wrong, please try again');
};


// commit
