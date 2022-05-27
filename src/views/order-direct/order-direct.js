import * as Api from '/api.js';
import { getNode, addCommas } from '../../useful-functions.js';
const productsContainer = getNode('#products-container');
const postalCodeInput = getNode('#postal-code');
const totalCostElement = getNode('#total-cost');
const payButton = getNode('#pay-button');

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

  getNode('#name').value = userData.fullName;

  const [phoneNumberFirst = '', phoneNumberSecond = '', phoneNumberThird = ''] = userData.phoneNumber?.split('-') || [];
  const { postalCode = '', address1 = '', address2 = '' } = userData?.address || {};

  getNode('#postal-code').value = postalCode;
  getNode('#address1').value = address1;
  getNode('#address2').value = address2;

  getNode('#phone1').value = phoneNumberFirst;
  getNode('#phone2').value = phoneNumberSecond;
  getNode('#phone3').value = phoneNumberThird;
}

getUserInfo();

// 카카오 주소 가져오기
window.onload = function () {
  getNode('#kakao_address').addEventListener('click', () => {
    new daum.Postcode({
      oncomplete: function (data) {
        postalCodeInput.value = data.zonecode;
        postalCodeInput.classList.remove('is-danger');
        //getNode('#postal-code-msg').classList.add('hide');
        getNode('#address1').value = data.address;
        getNode('#address2').focus();
      },
    }).open();
  });
};

// 폼 비어있는지 체크
// 이름
const nameInput = getNode('#name');
nameInput.addEventListener('input', () => {
  if (nameInput.value !== '') {
    nameInput.classList.remove('is-danger');
    getNode('#name-msg').classList.add('hide');
  } else {
    nameInput.classList.add('is-danger');
    getNode('#name-msg').classList.remove('hide');
  }
});

// 전화번호
const phoneInput = document.querySelectorAll('.phone');
phoneInput.forEach((phone, idx) => {
  phone.addEventListener('input', () => {
    if (phoneInput[0].value !== '' && phoneInput[1].value !== '' && phoneInput[2].value !== '') {
      phoneInput[0].classList.remove('is-danger');
      phoneInput[1].classList.remove('is-danger');
      phoneInput[2].classList.remove('is-danger');
      getNode('#phone-msg').classList.add('hide');
    } else {
      phoneInput[0].classList.add('is-danger');
      phoneInput[1].classList.add('is-danger');
      phoneInput[2].classList.add('is-danger');
      getNode('#phone-msg').classList.remove('hide');
    }
  });
});

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
      postalCode: getNode('#postal-code').value,
      address1: getNode('#address1').value,
      address2: getNode('#address2').value,
    },
    phoneNumber: `${getNode('#phone1').value}-${getNode('#phone2').value}-${getNode('#phone3').value}`,
    products: productsList,
    totalPrice: productInfo.price * productCount,
    userId: userId,
  };

  const res = await Api.post('/api/orders', orderInfo);
}
payButton.addEventListener('click', postOrder);

// 결제하기 눌렀을 때 뜨는 모달
const modal = getNode('.modal');
const close = getNode('.modal-close');

payButton.addEventListener('click', function () {
  modal.style.display = 'flex';
});

close.addEventListener('click', function () {
  modal.style.display = 'none';
});

// window.addEventListener('click', function (event) {
//   if (event.target.className === 'modal-background') {
//     modal.style.display = 'none';
//   }
// });
