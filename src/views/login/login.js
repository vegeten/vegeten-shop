import * as Api from '/api.js';
import { validateEmail, getAuthorizationObj, getNode } from '/useful-functions.js';
import renderFooter from '../components/footer.js';
import { renderNav } from '../components/nav.js';

const { isLogin } = getAuthorizationObj();

if (isLogin) {
  alert('이미 로그인 되어 있습니다.');
  window.location.href = '/';
}

renderNav();
renderFooter();

// 요소(element), input 혹은 상수
const modalStatus = {
  loginSuccess: '로그인 성공',
  loginFail: '로그인 실패',
  reset: '비밀번호 초기화'
};
const emailInput = getNode('#emailInput');
const passwordInput = getNode('#passwordInput');
const submitButton = getNode('#submitButton');
const modal = getNode('.modal');
const resetPasswordButton = getNode('.reset-password-title');

const validationInput = (e) => {
  if (e.target.value === '') {
    e.target.classList.add('is-danger');
  } else {
    e.target.classList.remove('is-danger');
  }
};

const createModalElement = (status, title) => {
  const modalCardTitle = getNode('.modal-card-title');
  const modalCardBody = getNode('.modal-card-body');
  const modalCardFooter = getNode('.modal-card-foot');

  modalCardTitle.innerHTML = title;

  switch (status) {
    case modalStatus.loginSuccess:
      modalCardBody.innerHTML = `
        <div class="confirm-circle scale-in-center">
          <span class="cofirm-icon material-icons">
            check_circle_outline
          </span>
        </div>
      `;
      modalCardFooter.innerHTML = `
        <a class="button is-black" href="/shop">쇼핑 하러가기</a>
        <a class="button is-white" href="/">홈 화면으로가기</a>
      `;
      break;
    case modalStatus.loginFail:
      modalCardBody.innerHTML = `
        <div class="confirm-circle scale-in-center">
          <span class="cofirm-icon material-icons">
            replay
          </span>
        </div>
      `;
      break;
    case modalStatus.reset:
      modalCardBody.innerHTML = `
        <form class="reset-password-form">
          <label for="current-email">이메일</label >
          <input id="current-email" class="input is-medium" placeholder="사용 중인 이메일을 입력하세요.">
        </form>
      `;
      const button = document.createElement('button');
      button.classList = 'button is-black';
      button.innerHTML = '비밀번호 초기화';
      button.addEventListener('click', resetPassword);
      modalCardFooter.appendChild(button);
      break;
  }
};

const addEventInModal = () => {
  const modalButton = getNode('.close-button');
  const modalBackground = getNode('.modal-background');
  modalButton.addEventListener('click', closeModal);
  modalBackground.addEventListener('click', closeModal);
};

const viewDetailModal = (status, message = '') => {
  modal.classList.add('is-active');
  createModalElement(status, message);
  addEventInModal();
};

const closeModal = () => {
  modal.classList.remove('is-active');
  window.location.href = '/login';
};

const resetPasswordModal = (e) => {
  viewDetailModal(modalStatus.reset, '비밀번호 초기화.');
};

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
  emailInput.addEventListener('input', validationInput);
  passwordInput.addEventListener('input', validationInput);
  resetPasswordButton.addEventListener('click', resetPasswordModal);
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
    viewDetailModal(modalStatus.loginFail, '아이디와 비밀번호 입력을 확인하세요.');
    return;
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

    viewDetailModal(modalStatus.loginSuccess, '로그인이 완료되었습니다.');
    // 로그인 페이지 이동
  } catch (err) {
    console.error(err.stack);
    viewDetailModal(modalStatus.loginFail, err.message);
  }
}

const resetPassword = (e) => {
  console.log(e.target);
};

addAllEvents();