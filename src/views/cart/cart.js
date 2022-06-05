import renderFooter from '../components/footer.js';
import { renderNav } from '../components/nav.js';
import { getNode, addCommas, getCookie } from '../useful-functions.js';

renderNav();
renderFooter();

// 로컬스토리지에 있는 장바구니 가져오기
let cartList = JSON.parse(localStorage.getItem('cart'));

// 로컬스토리지의 장바구니 값들 화면에 뿌려주기
const productsContainer = getNode('#products-container');

const cartListMarkUp = (cartList) => {
  // 장바구니에 상품이 있을 경우
  let markUp = '';
  if (cartList !== null && cartList.length !== 0) {
    cartList.forEach((product) => {
      markUp += `
      <div class="cart-element">
        <div class="left">
          <div class="checkbox-wrap">
            <input type="checkbox" class="checkbox" value="${product.productId}" />
          </div>
          <a href="/shop/${product.productId}">
            <div class="product-info">
              <div class="product-image-wrap">
                <img src="${product.image}" alt="상품 사진"/>
              </div>
              <div class="product-description">
                <span class="product-name">${product.productName}</span>
                <span class="product-cost">${addCommas(product.price)}원</span>
              </div>
            </div>
          </a>
        </div>
        <div class="product-quantity">
          <span class="subTitle">수량</span>
          <div class="counter-wrap">
            <button class="decrease-button count counter-button">-</button>
            <input class="quantity count quantity-count" type="number" value="${product.count}" disabled/>
            <button class="increase-button count counter-button">+</button>
          </div>
        </div>
        <div class="product-total-price-wrap">
          <span class="subTitle">가격</span>
          <span class="product-total-price">${addCommas(product.price * product.count)}원</span>
        </div>
      </div>`;
    });
  } else {
    // 장바구니가 비었을 때
    markUp += `<div id="empty-cart">장바구니가 비어있습니다.</div>`;
    getNode('#bottom').style.display = 'none';
    getNode('#top-buttons').style.display = 'none';
  }
  productsContainer.innerHTML = markUp;
};
cartListMarkUp(cartList);

// 전체 선택
const allCheckButton = getNode('#all-check');
let isAllClicked = false;
allCheckButton.addEventListener('click', checkAll);
let checkboxes = document.querySelectorAll('input[type="checkbox"]');

function checkAll() {
  checkboxes = document.querySelectorAll('input[type="checkbox"]');
  if (isAllClicked) {
    checkboxes.forEach((box) => (box.checked = false));
    isAllClicked = false;
  } else {
    checkboxes.forEach((box) => (box.checked = true));
    isAllClicked = true;
  }
}

// 수량 증감 & 각 상품 총가격 계산 (상품 가격 * 수량)
const cartTotalPrice = getNode('#cart-total-cost-number');
const decreaseButton = document.querySelectorAll('.decrease-button');
const increaseButton = document.querySelectorAll('.increase-button');
const quantity = document.querySelectorAll('.quantity');
const productTotalPrice = document.querySelectorAll('.product-total-price');

decreaseButton.forEach((button, idx) => {
  button.addEventListener('click', () => {
    if (cartList[idx].count === 1) {
      alert('최소 한 개는 있어야합니다!');
    } else {
      cartList[idx].count -= 1;
      quantity[idx].value = cartList[idx].count;
      localStorage.setItem('cart', JSON.stringify(cartList));
      productTotalPrice[idx].innerText = `${addCommas(cartList[idx].price * cartList[idx].count)}원`;
      cartTotalPrice.innerText = `${addCommas(getTotalPrice(cartList))}원`;
    }
  });
});

increaseButton.forEach((button, idx) => {
  button.addEventListener('click', () => {
    if (cartList[idx].count === 10) {
      alert('최대 10개까지 주문할 수 있습니다.');
    } else {
      cartList[idx].count += 1;
      quantity[idx].value = cartList[idx].count;
      localStorage.setItem('cart', JSON.stringify(cartList));
      productTotalPrice[idx].innerText = `${addCommas(cartList[idx].price * cartList[idx].count)}원`;
      cartTotalPrice.innerText = `${addCommas(getTotalPrice(cartList))}원`;
    }
  });
});

// 합계 계산
const getTotalPrice = (cartList) => {
  if (cartList.length) {
    const price = cartList.reduce((acc, cur) => acc + cur.price * cur.count, 0);
    return price;
  } else {
    return 0;
  }
};
cartTotalPrice.innerText = `${addCommas(getTotalPrice(cartList))}원`;

// 삭제
const deleteBtn = getNode('#all-delete');
deleteBtn.addEventListener('click', deleteHandler);

// 코치님 말씀대로 수정해본 코드
function deleteHandler() {
  const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
  if (checkedCount) {
    if (window.confirm('해당 상품을 삭제하시겠습니까?')) {
      cartList = JSON.parse(localStorage.getItem('cart'));
      const checked = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(({ value }) => value);

      const newCartList = cartList.filter(({ productId }) => checked.indexOf(productId) === -1);
      localStorage.setItem('cart', JSON.stringify(newCartList));
      cartListMarkUp(newCartList);
      cartTotalPrice.innerText = `${addCommas(getTotalPrice(cartList))}원`;
      window.location.reload();
    }
  } else {
    alert('선택된 상품이 없습니다');
  }
}

// 로그인 안했으면 주문하기 버튼 클릭 시 로그인 페이지로 유도
const payButton = getNode('#pay-button-aTag');
function clickPayButotn() {
  const token = getCookie('refreshToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    payButton.href = '/login';
  }
}

payButton.addEventListener('click', clickPayButotn);
