import { addCommas, getNode } from '../useful-functions.js';
import * as Api from '/api.js';

const orderList = getNode('.order-list');
const modal = getNode('.modal');
const modalButton = getNode('.close-button');
const orderlistWrap = getNode('.orderlist-wrap');
const modalBody = getNode('.modal-card-body');

const createOrderDetail = (products) => {
  return products.map(product => {
    return `
    <tbody>
      <td><img class="order-img" src=${product.productImg} alt="상품 이미지"></td>
      <td>${product.productName}</td>
      <td>${product.count}</td>
      <td>${product.productPrice}</td>
    </tbody>
    `;
  }).join('');
};

const createOrderModal = (item) => {
  const { shortId, userId, address, products, phoneNumber, totalPrice, createdAt } = item;
  let orderDetail = '';

  if (!products.length) orderDetail = createOrderDetail([products]);
  else orderDetail = createOrderDetail(products);

  return `
  <div class="body-wrap">
          <div class="order-detail-info">
            <span class="info-order-number">No. <strong>${shortId}</strong></span>
            <span class="info-order-date">${createdAt.substr(0, 10)}</span>
          </div>
          <div class="order-detail-list">
            <table class="table is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>이미지</th>
                  <th>상품명</th>
                  <th>수량</th>
                  <th>금액</th>
                </tr>
              </thead>
              ${orderDetail}
            </table>
          </div>
          <hr>
          <div class="order-detail-user-info">
            <ul>
              <li><strong>배송지</strong></li>
              <li><strong>주문자명</strong></li>
              <li><strong>전화번호</strong></li>
            </ul>
            <ul>
              <li>${address.postalCode + ' ' + address.address1 + ' ' + address.address2}</li>
              <li>${userId}</li>
              <li>${phoneNumber}</li>
            </ul>
          </div>
          <hr>
          <div class="order-detail-account">
            <button class="button is-danger is-small order-delete-button">주문 삭제</button>
            <span><strong>총 주문금액: ${addCommas(totalPrice)}</strong></span>
          </div>
        </div>
  `;
};

const onDeleteOrder = async (e) => {
  e.preventDefault();


  const ok = window.confirm('주문 내역을 정말 삭제하시겠습니까?');
  if (!ok) return;

  try {
    const orderId = e.target.parentNode.parentNode.querySelector('.info-order-number strong').innerText;
    console.log(orderId);
    await Api.delete('/api/orders', orderId);
    alert('주문 내역이 삭제되었습니다.');
    window.location.reload();
  } catch (err) {
    console.log(err.message);
  }
};

const addOrderDeleteEvent = () => {
  getNode('.order-delete-button').addEventListener('click', onDeleteOrder);
};

const renderOrderModal = (item) => {
  modalBody.innerHTML = createOrderModal(item);
  addOrderDeleteEvent();
};

const viewDetailModal = (e) => {
  if (!e.target.classList.contains('open-modal')) return;
  const orderId = e.target.parentNode.parentNode.parentNode.querySelector('.ordershortId').innerText;
  const orderDate = getNode('.order_date').innerText;
  modalBody.innerHTML = '';
  getOrderDetail(orderId, orderDate);
  modal.classList.add('is-active');
};

const closeModal = () => {
  modal.classList.remove('is-active');
};

function addAllEvents() {
  modalButton.addEventListener('click', closeModal);
  orderList.addEventListener('click', viewDetailModal);
}

const createOrderListElement = (item) => {
  const {
    shortId, products, createdAt
  } = item;

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <th class="ordershortId">${shortId}</th>
    <td>${products.length ?? '1'} 건의 주문내역</td>
    <td class="order_date">${createdAt.substr(0, 10)}</td>
    <td>
    <a class="order-detail-button">
        <span class="material-icons open-modal">
          open_in_full
        </span>
      </a>
    </td>
  `;

  return tr;
};

const renderAllOrderAllList = (orderList) => {
  orderlistWrap.innerHTML = '';
  orderList.data.forEach((item) => {
    const { shortId, userId, phoneNumber, products, totalPrice, createdAt, address } = item;
    const orders = createOrderListElement({ shortId, userId, phoneNumber, products, totalPrice, createdAt, address });
    orderlistWrap.appendChild(orders);
  });
};

const getOrderAllList = async () => {
  try {
    const result = await Api.get('/api/orders/list');
    renderAllOrderAllList(result);
  } catch (err) {
    alert(err.message);
    window.location.href = '/admin/login';
  }
};

const getOrderDetail = async (orderId) => {
  try {
    const result = await Api.get('/api/orders', orderId);
    renderOrderModal(result.data);
  } catch (err) {
    console.log(err);
  }
};

getOrderAllList();
addAllEvents();

// 상품추가 모달
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
    if(i===0)categoryOptions.innerHTML += `<option selected class="${data.data[i].label}" id="${data.data[i].shortId}">${data.data[i].label}</option>`;
    else categoryOptions.innerHTML += `<option class="${data.data[i].label}" id="${data.data[i].shortId}">${data.data[i].label}</option>`;
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
  const categoryId = getNode(`.${category}`).id;
  const productName = document.getElementsByName('productName')[0].value;
  const description = document.getElementsByName('description')[0].value;
  const price = document.getElementsByName('price')[0].value;
  const company = document.getElementsByName('company')[0].value;
  const data = {
    image: image,
    detailImage : detailImage,
    categoryId:categoryId,
    productName: productName,
    description: description,
    price: price,
    company: company,
  }
  await Api.post('/api/products',data);
  location.reload();
}

// 카테고리편집 모달
// 카테고리 모달 렌더링 - Api.get 통신
async function getModalCategory() {
  const data = await Api.get('/api/categories');
  const categoryModalList = document.querySelector('.category-modal-list'); // 모달 카테고리 표
  for (let i = 0; i < data.data.length; i++) {
    // 모달창 카테고리 렌더링
    categoryModalList.innerHTML += `<tr><td class="categoryName" id="${data.data[i].shortId}" name="categoryName">${data.data[i].label}</td>
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
  console.log('추가하려는 카테고리',addCategoryName);
  await Api.post('/api/categories', {label: addCategoryName});
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
// 카테고리 수정- Api.patch통신
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
      //get으로전체 조회 => 쭉돌면서 -> category가 상의가 같을때 push해주기 -> 
      await Api.patch('/api/categories',categoryId,{label:updatedName});
    } catch (error) {
      console.log(error.message);
    }
  }
}

// 카테고리편집 모달창 활성화
// 카테고리편집 버튼 클릭시 -> 모달창 
const modalEditCategory = getNode('#modal-editCategory'); // 모달창 
getNode('.editCategory').onclick = () => {
  modalEditCategory.classList.add('is-active');
};
// 닫기 아이콘 클릭시 모달창 비활성화
const editClose = getNode('#modal-editCategory button.delete'); //닫기버튼
editClose.onclick = () => {
  modalEditCategory.classList.remove('is-active');
  // 닫을때 창 새로고침하기? 
  // 초기화 어떻게 시킬까
  location.reload();
};