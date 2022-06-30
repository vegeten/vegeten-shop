import { getAuthorizationObj, getNode, deleteCookie } from '../useful-functions.js';

const navigation = (isLogin) => {
  const $nav = getNode('#navigation');

  const template = `
  <div id="desktop-container" class="nav-container">
    <a href="/" id="logo-container">
      <img src="/img/vegeten-logo2.png" width="200" alt="메인로고"/>
    </a>
    <ul id="list-container">
      <li><a href="/shop">
        <span>Shop</span>
      </a></li>
      <li><a href="/about">
        <span>About</span>
      </a></li>
      ${isLogin
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
                <span class="logout-button">Log Out</span>
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
          </span></a></li>
          `
    }
    </ul>
  </div>

  <div id="mobile-container" class="nav-container">
    <div class="item"><span id="hamburger-icon" class="material-icons">menu</span></div>
    <a href="/" id="logo-container" class="item">
      <img src="/img/vegeten-logo2.png" width="150" alt="메인로고"/>
    </a>
    <ul id="list-container" class="item">
    ${isLogin
      ? `
          <li><a href="/mypage">
            <span class="material-icons">
              account_circle
            </span>
          </a></li>
          <li><a href="/cart">
            <span class="material-icons">
              shopping_bag
            </span>
          </a></li>
          `
      : `
        <li><a href="/login"><span class="material-icons">
          account_circle
        </span></a></li>
        <li><a href="/cart"><span class="material-icons">
          shopping_bag
        </span></a></li>
        `
    }
    </ul>

    <div id="side-background" >
      <div id="side-navigation">
        <a href="/" id="side-logo">
          <img src="/img/vegeten-logo2.png" width="150" alt="메인로고"/>
        </a>
        <ul id="side-list">
          <li><a href="/about">About</a></li>
          <li><a href="/shop">Shop</a></li>
          <li><a class="logout-button">Log Out</a></li>
        </ul>
      </div>
    </div>
    
  </div>
  
  `;

  $nav.innerHTML = template;

  const $hamburgerButton = getNode('#hamburger-icon');
  const $sideNavigationBg = getNode('#side-background');
  const $sideNavigation = getNode('#side-navigation');

  if ($hamburgerButton) {
    $hamburgerButton.addEventListener('click', () => {
      $sideNavigationBg.style.width = '100vw';
      $sideNavigation.style.transform = 'translateX(100vw)';
    });

    $sideNavigationBg.addEventListener('click', () => {
      $sideNavigationBg.style.width = 0;
      $sideNavigation.style.transform = 'translateX(-100vw)';
    });
  }
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
  {
    isLogin && document.querySelectorAll('.logout-button').forEach(item => item.addEventListener('click', logOut));
  }
};

export { renderNav, logOut };
