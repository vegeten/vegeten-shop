import renderFooter from '../components/footer.js';
import { renderNav } from '../components/nav.js';
import { getNode, addCommas, convertToNumber } from '../useful-functions.js';

renderNav();
renderFooter();

// 전체 선택
const allCheckButton = getNode('#all-check');
let isAllClicked = false;
allCheckButton.addEventListener('click', checkAll);

function checkAll() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  if (isAllClicked) {
    checkboxes.forEach((box) => {
      box.checked = false;
    });
    isAllClicked = false;
  } else {
    checkboxes.forEach((box) => {
      box.checked = true;
    });
    isAllClicked = true;
  }
}

// 수량 증감 & 각 상품 총가격 계산 (상품 가격 * 수량) & 토탈 합계
const productPrice = document.querySelectorAll('.product-cost');

const decreaseButton = document.querySelectorAll('.decrease-button');
const increaseButton = document.querySelectorAll('.increase-button');
const quantity = document.querySelectorAll('.quantity');

const productTotalPrice = document.querySelectorAll('.product-total-price');
const cartTotalPrice = getNode('#cart-total-cost-number');

decreaseButton.forEach((button, idx) => {
  button.addEventListener('click', () => {
    if (Number(quantity[idx].value) === 1) {
      alert('최소 한 개는 있어야지요.');
    } else {
      quantity[idx].value -= 1;
      productTotalPrice[idx].innerText = Number(productPrice[idx].innerText) * Number(quantity[idx].value);
      cartTotalPrice.innerText = getTotalPrice();
    }
  });
});

increaseButton.forEach((button, idx) => {
  button.addEventListener('click', () => {
    quantity[idx].value = Number(quantity[idx].value) + 1;
    productTotalPrice[idx].innerText = Number(productPrice[idx].innerText) * Number(quantity[idx].value);
    cartTotalPrice.innerText = getTotalPrice();
  });
});

const getTotalPrice = () => {
  let price = 0;
  productTotalPrice.forEach((cur, idx) => {
    price += Number(cur.innerText);
  });

  return price;
};
