import * as Api from '/api.js';
import { getNode } from '../useful-functions.js';
import { renderNav } from '../components/nav.js';
import renderFooter from '../components/footer.js';


renderNav();
renderFooter();


// 카테고리 렌더링 - Api.get 통신
async function getCategoriesFromApi() {
  const data = await Api.get('/api/categories');
  // 카테고리 렌더링
  const categoryList = document.querySelector('#category-list');
  for (let i = 0; i < data.data.length; i++) {
    // 상품목록 - 왼쪽 nav바 렌더링/모달 
    categoryList.innerHTML += `<div class="category">${data.data[i].category}</div>`;
  }
  // 카테고리별로 상품보기 
  productByCategory();
}
getCategoriesFromApi();

// 카테고리 모달 렌더링 - Api.get 통신
async function getModalCategory() {
  const data = await Api.get('/api/categories');
  const categoryModalList = document.querySelector('.category-modal-list'); // 모달 카테고리 표
  for (let i = 0; i < data.data.length; i++) {
    // 모달창 카테고리 렌더링
    categoryModalList.innerHTML += `<tr><td class="categoryName" id="${data.data[i]._id}" name="categoryName">${data.data[i].category}</td>
    <td><button class="button is-warning edit-category-button">수정</button></td>
    <td><button class="button is-danger del-category-button">삭제</button></td>
    </tr>`;
  }
  // 카테고리 수정버튼 클릭스 input 태그로 변경하고 button 바꾸기 + 삭제하기
  const editCategoryBtn = document.querySelectorAll('.edit-category-button'); //수정하기 버튼
  const delCategoryBtn = document.querySelectorAll('.del-category-button'); // 삭제하기 버튼
  for (let i = 0; i < editCategoryBtn.length; i++) {
    editCategoryBtn[i].addEventListener("click",updateCategory);
    delCategoryBtn[i].addEventListener("click",delCategory);
  };

  // 카테고리 추가하기
  const addCategoryTrigger = getNode('.add-category-trigger');
  addCategoryTrigger.addEventListener("click", showAddCategoryForm);
};
getModalCategory();

// 카테고리 추가하기 Form
function showAddCategoryForm() {
  const addSection = getNode('#modal-editCategory footer');
  addSection.innerHTML = '<input type="text" class="input addCategoryName"><button class="button is-dark add-category-button">추가</button>';

  const addCategoryBtn = getNode('.add-category-button');
  addCategoryBtn.addEventListener("click", addCatgoryToApi);
}
// 카테고리 추가 - Api.post통신 
async function addCatgoryToApi() {
  const addCategoryName = getNode('.addCategoryName').value;  
  await Api.post('/api/categories', {category: addCategoryName});
  const categoryModalList = document.querySelector('.category-modal-list');
  categoryModalList.innerHTML="";
  getModalCategory();
  showAddCategoryForm();
}
// 카테고리 삭제 - Api.delete통신 
async function delCategory(e) {
  const categoryNode = e.target.parentNode.parentNode.firstChild;
  const categoryId = categoryNode.getAttribute('id'); 
  const categoryName = categoryNode.textContent;
  // console.log()
  await Api.delete('/api/categories', categoryId,{categoryName})
  const categoryModalList = document.querySelector('.category-modal-list');
  categoryModalList.innerHTML="";
  getModalCategory();
}
// 카테고리 수정
async function updateCategory(e) {
  const categoryNode = e.target.parentNode.parentNode.firstChild;
  const categoryId = categoryNode.getAttribute('id');
  // console.log('제목부분 찾아라~',categoryNode,categoryId)
  const btnClass = e.target.classList;
  if (btnClass.contains('is-warning')) { //수정버튼일때
    categoryNode.innerHTML = `<input type="text" value="${categoryNode.textContent}" class="input editName"></input>`;
    btnClass.remove('is-warning');
    btnClass.add('is-success');
    e.target.innerHTML = '저장';
  } else { //저장버튼일때 + 수정된 카테고리이름 API로 통신하기 
    btnClass.remove('is-success');
    btnClass.add('is-warning');
    const updatedName = getNode('.editName').value;
    categoryNode.innerHTML = updatedName;
    e.target.innerHTML = '수정';
    // console.log('categoryId',categoryId,updatedName);
    //API 통신
    try {
      await Api.patch('/api/categories',categoryId,{category:updatedName});
    } catch (error) {
      console.log(error.message);
    }
  }
}

// 카테고리별로 상품목록 조회하기 
async function productByCategory () {
  // 렌더링된 상품목록으로 title 변경하기 
  const categoryTitle = document.querySelector('.category-name');
  const categories = document.querySelectorAll('.category');
  for (let i = 0; i < categories.length; i++) {
    categories[i].onclick = async function () {
     if(categories[i].textContent === "전체보기") {
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
    const datas = await Api.get('/api/category',categoryName);
    showProductByCategory(datas.data)
    };
  }  
}

// 카테고리별 상품조회하기 => 인자 api 통신을 받은 데이터 
function showProductByCategory ( products ) {
  const productList = getNode('#product-list');
  productList.innerHTML = ""
  for(let i=products.length-1; i>=0; i--) {
    let price = products[i].price.toLocaleString();
    productList.innerHTML += `<div class="item-card">
    <a href="${products[i]._id}">
      <div class="img-box"><img src="${products[i].image}" alt=""></div>
      <div class="productName">${products[i].productName}</div>
      <div>${price}원</div>
    </a>
  </div>`
  }
}

// 상품목록 렌더링 - Api.get 통신
async function getProductFromApi () {
  const datas = await Api.get('/api/products');
  const products = datas.data;
  showProductByCategory(products)
}
getProductFromApi()


// 상품추가 모달
function addPostModal () {
  getOptionCategory();
  const addProductBtn = getNode('.addProductBtn');
  addProductBtn.addEventListener("click", postProductToApi);
}
addPostModal();
// 상품추가 - 카테고리 옵션 렌더링
async function getOptionCategory() {
  const data = await Api.get('/api/categories');
  const categoryOptions = getNode('.category-option'); // 모달 카테고리 표
  for (let i = 0; i < data.data.length; i++) {
    // 모달창 카테고리 렌더링
    if(i===0)categoryOptions.innerHTML += `<option selected>${data.data[i].category}</option>`;
    else categoryOptions.innerHTML += `<option>${data.data[i].category}</option>`;
  }
  // postProductToApi();
  // categoryOptions.addEventListener("change", ()=> {
  //   alert(categoryOptions.value)
  // })  
}
// 상품 추가하기 - Api.post 통신
async function postProductToApi () {
  
  const image = document.getElementsByName('image')[0].value;
  const detailImage = document.getElementsByName('detailImage')[0].value;
  const category = getNode('.category-option').value;
  const productName = document.getElementsByName('productName')[0].value;
  const description = document.getElementsByName('description')[0].value;
  const price = document.getElementsByName('price')[0].value;
  const company = document.getElementsByName('company')[0].value;
  const data = {
    image: image,
    detailImage : detailImage,
    category:category,
    productName: productName,
    description: description,
    price: price,
    company: company,
  }
  await Api.post('/api/products',data);
  location.reload();
}


// 닫기 아이콘 클릭시 모달창 비활성화
const editClose = getNode('#modal-editCategory button.delete'); //닫기버튼
editClose.onclick = () => {
  modalEditCategory.classList.remove('is-active');
  // 닫을때 창 새로고침하기? 
  // 초기화 어떻게 시킬까
  location.reload();
};

// 카테고리편집 모달창 활성화
// 카테고리편집 버튼 클릭시 -> 모달창 
const modalEditCategory = getNode('#modal-editCategory'); // 모달창 
getNode('.editCategory').onclick = () => {
  modalEditCategory.classList.add('is-active');
};


// 상품추가 모달창 활성화하기
const addProduct = getNode('.addProduct');
const modalAddProduct = getNode('.modal-addProduct');
const addProductClose = getNode('.modal-addProduct button.delete');
// 상품추가 버튼 클릭시 활성화
addProduct.addEventListener('click', () => {
  modalAddProduct.classList.add('is-active');
});
// 닫기버튼 클릭시 비활성화
addProductClose.addEventListener('click', () => {
  modalAddProduct.classList.remove('is-active');
});



