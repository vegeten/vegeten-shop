import * as Api from '/api.js';
import {convertToNumber,addCommas} from '../../useful-functions.js'
import { getNode } from '../../useful-functions.js';
import { renderNav } from '../../components/nav.js';
import renderFooter from '../../components/footer.js';
renderNav();
renderFooter();


// url 주소로 현재 상품 id 알아내기 
const productUrl = window.location.href.split('/');
const productId = productUrl[productUrl.length-2];
// 상품상세 렌더링
async function getProductDetail () {
  const datas = await Api.get('/api/products',productId);
  console.log(datas.data);
  getNode('#productId').name = datas.data._id;
  getNode('#image').src = datas.data.image;
  getNode('#detailImage').src = datas.data.detailImage;
  getNode('#productName').innerHTML = datas.data.productName;
  getNode('#company').innerHTML = datas.data.company;
  getNode('#price').innerHTML = addCommas(datas.data.price)+' 원';
  getNode('#totalPrice').innerHTML = addCommas(datas.data.price)+' 원';
  getNode('#description').innerHTML = datas.data.description;
}
getProductDetail();


// 선택한 수량에 따른 총액 계산하기
const selections = getNode('#total-count'); // select 드롭박스
const totalPrice = getNode('#totalPrice'); // 총가격 
selections.addEventListener("change", () => { // 선택이 바뀔때마다 총액 계산하기
  const selected = selections.value.replace('개', '');
  const price = convertToNumber(getNode('#price').textContent);
  totalPrice.innerHTML = (selected * price).toLocaleString() + ' 원';
});

// 장바구니 버튼 클릭 
const addCartBtn = getNode('.addCart');
addCartBtn.addEventListener("click", addToCart)
// 장바구니 클릭시 로컬스토리지에 데이터 저장하기 
function addToCart() {
  // 로컬스토리지에 배열 형태로 담기
  let existCartEntry = JSON.parse(localStorage.getItem('cart'));
  if(existCartEntry === null) {
    existCartEntry = [];
  }
  const selected = Number(selections.value.replace('개', ''));
  const cartEntry = {
    check: false,
    count : selected,
    image : getNode('#image').src,
    price : convertToNumber(getNode('#totalPrice').textContent),
    productName : getNode('#productName').textContent,
    productId : getNode('#productId').name,
  }
  existCartEntry.push(cartEntry);
  // 'cart' 라는 key값에 넣어주기 
  localStorage.setItem('cart', JSON.stringify(existCartEntry));
  // 장바구니 담기 확인 모달창 띄우기
  getNode('#cart-modal').classList.add('is-active');
}

//구매하기 버튼 클릭


