import AOS from 'aos';
import GallerySlider from './gallery-slider';
import { updateGalleryMarkup, findStyleSettings } from './styles-gallery';
import { findVideos } from './video-block';
import FormManager from './form';

const priceListSelector = '.price__list';
const MenuOrderLinkSelector = '#order-link';
const formSelector = '.order-action';
const stylesFormSelector = '#styles-form';
let galleryId = 'style-gallery';

function attachStylesEvents() {
  document.querySelector(stylesFormSelector).addEventListener('change', (e)=> {
    const styleSettings = findStyleSettings(e.target.id);
    if(!styleSettings) {
      return;
    }
    updateGalleryMarkup(styleSettings);
    setTimeout(() => slider.updateSliderContent(styleSettings.images),1);
  })
}

function scrollToForm() {
  document.querySelector(formSelector).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function attachPriceEvents() {
    let priceListEl = document.querySelector(priceListSelector);
    priceListEl.addEventListener('click', scrollToForm);
}

function attachMenuOrderEvent() {
  let oderLink = document.querySelector(MenuOrderLinkSelector);
  oderLink.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToForm(e)
  });
}

document.addEventListener('DOMContentLoaded',(e)=>{
  AOS.init({once: true})
})


const slider = new GallerySlider(galleryId);
const formManager = new FormManager();
slider.attachEvents();
formManager.attachEvents();
attachStylesEvents();
attachPriceEvents();
attachMenuOrderEvent();
findVideos();