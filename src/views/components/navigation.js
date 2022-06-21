import { getAuthorizationObj, getNode, deleteCookie } from '../useful-functions.js';

const navigation = (isLogin) => {
  const $nav = getNode('#navigation');

  const template = `
  <div id="nav-container">
    <a href="/">
      <img src="/img/vegeten-logo2.png" width="200" alt="메인로고"/>
    </a>
    <ul>
      <li><a href="/about">
        <span>About</span>
      </a></li>
      <li><a href="/shop">
        <span>Shop</span>
      </a></li>
      ${
        isLogin
          ? `
            <li id="nav-mypage"><a href="/mypage">
              <span class="material-icons">
                account_circle
              </span>
              <span id="expand-more" class="material-icons">
                expand_more
              </span></a>
              <div id="dropdown">
                <a href="/mypage">My Page</a>
                <span id="logout-button">Log Out</span>
              </div>
            </li>
            <li><a href="/cart">
              <span class="material-icons">
                shopping_bag
              </span>
            </a>
            </li>
            `
          : `
          <li><a href="/login"><span class="material-icons">
          account_circle
        </span></a></li>
          <li><a href="/cart"><span class="material-icons">
          shopping_bag
        </span></a>
        </li>
          `
      }
    </ul>
  </div>
  
  `;

  $nav.innerHTML = template;
};

const logOut = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('accessToken_exp');
  deleteCookie('refreshToken');
  window.location.href = '/login';
};

const renderNav = () => {
  const { isLogin } = getAuthorizationObj();
  navigation(isLogin);
  const logout = getNode('#logout-button');
  logout.addEventListener('click', logOut);
};

export { renderNav };
