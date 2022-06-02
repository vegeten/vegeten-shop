import * as Api from '/api.js';
import { getNode } from '../useful-functions.js';
import { renderNav } from '../components/nav.js';
import renderFooter from '../components/footer.js';

const searchInput = getNode('.search-input');
const searchButton = getNode('.search-button');
const categoryTitle = document.querySelector('.category-name');

function searchProducts(e) {
  e.preventDefault();
  const value = searchInput.value;

  if (!value) return;

  getSearchResult(value);
};

function productBySearchResult(target, count) {
  if (count) categoryTitle.innerHTML = `'${target}'에 대한 ${count}건의 검색 결과`;
  else categoryTitle.innerHTML = `'${target}'에 대한 검색 결과가 없습니다.`;
}

async function getSearchResult(target) {
  try {
    const datas = await fetch(`/api/search?keyword=${target}`);
    const data = await datas.json();
    showProducts(data.data, '검색', target);
    productBySearchResult(target, data.data.productCount);
  } catch (err) {
    console.log(err.message);
  }
}

// 카테고리 렌더링 - Api.get 통신
async function getCategoriesFromApi() {
  const data = await Api.getNoToken('/api/categories');
  // 카테고리 렌더링
  const categoryList = document.querySelector('#category-list');
  for (let i = 0; i < data.data.length; i++) {
    // 상품목록 - 왼쪽 nav바 렌더링/모달 
    if(data.data[i].active === 'active') {
      categoryList.innerHTML += `<div class="category" id="${data.data[i]._id}">${data.data[i].label}</div>`;
    }
  }
  // 카테고리별로 상품제목 바꾸기 
  productByCategory();
}
getCategoriesFromApi();

// 카테고리별로 제목 바꾸기
async function productByCategory() {
  // 렌더링된 상품목록으로 title 변경하기 
  const categories = document.querySelectorAll('.category');
  for (let i = 0; i < categories.length; i++) {
    categories[i].onclick = async function (e) {
      if (categories[i].textContent === "전체보기") {
        location.reload();
      }
      let categoryName = categories[i].textContent;
      if (!categories[i].classList.contains('active')) {
        categories.forEach((ele) => ele.classList.remove('active'));
        categories[i].classList.add('active');
        // 클릭한 카테고리별로 제목 바꿔주기
        categoryTitle.innerHTML = categoryName;
      }

      // 카테고리별 상품조회 api
      const datas = await Api.getNoToken('/api/categories/products', e.target.id);
      console.log('확인확인',e.target, datas)
      showProducts(datas.data, e.target.id);
      searchInput.value = '';
    };
  }
}
// 전체 상품조회하기 => 인자 api 통신을 받은 데이터, 카테고리명, 검색 키워드
function showProducts(data, categoryId = '', keyword = '') {
  const productList = getNode('#product-list');
  productList.innerHTML = "";
  data.products.map((product) => {
    let price = product.price.toLocaleString();
    productList.innerHTML += `<div class="item-card">
      <a href="${product.shortId}">
        <div class="img-box"><img src="${product.image}" alt=""></div>
        <div class="productName">${product.productName}</div>
        <div>${price}원</div>
      </a>
    </div>`;
  });
  // 페이지네이션 
  const pagenationList = getNode('.pagination-list');
  pagenationList.innerHTML = "";
  for (let i = 1; i <= data.totalPage; i++) {
    pagenationList.innerHTML += `<li><a class="pagination-link" aria-label="Goto page ${i}">${i}</a></li>`;
  }
  // 페이지 네이션 링크 
  const pagenationLink = document.querySelectorAll('.pagination-link');
  for (let i = 0; i < data.totalPage; i++) {
    // 전체보기가 아닐떄 
    // 카테고리 id 값으로 
    if (categoryId === '검색') {
      pagenationLink[i].addEventListener("click", () => {
        getProductSearch(i + 1, keyword);
      });
    } else if (categoryId !== '') {
      pagenationLink[i].addEventListener("click", () => {
        getProductCategory(i + 1, categoryId);
      });
    } else {
      pagenationLink[i].addEventListener("click", () => {
        getProductAll(i + 1);
      });
    }
  }
}

async function getProductSearch(page, keyword) {
  const datas = await fetch(`/api/search?keyword=${keyword}&page=${page}`);
  const data = await datas.json();
  showProducts(data.data, '검색', keyword);
}

// 카테고리별 상품목록 + 페이네이션 하기- Api.get 통신
async function getProductCategory(page, categoryName) {
  const datas = await fetch(`/api/categories/products/${categoryName}?page=${page}`);
  const data = await datas.json();
  showProducts(data.data, categoryName);
}
// 전체보기 상품목록 + 페이지네이션 - Api.get 통신
async function getProductAll(page) {
  const datas = await fetch(`/api/products?page=${page}`);
  const data = await datas.json();
  const activeData = data.data.products.filter(ele => ele.categoryId !== null);
  showProducts(activeData);
}

function addAllEvents() {
  searchButton.addEventListener('click', searchProducts);
}

renderNav();
renderFooter();
getProductAll(1);
addAllEvents();