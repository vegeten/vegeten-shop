import renderFooter from "../components/footer.js";
import { renderNav } from "../components/nav.js";

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

renderNav();
renderFooter();