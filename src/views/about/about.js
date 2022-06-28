import renderFooter from '../components/footer.js';
import { renderNav } from '../components/navigation.js';

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

renderNav();
renderFooter();
