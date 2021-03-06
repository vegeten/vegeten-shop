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

const newPasswordWrap = getNode('.new-password');
const newPasswordCheckWrap = getNode('.new-password-check');
const newPasswordMsg = getNode('#password-modify-msg');

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
    addressDetailInput.disabled = false;
    passwordToggle.classList.remove('hide');
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
      target.nextElementSibling.innerHTML = '????????? 2?????? ??????????????? ?????????.';
      break;
    case currentPasswordInput:
      target.nextElementSibling.innerHTML = '??????????????? ?????? ?????????????????????.';
      break;
    case newPasswordInput:
      target.nextElementSibling.innerHTML =
        '??????,??????,???????????? ?????? 8???????????? 15????????????  (????????? ????????????: ~!@#$%^&*)';
      break;
    case newPasswordCheck:
      target.nextElementSibling.innerHTML = '??????????????? ???????????? ????????????.';
      break;
  }
};

const onPasswordToggle = (e) => {
  e.preventDefault();
  newPasswordToggle = !newPasswordToggle;
  if (newPasswordToggle) {
    passwordToggle.innerText = '???????????? ?????? ??????';
  } else {
    passwordToggle.innerText = '???????????? ??????';
  }

  newPasswordMsg.style.display = 'none';
  newPasswordWrap.classList.toggle('hide');
  newPasswordInput.classList.remove('is-danger');
  newPasswordInput.nextElementSibling.style.display = 'none';
  newPasswordCheckWrap.classList.toggle('hide');
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

// ?????? ?????? addEventListener?????? ??????????????? ????????? ???????????? ?????? ?????????.
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

  const ok = window.confirm('?????? ????????? ?????? ?????????????????????????');
  if (!ok) return;

  try {
    const orderId = e.target.parentNode.parentNode.parentNode.querySelector('.order-id').innerText;
    await Api.deleteYesToken('/api/orders', orderId);
    alert('?????? ????????? ?????????????????????.');
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
      <td ><img class="order-img" src=${productImg} alt="?????? ?????????" /></td>
      <td>${productName}</td>
      <td>${count}???</td>
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
        <div><strong>?????? ??????</strong></div>
        <div class="order-id content">${shortId}</div>
      </div>
      <div class="order-date">
        <div><strong>?????? ??????</strong></div>
        <div class="content">${createdAt.substr(0, 10)}</div>
      </div>
    </div>
      <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>??????</th>
          <th>?????? ???</th>
          <th>?????? ??????</th>
        </tr>
      </thead>
      <tbody>
        ${orderDetail}
      </tbody>
    </table>
    <div class="order-info-2">
      <div class="order-delete">
        <button class="order-delete-button button is-small is-danger">?????? ??????</button>
      </div>
      <div class="order-price">
        <div><strong>??? ??????: ${addCommas(totalPrice)}</strong></div>
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
  if (!orderList.data.length) return;
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
      fullPhoneNumber: fullPhoneNumber || '????????? ????????? ????????? ????????????.',
      phoneNumberFirst,
      phoneNumberSecond,
      phoneNumberThird,
      postalCode: postalCode || '????????? ??????????????? ????????????.',
      address1: address1 || '????????? ????????? ????????????.',
      address2: address2 || '????????? ??????????????? ????????????.',
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

  const ok = window.confirm('????????? ?????????????????????????');
  if (!ok) return;

  try {
    await Api.deleteYesToken('/api/users');
    alert('??????????????? ?????????????????????.');
    logOut();
  } catch (err) {
    console.log(err.message);
    alert(err.message);
    window.location.reload();
  }
};

// ??????????????????, ??????&??????&???????????? (8??? ?????? 15??? ??????)
function checkPassword(pwd) {
  if (pwd) {
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
    }
  }
  return true;
}

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
  const isNewPasswordValid = checkPassword(newPassword);
  const isPasswordSame = newPassword === newPasswordConfirm;

  if (!isFullNameValid) {
    addErrorHTML(fullNameInput);
    validateFlag = false;
  }

  if (!isPasswordValid) {
    addErrorHTML(currentPasswordInput);
    validateFlag = false;
  }

  if (newPasswordToggle) {
    newPasswordMsg.style.display = 'block';

    if (!isNewPasswordValid || newPassword === '') {
      addErrorHTML(newPasswordInput);
      validateFlag = false;
    }
  }
  if (!isPasswordSame) {
    addErrorHTML(newPasswordCheck);
    validateFlag = false;
  }

  if (!validateFlag) return;

  const ok = window.confirm('?????? ?????????????????????????');
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
