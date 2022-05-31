import { addCommas, getAuthorizationObj, getNode } from '../useful-functions.js';
import * as Api from '/api.js';

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

const deleteButton = getNode('.delete-button');
const orderList = getNode('.order-list');
const modal = getNode('.modal');
const modalButton = getNode('.close-button');
const orderlistWrap = getNode('.orderlist-wrap');
const modalBody = getNode('.modal-card-body');

const deleteSubmit = () => {
  alert('정말 주문은 삭제하시겠습니까?');
};

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
            <span class="info-order-number">No. ${shortId}</span>
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
            <span><strong>총 주문금액: ${addCommas(totalPrice)}</strong></span>
          </div>
        </div>
  `;
};

const renderOrderModal = (item) => {
  modalBody.innerHTML = createOrderModal(item);
};

const viewDetailModal = (e) => {
  if (!e.target.classList.contains('open-modal')) return;
  const orderId = e.target.parentNode.parentNode.querySelector('.ordershortId').innerText;
  const orderDate = getNode('.order_date').innerText;
  modalBody.innerHTML = '';
  getOrderDetail(orderId, orderDate);
  modal.classList.add('is-active');
};

const closeModal = () => {
  modal.classList.remove('is-active');
};

function addAllEvents() {
  deleteButton.addEventListener('click', deleteSubmit);
  modalButton.addEventListener('click', closeModal);
  orderList.addEventListener('click', viewDetailModal);
}

const createOrderListElement = (item) => {
  const {
    shortId, products, createdAt
  } = item;

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td><input type="checkbox" name="check"></td>
    <th class="ordershortId">${shortId}</th>
    <td>${products.length ?? '1'} 건의 주문내역</td>
    <td class="order_date">${createdAt.substr(0, 10)}</td>
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
    const result = await Api.get('/api/admin/orders');
    renderAllOrderAllList(result);
  } catch (err) {
    console.log(err);
  }
};

const getOrderDetail = async (orderId) => {
  try {
    const result = await Api.get('/api/admin/orders', orderId);
    renderOrderModal(result.data);
  } catch (err) {
    console.log(err.message);
  }
};

getOrderAllList();
addAllEvents();