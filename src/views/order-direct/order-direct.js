import * as Api from '/api.js';
import { getNode, addCommas } from '../../useful-functions.js';
// elements
const productsContainer = getNode('#products-container');
const totalCostElement = getNode('#total-cost');
const nameInput = getNode('#name');
const postalCodeInput = getNode('#postal-code');
const address1 = getNode('#address1');
const address2 = getNode('#address2');
const phoneInput = document.querySelectorAll('.phone');
const payButton = getNode('#pay-button');
const nameValidateMsg = getNode('#name-msg');
const addressValidateMsg = getNode('#postal-code-msg');
const phoneValidateMsg = getNode('#phone-msg');
const modal = getNode('.modal');

const productUrl = window.location.href.split('/');
const productId = productUrl[productUrl.length - 2];

const productCount = JSON.parse(localStorage.getItem('buy')).count;
let productInfo;
async function getProductInfo(productId) {
  const res = await Api.get(`/api/products/${productId}`);
  productInfo = res.data;

  let markUp = '';
  markUp += `
  <div class="product-wrap">
    <div class="product-image-wrap">
      <img src="${productInfo.image}" alt="상품 사진" />
    </div>
    <div class="product-info-wrap">
      <div>상품명: ${productInfo.productName}</div>
      <div>수량: ${productCount}</div>
      <div>상품구매금액: ${addCommas(productInfo.price * productCount)}원</div>
    </div>
  </div>
`;

  productsContainer.innerHTML = markUp;
  totalCostElement.innerText = `${addCommas(productInfo.price * productCount)}원`;
  payButton.innerText = `${addCommas(productInfo.price * productCount)}원`;
  payButton.innerText = `${addCommas(productInfo.price * productCount)}원 결제하기`;
}
getProductInfo(productId);

// 회원 정보 받아오기
let userId;

async function getUserInfo() {
  const result = await Api.get('/api/users');
  const userData = result.data;
  userId = userData._id;

  nameInput.value = userData.fullName;

  const [phoneNumberFirst = '', phoneNumberSecond = '', phoneNumberThird = ''] = userData.phoneNumber?.split('-') || [];
  const phoneNumbers = [phoneNumberFirst, phoneNumberSecond, phoneNumberThird];
  const { postalCode = '', baseAddress1 = '', baseAddress2 = '' } = userData?.address || {};

  postalCodeInput.value = postalCode;
  address1.value = baseAddress1;
  address2.value = baseAddress2;

  phoneInput.forEach((phone, idx) => {
    phone.value = phoneNumbers[idx];
  });
}

getUserInfo();

// 카카오 주소 가져오기
window.onload = function () {
  getNode('#kakao_address').addEventListener('click', () => {
    new daum.Postcode({
      oncomplete: function (data) {
        postalCodeInput.value = data.zonecode;
        postalCodeInput.classList.remove('is-danger');
        addressValidateMsg.classList.add('hide');
        address1.value = data.address;
        address2.value = '';
        address2.focus();
      },
    }).open();
  });
};

// 폼 비어있는지 체크 (실시간 입력에 따른 체크)
// 이름
nameInput.addEventListener('input', () => {
  if (nameInput.value !== '') {
    nameInput.classList.remove('is-danger');
    nameValidateMsg.classList.add('hide');
  } else {
    nameInput.classList.add('is-danger');
    nameValidateMsg.classList.remove('hide');
  }
});

// 전화번호
phoneInput.forEach((phone, idx) => {
  phone.addEventListener('input', () => {
    if (phoneInput[0].value !== '' && phoneInput[1].value !== '' && phoneInput[2].value !== '') {
      phoneInput[0].classList.remove('is-danger');
      phoneInput[1].classList.remove('is-danger');
      phoneInput[2].classList.remove('is-danger');
      phoneValidateMsg.classList.add('hide');
    } else {
      phoneInput[0].classList.add('is-danger');
      phoneInput[1].classList.add('is-danger');
      phoneInput[2].classList.add('is-danger');
      phoneValidateMsg.classList.remove('hide');
    }
  });
});

// 결제하기 눌렀을 때 폼 유효성 검사
function checkForm() {
  let validateFlag = true;

  if (!nameInput.value) {
    nameInput.classList.add('is-danger');
    nameValidateMsg.classList.remove('hide');
    validateFlag = false;
  }

  if (!postalCodeInput.value) {
    postalCodeInput.classList.add('is-danger');
    addressValidateMsg.classList.remove('hide');
    validateFlag = false;
  }

  phoneInput.forEach((phone) => {
    if (!phone.value) {
      phoneInput[0].classList.add('is-danger');
      phoneInput[1].classList.add('is-danger');
      phoneInput[2].classList.add('is-danger');
      phoneValidateMsg.classList.remove('hide');
      validateFlag = false;
    }
  });
  return validateFlag;
}

// 결제하기 눌렀을 때 post 요청
async function postOrder() {
  const productsList = [
    {
      productId: productId,
      productImg: productInfo.image,
      productName: productInfo.productName,
      count: productCount.count,
    },
  ];

  const orderInfo = {
    address: {
      postalCode: postalCodeInput.value,
      address1: address1.value,
      address2: address1.value,
    },
    phoneNumber: `${getNode('#phone1').value}-${getNode('#phone2').value}-${getNode('#phone3').value}`,
    products: productsList,
    totalPrice: productInfo.price * productCount,
    userId: userId,
  };

  const res = await Api.post('/api/orders', orderInfo);
}
function handleSubmit() {
  const formValidateCheck = checkForm();
  console.log(formValidateCheck);
  if (!formValidateCheck) return;

  postOrder();
  modal.style.display = 'flex';
}
payButton.addEventListener('click', handleSubmit);
