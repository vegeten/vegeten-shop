import * as Api from '/api.js';
import { getNode } from '../useful-functions.js';
const postalCodeInput = getNode('#postal-code');

// 주문하는 상품 뿌려주기

// 카카오 주소 가져오기
window.onload = function () {
  getNode('#kakao_address').addEventListener('click', () => {
    new daum.Postcode({
      oncomplete: function (data) {
        postalCodeInput.value = data.zonecode;
        postalCodeInput.classList.remove('is-danger');
        getNode('#postal-code-msg').classList.add('hide');
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

const modal = getNode('.modal');
const btn = getNode('#pay-button');
const close = getNode('.modal-close');

btn.addEventListener('click', function () {
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
