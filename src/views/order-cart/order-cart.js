import * as Api from '/api.js';
import { getNode, addCommas } from '../../useful-functions.js';
const postalCodeInput = getNode('#postal-code');

// 로컬스토리지에 있는 장바구니 가져오기
let cartList = JSON.parse(localStorage.getItem('cart'));

// 로컬스토리지의 장바구니 값들 화면에 뿌려주기
const productsContainer = getNode('#products-container');
let markUp = '';
cartList.forEach((product) => {
  markUp += `
    <div class="product-wrap">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="상품 사진" />
      </div>
      <div class="product-info-wrap">
        <div>상품명: ${product.productName}</div>
        <div>수량: ${product.count}</div>
        <div>상품구매금액: ${addCommas(product.price * product.count)}원</div>
      </div>
    </div>
  `;
});
productsContainer.innerHTML = markUp;

// 총 결제 금액 계산
const totalCostElement = getNode('#total-cost');
let totalCost = 0;

cartList.forEach((product) => {
  totalCost += product.price * product.count;
});
totalCostElement.innerText = `${addCommas(totalCost)}원`;

// 총 결제 금액을 반영한 결제버튼
const payButton = getNode('#pay-button');
payButton.innerText = `${addCommas(totalCost)}원 결제하기`;

// 회원 정보 받아오기
let userId;

async function getUserInfo() {
  const res = await Api.get('/api/users');
  const userData = res.data;
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
  const productsList = [];
  cartList.forEach((product) => {
    productsList.push({
      productId: product.productId,
      productImg: product.image,
      productName: product.productName,
      count: product.count,
    });
  });
  const orderInfo = {
    address: {
      postalCode: getNode('#postal-code').value,
      address1: getNode('#address1').value,
      address2: getNode('#address2').value,
    },
    phoneNumber: `${getNode('#phone1').value}-${getNode('#phone2').value}-${getNode('#phone3').value}`,
    products: productsList,
    totalPrice: totalCost,
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
