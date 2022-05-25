import { getNode } from "../useful-functions.js";

const renderNav = (checkAdminFlag) => {
  const $navbar = getNode(".navbar");
  const template = `
  <div class="container mt-3">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="/elice-rabbit.png" width="30" height="30" alt="LOGO" />
      </a>
    
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <ul class="navbar-end">
      <li>
        <a class=" navbar-item" href="/about">
          <span class="">About</span>
        </a>
      </li>
      <li>
        <a class="navbar-item" href="/shop">
          <span>Shop</span>
        </a>
      </li>
      ${checkAdminFlag ?
      `<li>
          <a class="navbar-item" href="/orderInfo">
            <span>주문내역</span>
          </a>
        </li>` :
      `<li>
          <a class="navbar-item" href="/login">
            <span class="material-icons">
              account_circle
            </span>
          </a>
        </li>
        <li>
          <a class="navbar-item" href="/cart" aria-current="page">
            <span class="material-icons">
              shopping_bag
            </span>
          </a>
        </li>`}
      </ul>
    </div>
  </div>`;

  $navbar.innerHTML = template;
};

export default renderNav;