import renderFooter from '../components/footer.js';
import { logOut, renderNav } from "../components/nav.js";
import { addCommas, getAuthorizationObj, getNode } from '../useful-functions.js';
import * as Api from '/api.js';

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

const { isLogin } = getAuthorizationObj();

if (!isLogin) {
  alert('로그인이 필요한 서비스입니다.');
  window.location.href = '/login';
}

const orderWrapper = getNode('.order-list');
const fullNameInput = getNode('.name-input');
const emailInput = getNode('.email-input');
const numberFirstInput = getNode('.number-1');
const numberSecondInput = getNode('.number-2');
const numberThirdInput = getNode('.number-3');
const addressCodeInput = getNode('.address-code');
const addressTitleInput = getNode('.address');
const addressDetailInput = getNode('.address-detail');
const currentPasswordInput = getNode('.passwd');
const currentPasswordCheck = getNode('.passwd-check');
const newPasswordInput = getNode('.new-passwd');
const passwordToggle = getNode('.passwd-modify');
let toggle = false;

const validationInput = (e) => {
  if (e.target.value === '') {
    e.target.classList.add('is-danger');
    e.target.nextElementSibling.style.display = 'block';
  } else {
    e.target.classList.remove('is-danger');
    e.target.nextElementSibling.style.display = 'none';
  }
};


const addErrorHTML = (target) => {
  target.classList.add('is-danger');
  target.nextElementSibling.style.display = 'block';
  if (target === fullNameInput) {
    target.nextElementSibling.innerHTML = '이름은 2글자 이상이어야 합니다.';
  } else if (target === currentPasswordInput) {
    target.nextElementSibling.innerHTML = '비밀번호는 4글자 이상이어야 합니다.';
  } else if (target === currentPasswordCheck) {
    target.nextElementSibling.innerHTML = '비밀번호가 일치하지 않습니다.';
  }
};

const onPasswordToggle = (e) => {
  e.preventDefault();
  toggle = !toggle;
  if (toggle) {
    e.target.classList.remove('is-warning');
    e.target.classList.add('is-danger');
    newPasswordInput.readOnly = false;
    newPasswordInput.placeholder = '새 비밀번호를 입력해주세요.';
    newPasswordInput.focus();
  } else {
    e.target.classList.remove('is-danger');
    e.target.classList.add('is-warning');
    newPasswordInput.placeholder = '비밀번호 변경 버튼을 누르세요.';
    newPasswordInput.readOnly = true;
  }

};

const renderUserInfo = (data) => {
  const {
    fullName,
    email,
    phoneNumberFirst,
    phoneNumberSecond,
    phoneNumberThird,
    postalCode,
    address1,
    address2
  } = data;

  fullNameInput.value = fullName;
  emailInput.value = email;
  numberFirstInput.value = phoneNumberFirst;
  numberSecondInput.value = phoneNumberSecond;
  numberThirdInput.value = phoneNumberThird;
  addressCodeInput.value = postalCode;
  addressTitleInput.value = address1;
  addressDetailInput.value = address2;
};

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  getNode('#kakao_address').addEventListener('click', (e) => {
    e.preventDefault();
    new daum.Postcode({
      oncomplete: function (data) {
        addressCodeInput.value = data.zonecode;
        addressTitleInput.value = data.address;
        addressDetailInput.focus();
      },
    }).open();
  });
  const btnWithdraw = getNode('.btn-withdraw');
  const btnModify = getNode('.btn-modify');
  btnWithdraw.addEventListener('click', submitWithdrawUser);
  btnModify.addEventListener('click', submitModifyUserInfo);
  passwordToggle.addEventListener('click', onPasswordToggle);
  fullNameInput.addEventListener('input', validationInput);
  currentPasswordInput.addEventListener('input', validationInput);
  currentPasswordCheck.addEventListener('input', validationInput);
  newPasswordInput.addEventListener('input', validationInput);

}

const createOrderListElement = (item) => {
  const {
    _id,
    productImg,
    productName,
    count,
    totalPrice,
    createdAt } = item;

  const li = document.createElement('li');
  li.innerHTML = `<div class="box order-list has-background-light">
    <div class="order-list-wrapper">
      <div class="order-list-image">
        <img src=${productImg} alt="상품 이미지" />
      </div>
      <div class="order-list-content">
        <dl class="content-list">
          <div class="content-wrapper">
            <dt class="content-title">
              <strong>주문 번호</strong>
            </dt>
            <dd class="content-content">
              ${_id.substr(0, 7)}
            </dd>
          </div>
          <div class="content-wrapper">
            <dt class="content-title">
              <strong>상품 명</strong>
            </dt>
            <dd class="content-content">
              ${productName}
            </dd>
          </div>
          <div class="content-wrapper">
            <dt class="content-title">
              <strong>수량</strong>
            </dt>
            <dd class="content-content">
              ${count}
            </dd>
          </div>
          <div class="content-wrapper">
            <dt class="content-title">
              <strong>금액</strong>
            </dt>
            <dd class="content-content">
              ${addCommas(totalPrice)}
            </dd>
          </div>
          <div class="content-wrapper">
            <dt class="content-title">
              <strong>날짜</strong>
            </dt>
            <dd class="content-content">
              ${createdAt.substr(0, 10)}
            </dd>
          </div>
        </dl>
      </div>

    </div>
  </div>`;

  return li;
};

const renderAllOrderList = (orderList) => {
  orderWrapper.innerHTML = '';
  orderList.data.forEach(({ products, totalPrice, _id, createdAt }) => {
    const orders = createOrderListElement({ totalPrice, _id, createdAt, ...products });
    console.log(orders);
    orderWrapper.appendChild(orders);
  });

};



const getUserInfo = async () => {
  try {
    const result = await Api.get('/api/users');
    const [phoneNumberFirst = '', phoneNumberSecond = '', phoneNumberThird = ''] = result.data.phoneNumber?.split('-') || [];
    const { postalCode = '', address1 = '', address2 = '' } = result.data?.address || {};
    const userInfo = {
      fullName: result.data.fullName,
      email: result.data.email,
      phoneNumberFirst,
      phoneNumberSecond,
      phoneNumberThird,
      postalCode,
      address1,
      address2
    };

    renderUserInfo(userInfo);

  } catch (err) {
    console.log(err.message);
  }
};



const submitWithdrawUser = async (e) => {
  e.preventDefault();

  const ok = window.confirm("정말로 탈퇴하시겠습니까?");
  if (!ok) return;

  try {
    await Api.delete('/api/users');
    logOut();
  } catch (err) {
    console.log(err.message);
  }
};

const submitModifyUserInfo = async (e) => {
  e.preventDefault();

  let validateFlag = true;
  const fullName = fullNameInput.value;
  const password = currentPasswordInput.value;
  const passwordConfirm = currentPasswordCheck.value;
  const phoneNumber = `${numberFirstInput.value}-${numberSecondInput.value}-${numberThirdInput.value}`;

  const isFullNameValid = fullName.length >= 2;
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;

  if (!isFullNameValid) {
    addErrorHTML(fullNameInput);
    validateFlag = false;
  }

  if (!isPasswordValid) {
    addErrorHTML(passwordInput);
    validateFlag = false;
  }

  if (!isPasswordSame) {
    addErrorHTML(currentPasswordCheck);
    validateFlag = false;
  }

  if (!validateFlag) return;


  const ok = window.confirm("정말 수정하시겠습니까?");
  if (!ok) return;

  try {
    const data = {
      fullName: fullNameInput.value,
      currentPassword: currentPasswordInput.value,
      address: {
        postalCode: addressCodeInput.value,
        address1: addressTitleInput.value,
        address2: addressDetailInput.value
      },
      phoneNumber,
      password: newPasswordInput.value,
    };

    await Api.patch('/api/users', '', data);
    window.location.reload();
  } catch (err) {
    console.log(err.message);
  }
};

const getOrderList = () => {
  const mockApi = {
    "status": 200,
    "message": "유저별 주문 목록 조회 성공",
    "data": [
      {
        "_id": "6290553b2c6f347fcc130cd0",
        "address": {
          "postalCode": "우편번호",
          "address1": "주소",
          "address2": "주소디테일"
        },
        "phoneNumber": "010-2345-6789",
        "products": {
          "productsId": "123124",
          "productImg": "https://picsum.photos/id/3/50/50",
          "productName": "치마",
          "count": 2
        },
        "totalPrice": 100000,
        "userId": "62904c214b3992a2e46d3c66",
        "createdAt": "2022-05-25T04:36:11.648Z",
        "updatedAt": "2022-05-25T04:36:11.648Z",
        "__v": 0
      },
      {
        "_id": "62905830f011ab45acf38e17",
        "address": {
          "postalCode": "우편번호",
          "address1": "주소",
          "address2": "주소디테일"
        },
        "phoneNumber": "010-2345-6789",
        "products": {
          "productsId": "123123",
          "productImg": "https://picsum.photos/id/6/50/50",
          "productName": "바지",
          "count": 1
        },
        "totalPrice": 440000,
        "userId": "62904c214b3992a2e46d3c66",
        "createdAt": "2022-05-27T04:48:48.077Z",
        "updatedAt": "2022-05-27T04:48:48.077Z",
        "__v": 0
      }
    ]
  };
  const result = mockApi;
  renderAllOrderList(result);

};




renderNav();
renderFooter();
addAllEvents();
await getUserInfo();
getOrderList();