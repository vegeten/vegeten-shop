import { getAuthorizationObj, getNode, deleteCookie } from '../useful-functions.js';

const logOut = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('accessToken_exp');
  deleteCookie('refreshToken');
  window.location.href = '/login';
};

const addLogOutEvent = (isLogin) => {
  if (isLogin) {
    const $logout = getNode('.logout');
    $logout.addEventListener('click', logOut);
  }
};

const nav = (isLogin, isAdmin) => {
  const $navbar = getNode('.navbar');
  $navbar.style.cssText = 'position:fixed;top:0;width:100%';
  const template = `
  <div class="container mt-3">
    <div cit lass="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="/img/vegeten-logo2.png" width="200" style="max-height:2.5em" alt="LOGO" />
      </a>
    
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-end">
      <a class=" navbar-item" href="/about">
        <span class="">About</span>
      </a>
    
      <a class="navbar-item" href="/shop">
        <span>Shop</span>
      </a>
      ${
        isLogin
          ? `
            <div class="navbar-item has-dropdown is-hoverable" id="dropdown">
              <span class="material-icons navbar-link">
                account_circle
              </span>
              <div class="navbar-dropdown">
                <a class="navbar-item" href="/mypage">My Page</a>
                <a class="navbar-item logout" >Log out</a>
              </div>
            </div>
          
            <a class="navbar-item" href="/cart" aria-current="page">
              <span class="material-icons">
                shopping_bag
              </span>
            </a>
          `
          : `
      <a class="navbar-item" href="/login">
        <span class="material-icons">
          account_circle
        </span>
      </a>
      <a class="navbar-item" href="/cart" aria-current="page">
        <span class="material-icons">
          shopping_bag
        </span>
      </a>
      `
      } 
    </div>
  </div>`;

  $navbar.innerHTML = template;
  const aTag = document.querySelectorAll('a.navbar-item');
  for (let i = 0; i < aTag.length; i++) {
    aTag[i].addEventListener('mouseover', () => {
      aTag[i].style.backgroundColor = 'rgba(255, 255, 255, 0)';
    });
  }
};

const renderNav = () => {
  const { isLogin, isAdmin } = getAuthorizationObj();
  nav(isLogin, isAdmin);
  addLogOutEvent(isLogin);
};

export { renderNav, logOut };
