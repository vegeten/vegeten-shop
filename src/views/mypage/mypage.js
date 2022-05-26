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

const nameInput = getNode('.name-input');
const emailInput = getNode('.email-input');
const numberFirstInput = getNode('.number-1');
const numberSecondInput = getNode('.number-2');
const numberThirdInput = getNode('.number-3');
const addressCodeInput = getNode('.address-code');
const addressTitleInput = getNode('.address-1');
const addressDetailInput = getNode('.address-2');



const renderUserInfo = (data) => {
  const {
    fullName,
    email,
    phoneNumberFirst,
    phoneNumberSecond,
    phoneNumberThird,
    addressCode,
    addressTitle,
    addressDetail
  } = data;

  nameInput.value = fullName;
  emailInput.value = email;
  numberFirstInput.value = phoneNumberFirst;
  numberSecondInput.value = phoneNumberSecond;
  numberThirdInput.value = phoneNumberThird;
  addressCodeInput.value = addressCode;
  addressTitleInput.value = addressTitle;
  addressDetailInput.value = addressDetail;
};

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  getNode('#kakao_address').addEventListener('click', (e) => {
    e.preventDefault();
    new daum.Postcode({
      oncomplete: function (data) {
        addressCode.value = data.zonecode;
        addressTitle.value = data.address;
        addressDetail.focus();
      },
    }).open();
  });
  const btnWithdraw = getNode('.btn-withdraw');
  const btnModify = getNode('.btn-modify');
  btnWithdraw.addEventListener('click', submitWithdrawUser);
  btnModify.addEventListener('click', submitModifyUserInfo);
}

const getUserInfo = async () => {
  const userId = '628b2a77877f7226b55cbfe6';
  try {
    const result = await Api.get('/api/users', userId);
    const userInfo = {
      fullName: result.data.fullName,
      email: result.data.email,
      phoneNumberFirst: '', //result.data.phoneNumber,
      phoneNumberSecond: '',
      phoneNumberThird: '',
      addressCode: '',//result.data.address
      addressTitle: '',
      addressDetail: ''
    };
    console.log(userInfo);
    renderUserInfo(userInfo);

  } catch (err) {
    console.log(err.message);
  }
};

const submitWithdrawUser = async (e) => {
  const ok = window.confirm("정말로 탈퇴하시겠습니까?");
  if (!ok) return;
  e.preventDefault();
  const userId = '628f5d6adf2db6f55127f676';
  try {
    await Api.delete('/api/users', userId);
    logOut();
  } catch (err) {
    console.log(err.message);
  }
};

const submitModifyUserInfo = async (e) => {
  e.preventDefault();

  try {
    const result = await Api.get('/api/userlist');
    console.log(result);
  } catch (err) {
  }
};


renderNav();
renderFooter();
addAllEvents();
getUserInfo();
