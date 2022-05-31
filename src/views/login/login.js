import * as Api from '/api.js';
import { validateEmail, getAuthorizationObj, getNode } from '/useful-functions.js';
import renderFooter from '../components/footer.js';
import { renderNav } from '../components/nav.js';

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
const emailInput = getNode('#emailInput');
const passwordInput = getNode('#passwordInput');
const submitButton = getNode('#submitButton');
const modal = getNode('.modal');
const modalButton = getNode('.close-button');
const modalBackground = getNode('.modal-background');

const validationInput = (e) => {
  if (e.target.value === '') {
    e.target.classList.add('is-danger');
    e.target.nextElementSibling.style.display = 'block';
  } else {
    e.target.classList.remove('is-danger');
    e.target.nextElementSibling.style.display = 'none';
  }
};

const viewDetailModal = (success, message = '회원가입 성공') => {
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
  window.location.href = '/login';
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
    return alert('비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.');
  }

  // 로그인 api 요청
  try {
    const data = { email, password };

    const result = await Api.post('/api/users/login', data);
    const { token, refreshToken } = result;

    // 로그인 성공, 토큰을 세션 스토리지에 저장
    // 물론 다른 스토리지여도 됨
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    viewDetailModal(true);
    // 로그인 페이지 이동
  } catch (err) {
    console.error(err.stack);
    viewDetailModal(false, err.message);
  }
}

addAllEvents();