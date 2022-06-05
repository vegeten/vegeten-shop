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
const fileInput = getNode('.file-input');
const imgPriview = getNode('.img-preview');
const fileName = getNode('.file-name');
const cancelImg = getNode('.cancel-img');
const imgData = new FormData();
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

function deletePreviewImg() {
  imgPriview.src = '';
  fileName.innerHTML = '파일 이름';
  cancelImg.style.display = 'none';
  if (imgData.has('image')) imgData.delete('image');
}

function changeImageFile(e) {
  const imgName = e.target.files[0].name;
  imgData.append('image', e.target.files[0]);
  imgPriview.src = window.URL.createObjectURL(e.target.files[0]);
  fileName.innerHTML = imgName;
  cancelImg.style.display = 'block';

}

async function deleteReview(reviewId) {
  try {
    await Api.deleteYesToken('/api/reviews', reviewId);
    alert('리뷰가 삭제되었습니다.');
  } catch (err) {
    console.log(err.message);
    alert(err.message);
  } finally {
    window.location.reload();
  }
}

async function registerModReview(e, reviewId) {
  e.preventDefault();
  const score = e.target.querySelector('.draw-star').value;
  const comment = e.target.querySelector('.review-text').value;
  const image = await uploadImageToS3();

  try {
    const result = await Api.patchYesToken('/api/reviews', reviewId, {
      comment,
      image,
      score
    });
    alert(result.message);
    window.location.reload();
  } catch (err) {
    alert(err.message);
  }
}

function modReviewForm(target) {
  const reviewId = target.querySelector('.review-id').innerText;
  const score = target.querySelector('.review-score-value').innerText;
  const comment = target.querySelector('.content-review').innerText;
  const imgSrc = target.querySelector('.img-review').src;
  const newReviewBodyWrap = getNode('.new-review-body-wrap');
  newReviewBodyWrap.style.display = 'block';
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

async function uploadImageToS3() {
  if (!imgData.has('image')) return '';
  try {
    const uploadResult = await fetch('/api/images/upload', {
      method: 'POST',
      body: imgData,
    });

    const result = await uploadResult.json();
    return result.imagePath;
  } catch (err) {
    console.log(err.message);
  } finally {
    if (imgData.has('image')) imgData.delete('image');
  }

  return '';
}

async function registerNewReview(e) {
  e.preventDefault();
  const score = e.target.querySelector('.draw-star').value;
  const comment = e.target.querySelector('.review-text').value;
  const image = await uploadImageToS3();

  try {
    await Api.postYesToken(`/api/reviews/${productId}`, { comment, image, score });
    alert('리뷰가 등록되었습니다.');
  } catch (err) {
    alert(err.message);
  } finally {
    window.location.reload();
  }
}

function drawStarInput(e) {
  const starInput = getNode('.star-input span');
  starInput.style.width = `${e.target.value * 20}%`;
};

async function getProductReview() {
  try {
    let res = null;
    if (localStorage.getItem('accessToken')) {
      res = await fetch(`/api/reviews/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    } else {
      res = await fetch(`/api/reviews/product/${productId}`);
    }
    const result = await res.json();
    renderProductReview(result.data);
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
    imgPriview.src = '';
    fileName.innerHTML = '파일 이름';
    cancelImg.style.display = 'none';
    if (imgData.has('image')) imgData.delete('image');
  }
}

getProductDetail();
getProductReview();

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

function checkUser(userId, currentUserId) {
  return userId === currentUserId;
}

function checkUsersReview(userId, currentUserId) {
  const result = checkUser(userId, currentUserId);
  const buttonWrap = `
    <button class="button is-medium is-warning modify-button">수정</button>
    <button class="button is-medium is-danger delete-button">삭제</button>
  `;
  if (result) return buttonWrap;
  return '';
}

function createReviewBodyElement(review, currentUserId) {
  const { userId, fullName, comment, image, score, createdAt, shortId } = review;
  const scoreElement = createScoreElement(score);
  const modifyButton = checkUsersReview(userId, currentUserId);
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
      <span>${createdAt.substr(0, 10)}</span>
    </div>
    <div class="review-score-value">${score}</div>
    <div class="review-id">${shortId}</div>
  </div >
  <div class="review-content">
    <span class="content-review">${comment}</span>
  </div>
  <div class="review-image">
    <img class="img-review" src="${image}">
  </div>
  <div class="review-modify">
    ${modifyButton}
  </div>
  `;

  return form;
}

function createReviewScoreElement(count, averageScore) {
  return `
    <span class="review-score" > ${Number(averageScore).toFixed(1)} / 5.0</span>
    <span class="review-count">(${count}개의 후기)</span>
    `;
}

function renderProductReview(items) {
  if (!items.reviews.length) return;
  const reviewBodyWrap = getNode('.review-body-wrap');
  const reviewScoreWrap = getNode('.review-score-wrap');
  reviewBodyWrap.innerHTML = '';
  reviewScoreWrap.innerHTML = '';
  const reviewScore = createReviewScoreElement(items.reviews.length, items.averageScore);
  reviewScoreWrap.innerHTML = reviewScore;
  items.reviews.forEach(item => {
    const reviewBody = createReviewBodyElement(item, items.currentUserId);
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
  fileInput.addEventListener('change', changeImageFile);
  cancelImg.addEventListener('click', deletePreviewImg);
}

renderNav();
renderFooter();
addAllEvents();