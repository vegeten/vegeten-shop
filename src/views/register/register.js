import * as Api from '/api.js';
import { validateEmail, getAuthorizationObj, getNode } from '/useful-functions.js';
import renderFooter from '../components/footer.js';
import { renderNav } from "../components/nav.js";

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

const { isLogin } = getAuthorizationObj();

if (isLogin) {
  alert('이미 로그인 되어 있습니다.');
  window.location.href = '/';
}

renderNav();
renderFooter();

// 요소(element), input 혹은 상수
const fullNameInput = getNode('#fullNameInput');
const emailInput = getNode('#emailInput');
const passwordInput = getNode('#passwordInput');
const passwordConfirmInput = getNode('#passwordConfirmInput');
const submitButton = getNode('#submitButton');
const nameInput = getNode('#fullNameInput');
const modal = getNode('.modal');
const modalButton = getNode('.close-button');
const modalBackground = getNode('.modal-background');

const viewDetailModal = (success, message = '회원가입 성공') => {
  modal.classList.add('is-active');
  const modalTitle = getNode('.modal-card-title');
  const confirmIcon = getNode('.cofirm-icon');
  const modalCardFooter = getNode('.modal-card-foot');

  modalTitle.innerHTML = message;

  if (success) {
    confirmIcon.innerHTML = 'check_circle_outline';
  } else {
    confirmIcon.innerHTML = 'replay';
    modalCardFooter.style.display = 'none';
  }
};

const closeModal = () => {
  modal.classList.remove('is-active');
  window.location.href = '/login';
};


const validationInput = (e) => {
  if (e.target.value === '') {
    e.target.classList.add('is-danger');
    e.target.nextElementSibling.style.display = 'block';
  } else {
    e.target.classList.remove('is-danger');
    e.target.nextElementSibling.style.display = 'none';
  }
};

const addErrorHTML = (target) => {
  target.classList.add('is-danger');
  target.nextElementSibling.style.display = 'block';
  if (target === fullNameInput) {
    target.nextElementSibling.innerHTML = '이름은 2글자 이상이어야 합니다.';
  } else if (target === passwordInput) {
    target.nextElementSibling.innerHTML = '비밀번호는 4글자 이상이어야 합니다.';
  } else if (target === emailInput) {
    target.nextElementSibling.innerHTML = '이메일 형식이 맞지 않습니다.';
  } else if (target === passwordConfirmInput) {
    target.nextElementSibling.innerHTML = '비밀번호가 일치하지 않습니다.';
  }
};

addAllEvents();

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
  nameInput.addEventListener('input', validationInput);
  emailInput.addEventListener('input', validationInput);
  passwordInput.addEventListener('input', validationInput);
  passwordConfirmInput.addEventListener('input', validationInput);
  modalButton.addEventListener('click', closeModal);
  modalBackground.addEventListener('click', closeModal);
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();
  let validateFlag = true;
  const fullName = fullNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;

  if (!isFullNameValid) {
    addErrorHTML(fullNameInput);
    validateFlag = false;
  }

  if (!isPasswordValid) {
    addErrorHTML(passwordInput);
    validateFlag = false;
  }

  if (!isEmailValid) {
    addErrorHTML(emailInput);
    validateFlag = false;
  }

  if (!isPasswordSame) {
    addErrorHTML(passwordConfirmInput);
    validateFlag = false;
  }

  if (!validateFlag) return;

  // 회원가입 api 요청
  try {
    const data = { fullName, email, password };

    await Api.post('/api/register', data);

    viewDetailModal(true);
    // 로그인 페이지 이동
  } catch (err) {
    console.error(err.stack);
    viewDetailModal(false, err.message);
  }
}
