import renderFooter from '../components/footer.js';
import { logOut, renderNav } from '../components/nav.js';
import { addCommas, getNode } from '../useful-functions.js';
import * as Api from '/api.js';

const orderWrapper = getNode('.order-list');
const fullNameInput = getNode('.name-input');
const emailInput = getNode('.email-input');
const fullPhoneNumberInput = getNode('.fullPhoneNumber');
const numberFirstInput = getNode('.number-1');
const numberSecondInput = getNode('.number-2');
const numberThirdInput = getNode('.number-3');
const addressCodeInput = getNode('.address-code');
const addressTitleInput = getNode('.address');
const addressDetailInput = getNode('.address-detail');
const currentPasswordInput = getNode('.passwd');
const newPasswordCheck = getNode('.passwd-check');
const newPasswordInput = getNode('.new-passwd');
const passwordToggle = getNode('.passwd-modify');
const btnModCancel = getNode('.btn-mod-cancel');
const btnPasswordConfirm = getNode('.btn-password-confirm');
const modal = getNode('.modal');
const modalButton = getNode('.close-button');
const modalBackground = getNode('.modal-background');
let newPasswordToggle = false;
let changeUserFormFlag = false;

const onModCancel = (e) => {
  e.preventDefault();
  changeUserFormFlag = false;
  changeUserForm(changeUserFormFlag);
};

const changeUserForm = (flag) => {
  const changeFormArray = document.querySelectorAll('.change-form');
  if (flag) {
    fullPhoneNumberInput.parentNode.parentNode.style.display = 'none';
    changeFormArray.forEach((item) => (item.style.display = 'block'));
    fullNameInput.disabled = false;
    addressCodeInput.disabled = false;
    addressTitleInput.disabled = false;
    addressDetailInput.disabled = false;
    btnPasswordConfirm.removeEventListener('click', changeSubmitButton);
    btnPasswordConfirm.addEventListener('click', submitModifyUserInfo);
  } else {
    fullPhoneNumberInput.parentNode.parentNode.style.display = 'block';
    changeFormArray.forEach((item) => (item.style.display = 'none'));
    fullNameInput.disabled = true;
    addressCodeInput.disabled = true;
    addressTitleInput.disabled = true;
    addressDetailInput.disabled = true;
    btnPasswordConfirm.removeEventListener('click', submitModifyUserInfo);
    btnPasswordConfirm.addEventListener('click', changeSubmitButton);
  }
};

const closeModal = () => {
  modal.classList.remove('is-active');
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
    case currentPasswordInput:
      target.nextElementSibling.innerHTML = '비밀번호는 필수 입력사항입니다.';
      break;
    case newPasswordCheck:
      target.nextElementSibling.innerHTML = '비밀번호가 일치하지 않습니다.';
      break;
  }
};

const onPasswordToggle = (e) => {
  e.preventDefault();
  newPasswordToggle = !newPasswordToggle;
  if (newPasswordToggle) {
    e.target.classList.remove('is-warning');
    e.target.classList.add('is-danger');
    newPasswordInput.readOnly = false;
    newPasswordInput.placeholder = '새 비밀번호를 입력해주세요.';
    newPasswordCheck.readOnly = false;
    newPasswordCheck.placeholder = '새 비밀번호 확인을 입력해주세요.';
    newPasswordInput.focus();
  } else {
    e.target.classList.remove('is-danger');
    e.target.classList.add('is-warning');
    newPasswordInput.placeholder = '비밀번호 변경 버튼을 누르세요.';
    newPasswordInput.readOnly = true;
    newPasswordCheck.readOnly = true;
    newPasswordCheck.placeholder = '비밀번호 변경 버튼을 누르세요.';
  }
};

const renderUserInfo = (data) => {
  const {
    fullName,
    email,
    fullPhoneNumber,
    phoneNumberFirst,
    phoneNumberSecond,
    phoneNumberThird,
    postalCode,
    address1,
    address2,
  } = data;

  fullNameInput.value = fullName;
  emailInput.value = email;
  fullPhoneNumberInput.value = fullPhoneNumber;
  numberFirstInput.value = phoneNumberFirst;
  numberSecondInput.value = phoneNumberSecond;
  numberThirdInput.value = phoneNumberThird;
  addressCodeInput.value = postalCode;
  addressTitleInput.value = address1;
  addressDetailInput.value = address2;
};

const changeSubmitButton = (e) => {
  e.preventDefault();
  modal.classList.add('is-active');
  const checkPasswordConfirmButton = getNode('.check-password-confirm-button');
  checkPasswordConfirmButton.addEventListener('click', checkUserPassword);
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

  btnWithdraw.addEventListener('click', submitWithdrawUser);
  btnPasswordConfirm.addEventListener('click', changeSubmitButton);

  passwordToggle.addEventListener('click', onPasswordToggle);
  fullNameInput.addEventListener('input', validationInput);
  currentPasswordInput.addEventListener('input', validationInput);
  newPasswordCheck.addEventListener('input', validationInput);
  newPasswordInput.addEventListener('input', validationInput);
  modalButton.addEventListener('click', closeModal);
  modalBackground.addEventListener('click', closeModal);
  btnModCancel.addEventListener('click', () => onModCancel);
}

const onDeleteOrder = async (e) => {
  e.preventDefault();

  const ok = window.confirm('주문 내역을 정말 삭제하시겠습니까?');
  if (!ok) return;

  try {
    const orderId = e.target.parentNode.parentNode.parentNode.querySelector('.order-id').innerText;
    await Api.deleteYesToken('/api/orders', orderId);
    alert('주문 내역이 삭제되었습니다.');
    window.location.reload();
  } catch (err) {
    console.log(err.message);
  }
};

const createOrderDetailListElement = (array) => {
  return array
    .map(({ productImg, productName, count }) => {
      return `
    <tr>
      <td ><img class="order-img" src=${productImg} alt="상품 이미지" /></td>
      <td>${productName}</td>
      <td>${count}개</td>
    </tr>
      `;
    })
    .join('');
};

const createOrderListElement = (item) => {
  const { shortId, products, totalPrice, createdAt } = item;

  let orderDetail = '';

  if (!products.length) orderDetail = createOrderDetailListElement([products]);
  else orderDetail = createOrderDetailListElement(products);

  const li = document.createElement('li');

  li.innerHTML = `
  
  <li class="order box">
    <div class="order-info">
      <div class="order-id-wrap">
        <div><strong>주문 번호</strong></div>
        <div class="order-id content">${shortId}</div>
      </div>
      <div class="order-date">
        <div><strong>주문 날짜</strong></div>
        <div class="content">${createdAt.substr(0, 10)}</div>
      </div>
    </div>
      <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>제품</th>
          <th>제품 명</th>
          <th>제품 수량</th>
        </tr>
      </thead>
      <tbody>
        ${orderDetail}
      </tbody>
    </table>
    <div class="order-info-2">
      <div class="order-delete">
        <button class="order-delete-button button is-small is-danger">주문 취소</button>
      </div>
      <div class="order-price">
        <div><strong>총 금액: ${addCommas(totalPrice)}</strong></div>
      </div>
    </div>
  </li>
  
  `;

  return li;
};

const addOrderDeleteEvent = () => {
  document.querySelectorAll('.order-delete-button').forEach((item) => {
    item.addEventListener('click', onDeleteOrder);
  });
};

const renderAllOrderList = (orderList) => {
  orderWrapper.innerHTML = '';
  orderList.data.forEach(({ products, totalPrice, shortId, createdAt }) => {
    const orders = createOrderListElement({ totalPrice, shortId, createdAt, products });
    orderWrapper.appendChild(orders);
  });
  addOrderDeleteEvent();
};

const getUserInfo = async () => {
  try {
    const result = await Api.getYesToken('/api/users');
    const [phoneNumberFirst = '', phoneNumberSecond = '', phoneNumberThird = ''] =
      result.data.phoneNumber?.split('-') || [];
    const { postalCode, address1, address2 } = result.data?.address || {};
    const fullPhoneNumber = phoneNumberFirst && `${phoneNumberFirst}-${phoneNumberSecond}-${phoneNumberThird}`;
    const userInfo = {
      fullName: result.data.fullName,
      email: result.data.email,
      fullPhoneNumber: fullPhoneNumber || '등록된 휴대폰 번호가 없습니다.',
      phoneNumberFirst,
      phoneNumberSecond,
      phoneNumberThird,
      postalCode: postalCode || '등록된 우편번호가 없습니다.',
      address1: address1 || '등록된 주소가 없습니다.',
      address2: address2 || '등록된 상세주소가 없습니다.',
    };
    renderUserInfo(userInfo);
  } catch (err) {
    console.log(err.message);
    alert(err.message);
    window.location.href = '/';
  }
};

const submitWithdrawUser = async (e) => {
  e.preventDefault();

  const ok = window.confirm('정말로 탈퇴하시겠습니까?');
  if (!ok) return;

  try {
    await Api.deleteYesToken('/api/users');
    alert('회원정보가 삭제되었습니다.');
    logOut();
  } catch (err) {
    console.log(err.message);
    alert(err.message);
    window.location.reload();
  }
};

const submitModifyUserInfo = async (e) => {
  e.preventDefault();

  let validateFlag = true;
  const fullName = fullNameInput.value;
  const password = currentPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const newPasswordConfirm = newPasswordCheck.value;
  const phoneNumber = `${numberFirstInput.value}-${numberSecondInput.value}-${numberThirdInput.value}`;

  const isFullNameValid = fullName.length >= 2;
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = newPassword === newPasswordConfirm;

  if (!isFullNameValid) {
    addErrorHTML(fullNameInput);
    validateFlag = false;
  }

  if (!isPasswordValid) {
    addErrorHTML(passwordInput);
    validateFlag = false;
  }

  if (!isPasswordSame) {
    addErrorHTML(newPasswordCheck);
    validateFlag = false;
  }

  if (!validateFlag) return;

  const ok = window.confirm('정말 수정하시겠습니까?');
  if (!ok) return;

  try {
    const data = {
      fullName: fullNameInput.value,
      currentPassword: currentPasswordInput.value,
      address: {
        postalCode: addressCodeInput.value,
        address1: addressTitleInput.value,
        address2: addressDetailInput.value,
      },
      phoneNumber,
      password: newPasswordInput.value,
    };

    await Api.patchYesToken('/api/users', '', data);
    window.location.reload();
  } catch (err) {
    console.log(err.message);
    alert(err.message);
  }
};

const getOrderList = async () => {
  try {
    const result = await Api.getYesToken('/api/orders');
    renderAllOrderList(result);
  } catch (err) {
    console.log(err.message);
  }
};

const checkUserPassword = async (e) => {
  e.preventDefault();
  const currentPassword = e.target.parentNode.parentNode.querySelector('.checkPasswordInput').value;
  try {
    await Api.postYesToken('/api/users/password', { currentPassword });
    changeUserFormFlag = true;
    changeUserForm(changeUserFormFlag);
    closeModal();
  } catch (err) {
    alert(err.message);
    window.location.reload();
  }
};

renderNav();
renderFooter();
getUserInfo();
getOrderList();
addAllEvents();
