import renderFooter from "../components/footer.js";
import { renderNav } from "../components/nav.js";
import { getNode } from "../useful-functions.js";

const carouselSlide = getNode('.carousel-slide');
const prevBtn = getNode('#prevBtn');
const nextBtn = getNode('#nextBtn');
const slideLength = 3;
let counter = 0;
let size = carouselSlide.clientWidth;

const setSlideSize = () => {
  size = carouselSlide.clientWidth;
};

const nextSlideEvent = () => {
  if (counter >= slideLength) {
    counter = 0;
  } else {
    counter++;
  };
  carouselSlide.style.transition = "transform 0.4s ease-in-out";
  carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
};

const prevSlideEvent = () => {
  if (counter <= 0) {
    counter = slideLength;
  } else {
    counter--;
  };
  carouselSlide.style.transition = "transform 0.4s ease-in-out";
  carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
};

const getNewArrival = async () => {

};

function addAllEvents() {
  nextBtn.addEventListener('click', nextSlideEvent);
  prevBtn.addEventListener('click', prevSlideEvent);
  window.addEventListener("resize", setSlideSize);
}

renderNav();
renderFooter();
addAllEvents();