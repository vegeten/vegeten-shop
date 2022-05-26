
// import * as Api from '/api.js';
import { getNode } from '../useful-functions.js';
import renderNav from '../components/nav.js';
import renderFooter from '../components/footer.js';

const mockUserAPI = {
  email: 'test@test.com',
  fullName: '김정현',
  password: '12341234',
  phoneNumber: '010-5628-9304',
  address: {
    postalCode: '1234',
    address1: '마포구 합정동',
    address2: '123-123',
  },
  role: 'basic-user',
};
renderNav(mockUserAPI.role === 'basic-user' ? false : true);
renderFooter();
const mocCategoryAPI = [
  {category: "outer"},
  {category: "상의"},
  {category: "하의"},
  {category: "신발&가방"},
  {category: "Accesory"},
];

// 카테고리 렌더링
const categoryList = document.querySelector('#category-list');
const categoryModalList = document.querySelector('.category-modal-list');
const categoryTitle = document.querySelector('.category-name');
// 상품목록 - 왼쪽 nav바 렌더링/모달 
for(let i=0; i<mocCategoryAPI.length; i++){
  categoryList.innerHTML += `<div class="category">${mocCategoryAPI[i].category}</div>`;
}
function renderCategory() {
  for(let i=0; i<mocCategoryAPI.length; i++){
    categoryModalList.innerHTML +=  `<tr>
    <td class="categoryName ${mocCategoryAPI[i].category}" name="categoryName">${mocCategoryAPI[i].category}</td>
    <td><button class="button is-warning edit-category-button">수정</button></td>
    <td><button class="button is-danger del-category-button">삭제</button></td>
  </tr>`;
  }
}
renderCategory()


// 카테고리 클릭시 상단 title 변경하기
const categories = document.querySelectorAll('.category');
for (let i = 0; i < categories.length; i++) {
  categories[i].onclick = function () {
    if (!categories[i].classList.contains('active')) {
      categories.forEach((ele) => ele.classList.remove('active'));
      categories[i].classList.add('active');
      // 클릭한 카테고리별로 제목 바꿔주기
      categoryTitle.innerHTML = categories[i].textContent;
    }
  };
}
// 카테고리편집 모달창 활성화
const modalEditCategory = getNode('#modal-editCategory');
const editClose = getNode('#modal-editCategory button.delete');
const editCategoryBtn = document.querySelectorAll('.edit-category-button');
const delCategoryBtn = document.querySelectorAll('.del-category-button')
getNode('.editCategory').onclick = () => {
  modalEditCategory.classList.add('is-active');
};
editClose.onclick = () => {
  modalEditCategory.classList.remove('is-active');
  // 닫을때 창 새로고침하기? 
  // 초기화 어떻게 시킬까
};
// 카테고리 수정버튼 클릭스 input 태그로 변경하고 button 바꾸기 
for(let i=0; i<editCategoryBtn.length; i++) {
  editCategoryBtn[i].onclick = (e) => {
    const categoryNode = document.querySelectorAll('.categoryName')[i];
    const btnClasses = editCategoryBtn[i].classList;
    if(btnClasses.contains('is-warning')) { //수정버튼일때
      categoryNode.innerHTML = `<input type="text" value="${categoryNode.textContent}" class="input editName"></input>`;
      btnClasses.remove('is-warning');
      btnClasses.add('is-success');
      editCategoryBtn[i].innerHTML = '저장';
    } else { //저장버튼일때 
      btnClasses.remove('is-success');
      btnClasses.add('is-warning');
      categoryNode.innerHTML = getNode('.editName').value;
    }
  }
}



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

// 파일업로드
const fileInput = document.querySelector('#file-main input[type=file]');
const subFileInput = document.querySelector('#file-sub input[type=file]');
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector('#file-main .file-name');
    fileName.textContent = fileInput.files[0].name;
  }
};
subFileInput.onchange = () => {
  if (subFileInput.files.length > 0) {
    const fileName = document.querySelector('#file-sub .file-name');
    fileName.textContent = subFileInput.files[0].name;
  }
};

// async function getDataItems() {
//   const data =await Api.get('/api/shop/list');

// }

