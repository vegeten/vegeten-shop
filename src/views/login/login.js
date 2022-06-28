import * as Api from '/api.js';
import { validateEmail, getAuthorizationObj, getNode, setCookie, getCookie } from '/useful-functions.js';
import renderFooter from '../components/footer.js';
import { renderNav } from '../components/navigation.js';

const { isLogin } = getAuthorizationObj();
if (isLogin) {
  alert('이미 로그인 되어 있습니다.');
  window.location.href = '/';
}

renderNav();
renderFooter();

// 요소(element), input 혹은 상수
const modalStatus = {
  loginSuccess: 'login success',
  loginFail: 'login fail',
  reset: 'password reset',
  resetSuccess: 'password reset success',
  resetFail: 'password reset fail',
};
const emailInput = getNode('#emailInput');
const passwordInput = getNode('#passwordInput');
const submitButton = getNode('#submitButton');
const modal = getNode('.modal');
const resetPasswordButton = getNode('.reset-password-title');
const kakaoButton = getNode('#kakaoButton');

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
        <a class="button loginSuccessedButton" id="goShopping" href="/shop">쇼핑 하러가기</a>
        <a class="button loginSuccessedButton id="goHome" is-white" href="/">홈 화면으로가기</a>
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
      const button = document.createElement('button');
      button.classList = 'button resetPwdButton';
      button.innerHTML = '비밀번호 초기화';
      button.addEventListener('click', resetPassword);

      modalCardBody.innerHTML = `
        <form class="reset-password-form">
          <label for="current-email">이메일(아이디): </label >
          <input id="current-email" class="input is-medium current-email" placeholder="사용 중인 이메일을 입력해주세요.">
          <div id="email-msg" class="help" style="display: none;">
            <span>올바른 이메일 형식인지 확인해주세요.</span>
          </div>
        </form>
      `;
      modalCardFooter.appendChild(button);
      break;
    case modalStatus.resetSuccess:
      modalCardBody.innerHTML = `
        <div class="confirm-circle scale-in-center">
          <span class="cofirm-icon material-icons">
            check_circle_outline
          </span>
        </div>
      `;
      modalCardFooter.innerHTML = `
        <a class="button is-black" href="/login">로그인 페이지로 가기</a>
      `;
      break;
    case modalStatus.resetFail:
      modalCardBody.innerHTML = `
        <div class="confirm-circle scale-in-center">
          <span class="cofirm-icon material-icons">
            replay
          </span>
        </div>
      `;
      modalCardFooter.innerHTML = '';
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

const resetPasswordModal = () => {
  viewDetailModal(modalStatus.reset, '비밀번호 초기화');
};

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
  emailInput.addEventListener('input', validationInput);
  passwordInput.addEventListener('input', validationInput);
  resetPasswordButton.addEventListener('click', resetPasswordModal);
}

const addErrorHTML = () => {
  const resetEmailInput = getNode('#email-msg');
  resetEmailInput.style.display = 'block';
  resetEmailInput.classList.add('is-danger');
};

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

    const result = await Api.postNoToken('/api/users/login', data);
    const { accessToken, exp } = result.data;

    // 로그인 성공 시 리프레시토큰을 쿠키에 저장
    // 엑세스토큰과 엑세스토큰 만료시간은 로컬스토리지에 저장
    localStorage.setItem('accessToken_exp', exp);
    localStorage.setItem('accessToken', accessToken);

    viewDetailModal(modalStatus.loginSuccess, '로그인이 완료되었습니다.');
    // 로그인 페이지 이동
  } catch (err) {
    viewDetailModal(modalStatus.loginFail, err.message);
  }
}
const resetPassword = async () => {
  const currentEmail = getNode('.current-email').value;
  const isEmailValid = validateEmail(currentEmail);

  if (!isEmailValid) {
    addErrorHTML();
    return;
  }

  try {
    const result = await Api.postNoToken('/api/users/reset-password', { email: currentEmail });
    viewDetailModal(modalStatus.resetSuccess, result.message);
  } catch (err) {
    viewDetailModal(modalStatus.resetFail, err.message);
  }
};

addAllEvents();
