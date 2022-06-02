import * as Api from '/api.js';
import { convertToNumber, addCommas } from '../../useful-functions.js';
import { getNode } from '../../useful-functions.js';
import { renderNav } from '../../components/nav.js';
import renderFooter from '../../components/footer.js';

const newReview = getNode('.new-review');
const cancelReviewButton = getNode('.cancel-button');
const drawStar = getNode('.draw-star');
const newReviewForm = getNode('.new-review-form');
const reviewBodyWrap = getNode('.review-body-wrap');
// url 주소로 현재 상품 id 알아내기 
const productUrl = window.location.href.split('/');
const productId = productUrl[productUrl.length - 2];
// 상품상세 렌더링
async function getProductDetail() {
  const datas = await Api.getNoToken('/api/products', productId);
  getNode('#productId').name = datas.data._id;
  getNode('#image').src = datas.data.image;
  getNode('#detailImage').src = datas.data.detailImage;
  getNode('#productName').innerHTML = datas.data.productName;
  getNode('#company').innerHTML = datas.data.company;
  getNode('#price').innerHTML = addCommas(datas.data.price) + ' 원';
  getNode('#totalPrice').innerHTML = addCommas(datas.data.price) + ' 원';
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

async function deleteReview(reviewId) {
  console.log('delete: ', reviewId);
}

async function registerModReview(e, reviewId) {
  e.preventDefault();
  console.log(e.target);
  console.log(reviewId);
  const score = e.target.querySelector('.draw-star').value;
  const comment = e.target.querySelector('.review-text').value;
  const imgSrc = e.target.querySelector('.file-name').value || '';
  console.log(score);
  console.log(comment);
  console.log(imgSrc);
}

function modReviewForm(target) {
  const reviewId = target.querySelector('.review-id').innerText;
  const score = target.querySelector('.review-score').innerText;
  const comment = target.querySelector('.content-review').innerText;
  const imgSrc = target.querySelector('.img-review').src;

  target.style.display = 'none';
  const newReviewBodyWrap = getNode('.new-review-body-wrap');
  newReviewBodyWrap.style.display = 'block';
  console.log(newReviewBodyWrap.querySelector('.draw-star').value);
  newReviewBodyWrap.querySelector('.draw-star').value = score;
  newReviewBodyWrap.querySelector('.star-input span').style.width = `${score * 20}%`;
  newReviewBodyWrap.querySelector('.review-text').innerText = comment;
  newReviewBodyWrap.querySelector('.file-name').innerText = imgSrc;
  getNode('.new-review-form').removeEventListener('submit', registerNewReview);
  getNode('.new-review-form').addEventListener('submit', (e) => registerModReview(e, reviewId));

  newReviewBodyWrap.querySelector('.review-text').focus();
}

function getReviewButton(e) {
  e.preventDefault();
  if (e.target.classList.contains('modify-button')) {
    modReviewForm(e.target.parentNode.parentNode);
  } else if (e.target.classList.contains('delete-button')) {
    const reviewId = e.target.parentNode.parentNode.querySelector('.review-id').innerHTML;
    deleteReview(reviewId);
  } else return;
}

function registerNewReview(e) {
  e.preventDefault();
  const score = e.target.querySelector('.draw-star').value;
  const comment = e.target.querySelector('.review-text').value;
  const image = e.target.querySelector('.file-name').value || '';

}

function drawStarInput(e) {
  const starInput = getNode('.star-input span');
  starInput.style.width = `${e.target.value * 20}%`;
};

async function getProductReview(productId) {
  const mockAPI = {
    totalCount: '5',
    totalScore: '4',
    datas: [{
      shortId: '리뷰 id1',
      userId: 'O692dcKq',
      fullName: '김정현',
      productId: 'IJS5rsAv',
      comment: '너무 좋네요?',
      image: 'https://picsum.photos/200/200',
      score: '3',
      createdAt: '2022-05-27',
    },
    {
      shortId: '리뷰 id2',
      userId: 'O692d999',
      fullName: '정유진',
      productId: 'IJS5rsAv',
      comment: '더 좋네요?',
      image: 'https://picsum.photos/200/200',
      score: '5',
      createdAt: '2022-05-28',
    },
    {
      shortId: '리뷰 id3',
      userId: 'O692dcKq',
      fullName: '김정현',
      productId: 'IJS5rsAv',
      comment: '진짜로 좋네요?',
      image: 'https://picsum.photos/200/200',
      score: '5',
      createdAt: '2022-05-29',
    },
    {
      shortId: '리뷰 id4',
      userId: 'O692239',
      fullName: '나혜지',
      productId: 'IJS5rsAv',
      comment: '완전히 좋네요?',
      image: 'https://picsum.photos/200/200',
      score: '4',
      createdAt: '2022-05-30',
    },
    {
      shortId: '리뷰 id5',
      userId: 'O622239',
      fullName: '경지윤',
      productId: 'IJS5rsAv',
      comment: '그냥 좋네요?',
      image: 'https://picsum.photos/200/200',
      score: '3',
      createdAt: '2022-06-01',
    }
    ]
  };
  renderProductReview(mockAPI);
  try {

  } catch (err) {
    console.log(err.message);
  }
}

function onToggleReview(e) {
  e.preventDefault();
  const newReviewBodyWrap = getNode('.new-review-body-wrap');

  if (e.target.classList.contains('new-review')) {
    newReviewBodyWrap.style.display = 'block';
    newReview.style.display = 'none';
  }
  else {
    newReviewBodyWrap.style.display = 'none';
    newReview.style.display = 'block';
  }
}

getProductDetail();
getProductReview(productId);

function createScoreElement(score) {
  const max = 5;
  const stars = [];
  for (let i = 0; i < max; i++) {
    if (i < score) {
      stars.push(`
        <span class="material-icons star">
          star
        </span>
      `);
    } else {
      stars.push(`
        <span class="material-icons star">
          star_border
        </span>
      `);
    }
  }
  return stars.join('');
}

function checkUser(userId) {
  return userId === 'O692dcKq';
}

function checkUsersReview(userId) {
  const result = checkUser(userId);
  const buttonWrap = `
    <button class="button is-small is-warning modify-button">수정</button>
    <button class="button is-small is-danger delete-button">삭제</button>
  `;
  if (result) return buttonWrap;
  return '';
}

function createReviewBodyElement(review) {
  const { userId, fullName, comment, image, score, createdAt, shortId } = review;
  const scoreElement = createScoreElement(score);
  const modifyButton = checkUsersReview(userId);
  const form = document.createElement('form');

  form.classList = 'review-body card';
  form.innerHTML = `
  <div class="review-info">
    <div class="info-score">
      ${scoreElement}
    </div>
    <div class="info-username">
      <span>${fullName[0]} * *</span>
    </div>
    <div class="info-date">
      <span>${createdAt}</span>
    </div>
    <div class="review-score">${score}</div>
    <div class="review-id">${shortId}</div>
  </div >
  <div class="review-content">
    <span class="content-review">${comment}</span>
  </div>
  <div class="review-image">
    <img class="img-review" src="${image}" width="80px">
  </div>
  <div class="review-modify">
    ${modifyButton}
  </div>
  `;

  return form;
}

function createReviewScoreElement(count, totalScore) {
  return `
    <span class="review-score" > ${totalScore} / 5</span>
    <span class="review-count">(${count}개의 후기)</span>
    `;
}

function renderProductReview(items) {
  if (!items.datas.length) return;
  const reviewBodyWrap = getNode('.review-body-wrap');
  const reviewScoreWrap = getNode('.review-score-wrap');
  reviewBodyWrap.innerHTML = '';
  reviewScoreWrap.innerHTML = '';
  const reviewScore = createReviewScoreElement(items.totalCount, items.totalScore);
  reviewScoreWrap.innerHTML = reviewScore;
  items.datas.forEach(item => {
    const reviewBody = createReviewBodyElement(item);
    reviewBodyWrap.appendChild(reviewBody);
  });
}

// 장바구니 버튼 클릭 
const addCartBtn = getNode('.addCart');
addCartBtn.addEventListener("click", addToCart);
// 장바구니 클릭시 로컬스토리지에 데이터 저장하기 
function addToCart() {
  // 중복 상품 => 체크해서 수량만 증가시키기 
  // 로컬스토리지에 배열 형태로 담기
  let existCartEntry = JSON.parse(localStorage.getItem('cart'));
  if (existCartEntry === null) {
    existCartEntry = [];
  }
  const selections = getNode('#total-count'); // select 드롭박스
  const selected = Number(selections.value.replace('개', ''));
  const cartEntry = {
    check: false,
    count: selected,
    image: getNode('#image').src,
    price: convertToNumber(getNode('#price').textContent),
    productName: getNode('#productName').textContent,
    productId: getNode('#productId').name,
  };
  let check = true;
  //예외 처리 : 똑같은 품목 있다면 수량만 넣어주기 
  for (let i = 0; i < existCartEntry.length; i++) {
    if (existCartEntry[i].productId === cartEntry.productId) {
      existCartEntry[i].count += selected;
      localStorage.setItem('cart', JSON.stringify(existCartEntry));
      check = false;
    }
  }
  if (check) {
    existCartEntry.push(cartEntry);
    // 'cart' 라는 key값에 넣어주기 
    localStorage.setItem('cart', JSON.stringify(existCartEntry));
  }
  // 장바구니 담기 확인 모달창 띄우기
  getNode('#cart-modal').classList.add('is-active');
}
// 장바구니 이동시 모달창 바로 비활성화하기 
const moveCartBtn = getNode('.moveCart');
moveCartBtn.addEventListener("click", () => {
  getNode('#cart-modal').classList.remove('is-active');
});
//구매하기 버튼 클릭
const buyProductBtn = getNode('.buyProduct');
buyProductBtn.addEventListener("click", buyProduct);

function buyProduct() {

  const selections = getNode('#total-count'); // select 드롭박스
  const selected = Number(selections.value.replace('개', ''));
  const cartEntry = {
    count: selected,
    productId: getNode('#productId').name,
  };
  // 'cart' 라는 key값에 넣어주기 
  localStorage.setItem('buy', JSON.stringify(cartEntry));
};
function addAllEvents() {
  newReview.addEventListener('click', onToggleReview);
  cancelReviewButton.addEventListener('click', onToggleReview);
  drawStar.addEventListener('input', drawStarInput);
  newReviewForm.addEventListener('submit', registerNewReview);
  reviewBodyWrap.addEventListener('click', getReviewButton);
}

renderNav();
renderFooter();
addAllEvents();