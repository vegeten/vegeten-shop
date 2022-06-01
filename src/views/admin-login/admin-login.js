import * as Api from '/api.js';
import { validateEmail, getNode } from '/useful-functions.js';


// 요소(element), input 혹은 상수
const emailInput = getNode('#emailInput');
const passwordInput = getNode('#passwordInput');
const submitButton = getNode('#submitButton');
const modal = getNode('.modal');
const modalButton = getNode('.close-button');
const modalBackground = getNode('.modal-background');

const validationInput = (e) => {
  if (e.target.value === '') {
    e.target.classList.add('is-danger');
  } else {
    e.target.classList.remove('is-danger');
  }
};

const viewDetailModal = (success, message = '로그인 성공') => {
  const modalTitle = getNode('.modal-card-title');
  const confirmIcon = getNode('.cofirm-icon');
  const modalCardFooter = getNode('.modal-card-foot');

  modal.classList.add('is-active');
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
  window.location.href = '/admin/login';
};

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
  modalButton.addEventListener('click', closeModal);
  modalBackground.addEventListener('click', closeModal);
  emailInput.addEventListener('input', validationInput);
  passwordInput.addEventListener('input', validationInput);
}

// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    viewDetailModal(false, '아이디와 비밀번호 입력을 확인하세요.');
    return;
  }

  // 로그인 api 요청
  try {
    const data = { email, password };

    const result = await Api.postNoToken('/api/admin/login', data);
    const { accessToken, exp } = result.data;

    // 로그인 성공 시 리프레시토큰을 쿠키에 저장
    // 엑세스토큰과 엑세스토큰 만료시간은 로컬스토리지에 저장
    localStorage.setItem('accessToken_exp', exp);
    localStorage.setItem('accessToken', accessToken);

    viewDetailModal(true);
    // 로그인 페이지 이동
  } catch (err) {
    console.error(err.stack);
    viewDetailModal(false, err.message);
  }
}

addAllEvents();