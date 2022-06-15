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
const modalTitle = getNode('.modal-card-title');
const modalBody = getNode('.modal-card-body');
const orderList = getNode('.order-list');
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
      target.nextElementSibling.innerHTML = '이름은 2글자 이상이어야 합니다.';
      break;
    case currentPasswordInput:
      target.nextElementSibling.innerHTML = '비밀번호는 필수 입력사항입니다.';
      break;
    case newPasswordInput:
      target.nextElementSibling.innerHTML =
        '영문,숫자,특수문자 포함 8자리이상 15자리이하  (가능한 특수문자: ~!@#$%^&*)';
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
    passwordToggle.innerText = '비밀번호 변경 취소';
  } else {
    passwordToggle.innerText = '비밀번호 변경';
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

const registerNewReview = (productId) => {
  modalTitle.innerHTML = '리뷰 등록';
  modalBody.innerHTML = `
    <div>${productId}</div>
  `;
  modal.classList.add('is-active');
};

const changeSubmitButton = (e) => {
  e.preventDefault();
  modalTitle.innerHTML = '비밀번호 변경';
  modalBody.innerHTML = `
    <div class="field">
      <label class="checkPassword" for="checkPassword">비밀번호</label>
      <div class="control">
        <input class="input is-medium passwd checkPasswordInput" id="checkPassword" type="password"
          placeholder="현재 비밀번호를 입력해주세요." />
      </div>
    </div>
    <div id="password-footer">
      <button class="button check-password-confirm-button">확인</button>
    </div>
  `;

  modal.classList.add('is-active');
  const checkPasswordConfirmButton = getNode('.check-password-confirm-button');
  checkPasswordConfirmButton.addEventListener('click', checkUserPassword);
};

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
const addAllEvents = () => {
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
  orderList.addEventListener('click', onClickOrderList);
};

const onDeleteOrder = async (orderId) => {
  const ok = window.confirm('주문 내역을 정말 삭제하시겠습니까?');
  if (!ok) return;

  try {
    await Api.deleteYesToken('/api/orders', orderId);
    alert(`주문번호: ${orderId} 주문이 취소되었습니다.`);
    window.location.reload();
  } catch (err) {
    console.log(err.message);
  }
};

const onClickOrderList = (e) => {
  if (!(e.target.classList.contains('order-delete-button') || e.target.classList.contains('create-product-review'))) return;

  if (e.target.classList.contains('order-delete-button')) {
    const orderId = e.target.parentNode.parentNode.parentNode.querySelector('.order-id').innerText;
    onDeleteOrder(orderId);
  } else {
    const productId = e.target.parentNode.parentNode.querySelector('.product-id').innerText;
    registerNewReview(productId);
  }
};

const createOrderDetailListElement = (array) => {
  return array
    .map(({ productId, productImg, productName, count }) => {
      return `
    <tr>
      <td ><img class="order-img" src=${productImg} alt="상품 이미지" /></td>
      <td>${productName}</td>
      <td>${count}개</td>
      <td>
        <button class="button is-small is-black create-product-review">리뷰 작성</button>
      </td>
      <td class="product-id" style="display:none;">${productId}</td>
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
      <table class="table is-fullwidth table-head">
      <thead>
        <tr>
          <th>제품</th>
          <th>제품 명</th>
          <th>제품 수량</th>
          <th>리뷰</th>
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

const renderAllOrderList = (orderList) => {
  if (!orderList.data.length) return;
  orderWrapper.innerHTML = '';
  orderList.data.forEach(({ products, totalPrice, shortId, createdAt }) => {
    const orders = createOrderListElement({ totalPrice, shortId, createdAt, products });
    orderWrapper.appendChild(orders);
  });
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

// 공백없어야함, 숫자&문자&특수문자 (8자 이상 15자 이하)
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
