import renderFooter from '../components/footer.js';
import { renderNav } from "../components/nav.js";
import { getAuthorizationObj, getNode } from '../useful-functions.js';

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

const { isLogin, isAdmin } = getAuthorizationObj();

if (!isLogin || !isAdmin) {
  alert('어드민 유저만 접근 가능합니다.');
  window.location.href = '/login';

}

renderNav();
renderFooter();

const $deleteButton = getNode('.delete-button');
const $orderDetailButton = getNode('.order-detail-button');
const $modal = getNode('.modal');
const $modalButton = getNode('.close-button');

const deleteSubmit = () => {
  alert('정말 주문은 삭제하시겠습니까?');
};

const viewDetailModal = () => {
  $modal.classList.add('is-active');
};

const closeModal = () => {
  $modal.classList.remove('is-active');
};

$deleteButton.addEventListener('click', deleteSubmit);
$orderDetailButton.addEventListener('click', viewDetailModal);
$modalButton.addEventListener('click', closeModal);