import * as Api from '/api.js';
import { validateEmail, getAuthorizationObj, getNode } from '/useful-functions.js';
import renderFooter from '../components/footer.js';
import { renderNav } from '../components/navigation.js';

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
const sendMailButton = getNode('.sendMail');
const emailAuthNumberWrap = getNode('.emailAuthNumberWrap');
const emailAuthNumberInput = getNode('#emailAuthNumber');

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

  switch (target) {
    case fullNameInput:
      target.nextElementSibling.innerHTML = '이름은 2글자 이상이어야 합니다.';
      break;
    case passwordInput:
      target.nextElementSibling.innerHTML =
        '영문,숫자,특수문자 포함 8자리이상 15자리이하  (가능한 특수문자: ~!@#$%^&*)';
      break;
    case emailInput:
      target.nextElementSibling.innerHTML = '이메일 형식이 맞지 않습니다.';
      break;
    case emailAuthNumberInput:
      target.nextElementSibling.innerHTML = '인증번호가 일치하지 않습니다.';
      break;
    case passwordConfirmInput:
      target.nextElementSibling.innerHTML = '비밀번호가 일치하지 않습니다.';
      break;
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
  sendMailButton.addEventListener('click', sendMail);
}

let authNumber;

async function sendMail(e) {
  e.preventDefault();
  if (!emailInput.value) {
    emailInput.classList.add('is-danger');
    emailInput.nextElementSibling.style.display = 'block';
    emailInput.nextElementSibling.innerHTML = '이메일을 입력해주세요.';
  } else if (!validateEmail(emailInput.value)) {
    emailInput.classList.add('is-danger');
    emailInput.nextElementSibling.style.display = 'block';
    emailInput.nextElementSibling.innerHTML = '올바른 이메일 형식을 입력해주세요.';
  } else {
    try {
      const emailData = { email: emailInput.value };

      const res = await Api.postNoToken('/api/users/register/send-mail', emailData);

      emailAuthNumberWrap.classList.remove('hide');
      alert('이메일 인증번호가 이메일로 전송되었습니다.');

      console.log(res);
      authNumber = res.data;
    } catch (err) {
      alert(err.message);
    }
  }
}

// 공백없어야함, 숫자&문자&특수문자 (8자 이상 15자 이하)
function checkPassword(pwd) {
  let pattern1 = /[0-9]/;
  let pattern2 = /[a-zA-z]/;
  let pattern3 = /[~!@#$%^&*]/;

  if (
    pwd.search(/\s/) !== -1 ||
    !pattern1.test(pwd) ||
    !pattern2.test(pwd) ||
    !pattern3.test(pwd) ||
    pwd.length < 8 ||
    pwd.length > 15
  ) {
    return false;
  } else {
    return true;
  }
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();
  let validateFlag = true;
  const fullName = fullNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const emailAuth = emailAuthNumberInput.value;

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = checkPassword(password);
  const isPasswordSame = password === passwordConfirm;
  const isEmailAuthValid = emailAuth === authNumber;

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

  if (!emailAuth) {
    alert('이메일 인증을 해주세요.');
    validateFlag = false;
  }

  if (!isEmailAuthValid) {
    addErrorHTML(emailAuthNumberInput);
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

    await Api.postNoToken('/api/users/register', data);

    viewDetailModal(true);
    // 로그인 페이지 이동
  } catch (err) {
    console.error(err.stack);
    viewDetailModal(false, err.message);
  }
}
