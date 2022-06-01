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
  const datas = await Api.getYesToken('/api/products',productId);
  getNode('#productId').name = datas.data._id;
  getNode('#image').src = datas.data.image;
  getNode('#detailImage').src = datas.data.detailImage;
  getNode('#productName').innerHTML = datas.data.productName;
  getNode('#company').innerHTML = datas.data.company;
  getNode('#price').innerHTML = addCommas(datas.data.price)+' 원';
  getNode('#totalPrice').innerHTML = addCommas(datas.data.price)+' 원';
  getNode('#description').innerHTML = datas.data.description;
  
  // 선택한 수량에 따른 총액 계산하기
  const selections = getNode('#total-count'); // select 드롭박스
  const selected = selections.value.replace('개', '');
  const totalPrice = getNode('#totalPrice'); // 총가격 
  getNode('.buyProduct').href = `/order?product=${datas.data.shortId}&amount=${selected}`;
  selections.addEventListener("change", () => { // 선택이 바뀔때마다 총액 계산하기
    const selected = selections.value.replace('개', '');
    const price = convertToNumber(getNode('#price').textContent);
    totalPrice.innerHTML = (selected * price).toLocaleString() + ' 원';
    //구매하기 버튼에 링크
    getNode('.buyProduct').href = `/order?product=${datas.data.shortId}&amount=${selected}`;
  });
}
getProductDetail();



// 장바구니 버튼 클릭 
const addCartBtn = getNode('.addCart');
addCartBtn.addEventListener("click", addToCart)
// 장바구니 클릭시 로컬스토리지에 데이터 저장하기 
function addToCart() {
  // 중복 상품 => 체크해서 수량만 증가시키기 
  // 로컬스토리지에 배열 형태로 담기
  let existCartEntry = JSON.parse(localStorage.getItem('cart'));
  if(existCartEntry === null) {
    existCartEntry = [];
  } 
  const selections = getNode('#total-count'); // select 드롭박스
  const selected = Number(selections.value.replace('개', ''));
  const cartEntry = {
    check: false,
    count : selected,
    image : getNode('#image').src,
    price : convertToNumber(getNode('#price').textContent),
    productName : getNode('#productName').textContent,
    productId : getNode('#productId').name,
  }
  let check = true;
  //예외 처리 : 똑같은 품목 있다면 수량만 넣어주기 
  for(let i=0; i<existCartEntry.length; i++) {
    if(existCartEntry[i].productId === cartEntry.productId) {
      existCartEntry[i].count += selected;
      localStorage.setItem('cart', JSON.stringify(existCartEntry));
      check = false;
    }
  }
  if(check) {
    existCartEntry.push(cartEntry);
    // 'cart' 라는 key값에 넣어주기 
    localStorage.setItem('cart', JSON.stringify(existCartEntry));
  }
  // 장바구니 담기 확인 모달창 띄우기
  getNode('#cart-modal').classList.add('is-active');
}
// 장바구니 이동시 모달창 바로 비활성화하기 
const moveCartBtn = getNode('.moveCart');
moveCartBtn.addEventListener("click", ()=> {
  getNode('#cart-modal').classList.remove('is-active');
})
//구매하기 버튼 클릭
const buyProductBtn = getNode('.buyProduct');
buyProductBtn.addEventListener("click", buyProduct)

function buyProduct () {
  
  const selections = getNode('#total-count'); // select 드롭박스
  const selected = Number(selections.value.replace('개', ''));
  console.log("갯수!!",selected);
  const cartEntry = {
    count : selected,
    productId : getNode('#productId').name,
  }
    // 'cart' 라는 key값에 넣어주기 
    localStorage.setItem('buy', JSON.stringify(cartEntry));
    
}

//
// 상품수정하기 

