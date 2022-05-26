import renderFooter from '../components/footer.js';
import { renderNav } from "../components/nav.js";
import { getAuthorizationObj } from '../useful-functions.js';

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