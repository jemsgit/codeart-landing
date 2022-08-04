import settings  from "./settings";

const gallerySelectort = '#style-gallery';

const columnsCount = 3;

function findStyleSettings(style) {
  return settings.styles.find(item => item.id === style);
}

function updateGalleryMarkup(styleSettings) {
  if(!styleSettings) {
    return;
  }
  let newMarkup = '';
  for(let i =0; i < columnsCount; i++) {
    newMarkup += getGalleryColumn(styleSettings.images, i);
  }
  document.querySelector(gallerySelectort).innerHTML = newMarkup;
}

function getGalleryColumn(imageList, columnNumber) {
  let columMarkup = `<div class="styles__gallery-column">`;
  for(let i =columnNumber; i < imageList.length; i += columnsCount) {
    let item = imageList[i];
    columMarkup += `<img src="${item.sm}" data-l-src="${item.l}" class="hover-shadow"></img>`
  }
  columMarkup += '</div>';
  return columMarkup;
}

export { updateGalleryMarkup, findStyleSettings };