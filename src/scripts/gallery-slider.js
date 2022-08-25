const galleryModalId = 'gallery-modal';
const captionId = 'caption';
const dotsClass = 'demo';
const slidesClass = 'slide-item';
const closeButtonClass = 'close';
const galleryPreviewSelector = '.gallery-image-preview';

export default class GallerySlider {
  constructor(galleryId) {
    this.slideIndex = 1;
    this.galleryId = galleryId;
    this.modalEl = document.getElementById(galleryModalId);
    this.initImages();
  }

  dispose() {
    this.removeEvents();
  }

  handleKey = (e) => {
    if(this.modalEl.style.display === 'none') {
      return;
    }

    if (e.keyCode === 39) {
      this.nextSlide();
      return;
    }
    if (e.keyCode === 37) {
      this.prevSlide();
      return;
    }
    if (e.keyCode === 27) {
      this.closeModal();
      return;
    }
  }

  openModal = (e) => {
    if(!e.target.getAttribute('data-l-src')) {
      return;
    }
    let largeImage = e.target.getAttribute('data-l-src');
    document.body.classList.toggle('modal-open');
    this.slideIndex = this.imageList.findIndex((item) => item === largeImage);
    this.updateImagesMarkup(largeImage);
    this.modalEl.style.display = "block";
  }

  closeModal() {
    document.getElementById(galleryModalId).style.display = "none";
    document.body.classList.remove('modal-open');
  }

  controlClick = (e) => {
    if(e.target.getAttribute('data-id') === 'next') {
      this.nextSlide();
    } else {
      this.prevSlide();
    }
  }

  setActiveImage = (e) => {
    let newActiveImage = e.target.getAttribute('data-l-src');
    this.slideIndex = this.imageList.findIndex((item) => item === newActiveImage);
    this.updateImagesMarkup(newActiveImage);
  }

  prevSlide = () => {
    this.slideIndex = this.slideIndex === 0 ? this.imageList.length -1 : this.slideIndex - 1;
    let currentSlide = document.querySelector('.slides .slide-item.active');
    let prev = document.querySelector('.slides .slide-item:first-child');
    let nextSlide = document.querySelector('.slides .slide-item:last-child');
    currentSlide.classList.toggle("active");
    prev.classList.toggle("active");
    nextSlide.remove();
    this.pastePrevSlide(this.slideIndex - 1);
  }

  nextSlide = () => {
    this.slideIndex = (this.slideIndex + 1) % this.imageList.length;
    let prev = document.querySelector('.slides .slide-item:first-child');
    let currentSlide = document.querySelector('.slides .slide-item.active');
    let nextSlide = document.querySelector('.slides .slide-item.active + .slide-item');
    currentSlide.classList.toggle("active");
    nextSlide.classList.toggle("active");
    prev.remove();
    this.pasteNextSlide(this.slideIndex + 1);
  }

  pasteNextSlide = (nextIndexToPaste) => {
    let index = nextIndexToPaste % this.imageList.length;
    let slidesContainer = document.querySelector('.slides');
    let newImage = this.imageList[index];
    let div = document.createElement('div');
    div.classList.add('slide-item');
    div.innerHTML = `<div class="numbertext">${index + 1} / ${this.imageList.length}</div>
    <img src="${newImage}">`
    slidesContainer.appendChild(div);
  }

  pastePrevSlide = (prevIndexToPaster) => {
    let index = prevIndexToPaster < 0 ? this.imageList.length - 1 : prevIndexToPaster;
    let slidesContainer = document.querySelector('.slides');
    let newImage = this.imageList[index];
    let div = document.createElement('div');
    div.classList.add('slide-item');
    div.innerHTML = `<div class="numbertext">${index + 1} / ${this.imageList.length}</div>
    <img src="${newImage}">`
    slidesContainer.prepend(div);
  }

  showSlides() {
    let i;
    let slides = document.getElementsByClassName(slidesClass);
    let dots = document.getElementsByClassName(dotsClass);
    let captionText = document.getElementById(captionId);

    if (this.slideIndex > slides.length) {
      this.slideIndex = 1;
    }
    if (this.slideIndex < 1) {
      this.slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex-1].style.display = "block";
    dots[this.slideIndex-1].className += " active";
    captionText.innerHTML = dots[this.slideIndex-1].alt;
  }

  updateImagesMarkup(currentImageSrc) {
    let slidesContainer = document.querySelector('.slides');
    let currentImageIndex = this.slideIndex;
    let imagesCount = this.imageList.length;
    let nextIndex = (currentImageIndex + 1) % (imagesCount - 1);
    let prevIndex = currentImageIndex === 0 ? imagesCount - 1 : currentImageIndex - 1;
    let nextImage = this.imageList[nextIndex];
    let prevImage = this.imageList[prevIndex];
    slidesContainer.innerHTML = `
    <div class="slide-item">
      <div class="numbertext">${prevIndex + 1} / ${imagesCount}</div>
      <img src="${prevImage}">
    </div>
    <div class="slide-item active">
      <div class="numbertext">${currentImageIndex + 1} / ${imagesCount}</div>
      <img src="${currentImageSrc}">
    </div>
    <div class="slide-item">
      <div class="numbertext">${nextIndex + 1} / ${imagesCount}</div>
      <img src="${nextImage}">
    </div>`
    
  }

  attachEvents() {
    let gallery = document.getElementById(this.galleryId);
    let closeButton = document.getElementsByClassName(closeButtonClass)[0];
    let controls = document.querySelectorAll('.control-button');
    let previewContainer = document.querySelector('.gallery-image-preview');

    previewContainer.addEventListener('click', this.setActiveImage);
    controls.forEach(item => item.addEventListener('click', this.controlClick))
    gallery.addEventListener('click', this.openModal);
    document.addEventListener('keyup', this.handleKey);
    closeButton.addEventListener('click', this.closeModal);
  }

  removeEvents() {
    let gallery = document.getElementById(this.galleryId);
    let closeButton = document.getElementsByClassName(closeButtonClass)[0];
    let controls = document.querySelectorAll('.control-button');
    let previewContainer = document.querySelector('.gallery-image-preview');

    previewContainer.removeEventListener('click', this.setActiveImage);
    controls.forEach(item => item.removeEventListener('click', this.controlClick))
    gallery.removeEventListener('click', this.openModal);
    closeButton.removeEventListener('click', this.closeModal);
  }

  initImages(images) {
    if(!images) {
      let images = document.querySelectorAll(`#${this.galleryId} img`);
      this.imageList = Array.prototype.map.call(images, (item) => item.getAttribute('data-l-src'));
      return;
    }
    this.imageList = images.map(item => item.l);
  }

  updateSliderContent(images) {
    this.initImages(images);
    this.updatePreview(images);
  }

  updatePreview(images) {
    let newMarkup = '';
    images.forEach(item => {
      newMarkup += `<div class="preview-wrapper">
        <img src="${item.sm}" data-l-src="${item.l}" class="hover-shadow">
      </div>`
    });
    document.querySelector(galleryPreviewSelector).innerHTML = newMarkup;
  }
}