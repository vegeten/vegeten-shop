import renderFooter from '../components/footer.js';
import { renderNav } from '../components/nav.js';
import { getNode, getCookie } from '../useful-functions.js';

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};
renderNav();
renderFooter();

const $carouselSlide = getNode('.carousel-slide');
const $prevBtn = getNode('#prevBtn');
const $nextBtn = getNode('#nextBtn');
const slideLength = 3;
let counter = 0;
let size = $carouselSlide.clientWidth;

const setSlideSize = (e) => {
  size = $carouselSlide.clientWidth;
};

const nextSlideEvent = () => {
  if (counter >= slideLength) {
    counter = 0;
  } else {
    counter++;
  }
  $carouselSlide.style.transition = 'transform 0.4s ease-in-out';
  $carouselSlide.style.transform = 'translateX(' + -size * counter + 'px)';
};

const prevSlideEvent = () => {
  if (counter <= 0) {
    counter = slideLength;
  } else {
    counter--;
  }
  $carouselSlide.style.transition = 'transform 0.4s ease-in-out';
  $carouselSlide.style.transform = 'translateX(' + -size * counter + 'px)';
};

$nextBtn.addEventListener('click', nextSlideEvent);
$prevBtn.addEventListener('click', prevSlideEvent);
window.addEventListener('resize', setSlideSize);
