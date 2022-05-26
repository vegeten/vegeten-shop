import renderFooter from '../components/footer.js';
import { renderNav } from "../components/nav.js";
import { getAuthorizationObj, getNode } from '../useful-functions.js';

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

renderNav();
renderFooter();

const addressCode = getNode('.address-code');

window.onload = function () {
  getNode('#kakao_address').addEventListener('click', (e) => {
    e.preventDefault();
    new daum.Postcode({
      oncomplete: function (data) {
        addressCode.value = data.zonecode;
        getNode('.address-1').value = data.address;
        getNode('.address-2').focus();
      },
    }).open();
  });
};

