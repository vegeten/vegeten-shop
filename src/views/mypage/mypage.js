import renderFooter from '../components/footer.js';
import { logOut, renderNav } from "../components/nav.js";
import { getAuthorizationObj, getNode } from '../useful-functions.js';
import * as Api from '/api.js';

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

const { isLogin } = getAuthorizationObj();

if (!isLogin) {
  alert('로그인이 필요한 서비스입니다.');
  window.location.href = '/login';
}

const fullNameInput = getNode('.name-input');
const emailInput = getNode('.email-input');
const numberFirstInput = getNode('.number-1');
const numberSecondInput = getNode('.number-2');
const numberThirdInput = getNode('.number-3');
const addressCodeInput = getNode('.address-code');
const addressTitleInput = getNode('.address');
const addressDetailInput = getNode('.address-detail');
const currentPasswordInput = getNode('.passwd');
const currentPasswordCheck = getNode('.passwd-check');
const checkToggle = getNode('.check-toggle');

const addErrorHTML = (target) => {
  target.classList.add('is-danger');
  target.nextElementSibling.style.display = 'block';
  if (target === fullNameInput) {
    target.nextElementSibling.innerHTML = '이름은 2글자 이상이어야 합니다.';
  } else if (target === currentPasswordInput) {
    target.nextElementSibling.innerHTML = '비밀번호는 4글자 이상이어야 합니다.';
  } else if (target === currentPasswordCheck) {
    target.nextElementSibling.innerHTML = '비밀번호가 일치하지 않습니다.';
  }
};

const renderUserInfo = (data) => {
  const {
    fullName,
    email,
    phoneNumberFirst,
    phoneNumberSecond,
    phoneNumberThird,
    postalCode,
    address1,
    address2
  } = data;

  fullNameInput.value = fullName;
  emailInput.value = email;
  numberFirstInput.value = phoneNumberFirst;
  numberSecondInput.value = phoneNumberSecond;
  numberThirdInput.value = phoneNumberThird;
  addressCodeInput.value = postalCode;
  addressTitleInput.value = address1;
  addressDetailInput.value = address2;
};

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  getNode('#kakao_address').addEventListener('click', (e) => {
    e.preventDefault();
    new daum.Postcode({
      oncomplete: function (data) {
        addressCodeInput.value = data.zonecode;
        addressTitleInput.value = data.address;
        addressDetailInput.focus();
      },
    }).open();
  });
  const btnWithdraw = getNode('.btn-withdraw');
  const btnModify = getNode('.btn-modify');
  btnWithdraw.addEventListener('click', submitWithdrawUser);
  btnModify.addEventListener('click', submitModifyUserInfo);
}

const getUserInfo = async () => {
  try {
    const result = await Api.get('/api/users');
    const [phoneNumberFirst = '', phoneNumberSecond = '', phoneNumberThird = ''] = result.data.phoneNumber?.split('-') || [];
    const { postalCode = '', address1 = '', address2 = '' } = result.data?.address || {};
    const userInfo = {
      fullName: result.data.fullName,
      email: result.data.email,
      phoneNumberFirst, //result.data.phoneNumber,
      phoneNumberSecond,
      phoneNumberThird,
      postalCode,//result.data.address
      address1,
      address2
    };

    renderUserInfo(userInfo);

  } catch (err) {
    console.log(err.message);
  }
};

const submitWithdrawUser = async (e) => {
  e.preventDefault();

  const ok = window.confirm("정말로 탈퇴하시겠습니까?");
  if (!ok) return;

  try {
    await Api.delete('/api/users');
    logOut();
  } catch (err) {
    console.log(err.message);
  }
};

const submitModifyUserInfo = async (e) => {
  e.preventDefault();

  let validateFlag = true;
  const fullName = fullNameInput.value;
  const password = currentPasswordInput.value;
  const passwordConfirm = currentPasswordCheck.value;

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;

  if (!isFullNameValid) {
    addErrorHTML(fullNameInput);
    validateFlag = false;
  }

  if (!isPasswordValid) {
    addErrorHTML(passwordInput);
    validateFlag = false;
  } else {

  }

  if (!isPasswordSame) {
    addErrorHTML(currentPasswordCheck);
    validateFlag = false;
  }

  if (!validateFlag) return;


  const ok = window.confirm("정말 수정하시겠습니까?");
  if (!ok) return;

  try {
    console.log(addressCodeInput.value);
    const data = {
      fullName: fullNameInput.value,
      currentPassword: currentPasswordInput.value,
      address: {
        postalCode: addressCodeInput.value,
        address1: addressTitleInput.value,
        address2: addressDetailInput.value
      },
      phoneNumber: `${numberFirstInput.value}-${numberSecondInput.value}-${numberThirdInput.value}`,
      password: '',
    };

    await Api.patch('/api/users', '', data);
    window.location.reload();
  } catch (err) {
    console.log(err.message);
  }
};

const renderOrderList = (data) => {

  const template = `
    <li>
      <div class="box order-list has-background-light">
        <div class="order-list-wrapper">
          <div class="order-list-image">
            <img src=${imgSource} alt="상품 이미지" />
          </div>
          <div class="order-list-content">
            <dl class="content-list">
              <div class="content-wrapper">
                <dt class="content-title">
                  <strong>${orderId}</strong>
                </dt>
                <dd class="content-content">
                  12345
                </dd>
              </div>
              <div class="content-wrapper">
                <dt class="content-title">
                  <strong>${productName}</strong>
                </dt>
                <dd class="content-content">
                  안녕
                </dd>
              </div>
              <div class="content-wrapper">
                <dt class="content-title">
                  <strong>수량</strong>
                </dt>
                <dd class="content-content">
                  1
                </dd>
              </div>
              <div class="content-wrapper">
                <dt class="content-title">
                  <strong>금액</strong>
                </dt>
                <dd class="content-content">
                  1,000
                </dd>
              </div>
              <div class="content-wrapper">
                <dt class="content-title">
                  <strong>날짜</strong>
                </dt>
                <dd class="content-content">
                  2022.05.01
                </dd>
              </div>
            </dl>
          </div>

        </div>
      </div>
    </li>
    `;
};


renderNav();
renderFooter();
addAllEvents();
getUserInfo();