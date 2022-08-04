
const fileInputSelector = '#file';
const uploadedFileSelector = '.order-action__file-upload';

function attachFileInputEvents() {
  const fileInput = document.querySelector(fileInputSelector);
  fileInput.addEventListener('change', (e) => {
    setFileLabelText(e.target.files[0].name)
  });
}

function attachDragEvents(el) {
  el.addEventListener('dragenter', (e) => {
    e.preventDefault();
    el.classList.toggle('draggable');
  })

  el.addEventListener('dragover', (e) => {
    e.preventDefault();
  })

  el.addEventListener('dragleave', () => {
    el.classList.toggle('draggable')
  })

  el.addEventListener('drop', (e) => {
    let fileInput = document.querySelector(fileInputSelector);
    fileInput.files = e.dataTransfer.files;
    setFileLabelText(fileInput.files[0].name);
    e.preventDefault();
    el.classList.toggle('draggable');
  })
}

function setFileLabelText(fileName) {
  let fileUploaded = document.querySelector(uploadedFileSelector);
  fileUploaded.innerText = `Выбран: ${fileName}`;
}

export default class FormManager {
  constructor(){
    this.customValidatinFieldIds = ['file'];
  }

  attachEvents() {
    attachDragEvents(document.body);
    attachFileInputEvents();
  }
}