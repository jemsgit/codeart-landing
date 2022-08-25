const fileInputSelector = '#file';
const uploadedFileSelector = '.order-action__file-upload';
const formButtonSelector = '.order-action__form button';
const formSelector = '.order-action__form';
const formErrosSelector = '.order-action__form-errors';
const notificationSelector = '.notification';
const defaultSelectOption = 'none';

const form = document.querySelector(formSelector);
const fileInput = document.querySelector(fileInputSelector);
const errorsEl = document.querySelector(formErrosSelector);
const notificationEl = document.querySelector(notificationSelector);


function presence(val, message) {
  if(val) {
    return;
  }
  return message;
}

function notNullOption(val, message) {
  if(val === defaultSelectOption) {
    return message;
  }
}

const validationConstraints = {
  name: (val) => presence(val, 'Введите Имя'),
  email: (val) => presence(val, 'Введите Email'),
  file: (val) => presence(val, 'Выберите Фото'),
  style: (val) => notNullOption(val, 'Выберите Стиль')
}

function validateFields() {
  const elements = form.elements;
  let errors = []
  for(let key in validationConstraints) {
    let input = elements[key];
    if(input) {
      let error = validationConstraints[key](input.value)
      if(error) {
        errors.push(error);
      }
    }
  }
  return errors;
}

function attachFileInputEvents() {
  fileInput.addEventListener('change', (e) => {
    if(!e.target.files || !e.target.files.length) {
      return;
    }
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
    fileInput.files = e.dataTransfer.files;
    setFileLabelText(fileInput.files[0].name);
    e.preventDefault();
    el.classList.toggle('draggable');
  })
}

function clearFileLabel() {
  let fileUploaded = document.querySelector(uploadedFileSelector);
  fileUploaded.innerText = "Перетащите или выберите фото";
}

function attachSubmitEvent() {
  let submitButton = document.querySelector(formButtonSelector);
  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    let errors = validateFields();
    if(errors.length) {
      setValidationErrors(errors);
    } else {
      submitButton.setAttribute('disabled', 'disabled');
      let res = await fetch('order', 
        {
          method: 'post',
          body: new FormData(form)
        })
      if(!res.ok) {
        showNotification('error', 'Упс, что-то пошло не так. Попробуйте еще раз');
        submitButton.removeAttribute('disabled');
        return;
      } 
      showNotification('ok', 'Ваша заявка отправлена');
      form.reset();
      clearFileLabel();
      submitButton.removeAttribute('disabled');
    }
  })
}

function showNotification(state, meesage) {
  notificationEl.textContent = meesage;
  notificationEl.classList.remove('error');
  notificationEl.classList.remove('ok');
  notificationEl.classList.add(state);
  notificationEl.classList.add('visible');
  setTimeout(hideNotification, 2000);
}

function hideNotification() {
  notificationEl.classList.remove('visible');
}

function setValidationErrors(errors) {
  errorsEl.innerHTML = `${errors.map(error => `<span>${error}</span>`)}`;
}

function setFileLabelText(fileName) {
  let fileUploaded = document.querySelector(uploadedFileSelector);
  fileUploaded.innerHTML = `<span class="text">Выбран: ${fileName}</span><span id="delete">X</span>`;
}

export default class FormManager {
  constructor(){}

  attachEvents() {
    attachDragEvents(document.body);
    attachFileInputEvents();
    attachSubmitEvent()
  }
}