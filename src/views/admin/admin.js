import renderFooter from '../components/footer.js';
import { renderNav } from "../components/nav.js";
import { getAuthorizationObj, getNode } from '../useful-functions.js';
import * as Api from '/api.js';

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

// const { isLogin, isAdmin } = getAuthorizationObj();

// if (!isLogin || !isAdmin) {
//   alert('어드민 유저만 접근 가능합니다.');
//   window.location.href = '/login';

// }

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

const getOrderALLList = async () => {
  try {
    const mockApi = {
      "status": 200,
      "message": "전체 주문 목록 조회 성공",
      "data": [
        {
          "_id": "6290a19aa434bbe1a8987335",
          "address": {
            "postalCode": "우편번호",
            "address1": "주소",
            "address2": "주소디테일"
          },
          "phoneNumber": "010-2345-6789",
          "products": [
            {
              "productId": "",
              "productImg": "https://picsum.photos/200",
              "productName": "바지",
              "count": 1
            },
            {
              "productId": "",
              "productImg": "https://picsum.photos/200",
              "productName": "치마",
              "count": 2
            }
          ],
          "totalPrice": 440000,
          "userId": "629070084a2209c7479e7aa4",
          "createdAt": "2022-05-27T10:02:02.365Z",
          "updatedAt": "2022-05-27T10:02:02.365Z",
          "__v": 0
        },
        {
          "_id": "6290a19ea434bbe1a8987337",
          "address": {
            "postalCode": "우편번호",
            "address1": "주소",
            "address2": "주소디테일"
          },
          "phoneNumber": "010-2345-6789",
          "products": [
            {
              "productId": "",
              "productImg": "https://picsum.photos/200",
              "productName": "바지",
              "count": 1
            },
            {
              "productId": "",
              "productImg": "https://picsum.photos/200",
              "productName": "치마",
              "count": 2
            }
          ],
          "totalPrice": 440000,
          "userId": "629070084a2209c7479e7aa4",
          "createdAt": "2022-05-27T10:02:06.145Z",
          "updatedAt": "2022-05-27T10:02:06.145Z",
          "__v": 0
        }
      ]
    };
    //const result = await Api.get('/api/orderlist');
    console.log(mockApi);
  } catch (err) {
    console.log(err);
  }
};

getOrderALLList();