import { getNode } from "../useful-functions.js";

const renderFooter = () => {
  const $footer = getNode(".footer");
  $footer.style.padding = "3rem 1.5rem";
  $footer.style.backgroundColor = 'white';
  // $footer.style.boxShadow = 'inset 0 2px 4px 0 rgb(0 0 0 / 6%)';
  $footer.style.borderTop = '1px solid rgb(0 0 0 / 6%)';
  $footer.innerHTML = `
    <div class="content has-text-centered">
      <p>
        <a href="https://github.com/10th-team-of-Elice"><i class="fa-brands fa-github"></i></a>
      </p>
      <p>
        <strong>10 Shop</strong> by
        <a href="https://kdt-gitlab.elice.io/sw_track/class_02_seoul/web_project/team10/shopping-mall">Team Ten</a>.
        The source code is licensed
        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
      </p>
    </div>
    `;

};

export default renderFooter;