import * as Api from '/api.js';
import { getNode } from '../useful-functions.js';
import { renderNav } from '../components/navigation.js';
import renderFooter from '../components/footer.js';

const searchInput = getNode('.search-input');
const searchButton = getNode('.search-button');
const categoryTitle = document.querySelector('.category-name');

function searchProducts(e) {
  e.preventDefault();
  const value = searchInput.value.trim();

  if (!value) return;

  getSearchResult(value);
}

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
    if (data.data[i].active === 'active') {
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
      if (categories[i].textContent === '전체보기') {
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
      showProducts(datas.data, e.target.id);
      searchInput.value = '';
    };
  }
}
// 페이지 네이션 함수
function renderPagination(currentPage, totalPage, categoryId, keyword) {
  //4 4
  // if(currentPage === totalPage) return
  var pageCount = 2;
  var pageGroup = Math.ceil(currentPage / pageCount); // 2

  var last = pageGroup * pageCount; //6
  if (last > totalPage) last = totalPage;
  var first = last - (pageCount - 1) <= 0 ? 1 : last - (pageCount - 1); //4
  var next = last + 1; //5
  var prev = first - 1; //1
  if (currentPage === totalPage) {
    first = last;
  }
  // debugger

  const fragmentPage = document.createDocumentFragment();
  // if (_totalCount <= 10) return;
  if (prev > 0) {
    var preli = document.createElement('li');
    preli.insertAdjacentHTML('beforeend', `<a class="pagination-link" id='prev'>&lt;</a>`);
    fragmentPage.appendChild(preli);
  }
  // console.log(first, last)
  // debugger
  for (let i = first; i <= last; i++) {
    const li = document.createElement('li');
    li.insertAdjacentHTML(
      'beforeend',
      `<a class="pageNum pagination-link" id=${i} aria-label="Goto page ${i}">${i}</a>`
    );
    fragmentPage.appendChild(li);
  }

  if (last < totalPage) {
    var endli = document.createElement('li');
    endli.insertAdjacentHTML('beforeend', `<a class="pagination-link" id='next'>&gt;</a>`);

    fragmentPage.appendChild(endli);
  }

  getNode('.pagination-list').appendChild(fragmentPage);

  // 페이지 목록 생성
  // debugger
  // const buttons = getNode('.pagination-list')
  const pageBtn = document.querySelectorAll('.pagination-link');
  // console.log(pageBtn)
  for (let j = 0; j < pageBtn.length; j++) {
    pageBtn[j].addEventListener('click', (e) => {
      console.log(e.target.getAttribute('id'));
      let idName = e.target.getAttribute('id');
      if (idName === 'next') {
        getNode('.pagination-list').innerHTML = '';
        renderPagination(next, totalPage);
        showProductByPage(next);
      } else if (idName === 'prev') {
        getNode('.pagination-list').innerHTML = '';
        renderPagination(1, totalPage);
        showProductByPage(1);
      }
    });
  }
  function showProductByPage(page) {
    if (categoryId === '검색') return getProductSearch(page, keyword);
    else if (categoryId !== '') return getProductCategory(page, categoryId);
    else return getProductAll(page);
  }
}
// 전체 상품조회하기 => 인자 api 통신을 받은 데이터, 카테고리명, 검색 키워드
function showProducts(data, categoryId = '', keyword = '', page = 1) {
  const productList = getNode('#product-list');
  productList.innerHTML = '';
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
  pagenationList.innerHTML = '';
  renderPagination(page, data.totalPage, categoryId, keyword);
  // for (let i = 1; i <= data.totalPage; i++) {
  //   pagenationList.innerHTML += `<li><a class="pagination-link" aria-label="Goto page ${i}">${i}</a></li>`;
  // }

  // 페이지 네이션 링크
  const pageNum = document.querySelectorAll('.pageNum');
  for (let i = 0; i < data.totalPage; i++) {
    // 전체보기가 아닐떄
    // 카테고리 id 값으로
    if (categoryId === '검색') {
      pageNum[i].addEventListener('click', (e) => {
        getProductSearch(e.target.getAttribute('id'), keyword);
      });
    } else if (categoryId !== '') {
      pageNum[i].addEventListener('click', (e) => {
        getProductCategory(e.target.getAttribute('id'), categoryId);
      });
    } else {
      pageNum[i].addEventListener('click', (e) => {
        getProductAll(e.target.getAttribute('id'));
      });
    }
  }
}

async function getProductSearch(page, keyword) {
  const datas = await fetch(`/api/search?keyword=${keyword}&page=${page}`);
  const data = await datas.json();
  showProducts(data.data, '검색', keyword, page);
}

// 카테고리별 상품목록 + 페이네이션 하기- Api.get 통신
async function getProductCategory(page, categoryName) {
  const datas = await fetch(`/api/categories/products/${categoryName}?page=${page}`);
  const data = await datas.json();
  showProducts(data.data, categoryName, '', page);
}
// 전체보기 상품목록 + 페이지네이션 - Api.get 통신
async function getProductAll(page) {
  const datas = await fetch(`/api/products?page=${page}`);
  const data = await datas.json();
  showProducts(data.data, '', '', page);
}

function addAllEvents() {
  searchButton.addEventListener('click', searchProducts);
}

renderNav();
renderFooter();
getProductAll(1);
addAllEvents();
