import renderFooter from '../components/footer.js';
import { renderNav } from '../components/nav.js';
import { getNode } from '../useful-functions.js';
import * as Api from '/api.js';

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
  }
  carouselSlide.style.transition = 'transform 0.4s ease-in-out';
  carouselSlide.style.transform = 'translateX(' + -size * counter + 'px)';
};

const prevSlideEvent = () => {
  if (counter <= 0) {
    counter = slideLength;
  } else {
    counter--;
  }
  carouselSlide.style.transition = 'transform 0.4s ease-in-out';
  carouselSlide.style.transform = 'translateX(' + -size * counter + 'px)';
};

const createItemListElement = (item) => {
  const { shortId, image, productName, price } = item;
  const li = document.createElement('li');
  li.classList.add('item-card');
  li.innerHTML = `
    <a href="/shop/${shortId}">
      <div class="img-box"><img src=${image} alt=${productName} 이미지></div>
      <div class="productName">${productName}</div>
      <div>${price} 원</div>
    </a>
  `;
  return li;
};

const renderNewArrival = (result) => {
  const items = result.data.products.slice(0, 3);
  const itemList = getNode('.item-list');
  itemList.innerHTML = '';
  items.forEach((item) => {
    const element = createItemListElement(item);
    itemList.appendChild(element);
  });
};

const getNewArrival = async () => {
  try {
    const result = await Api.getNoToken('/api/products');
    renderNewArrival(result);
  } catch (err) {
    console.log(err.message);
  }
};

function addAllEvents() {
  nextBtn.addEventListener('click', nextSlideEvent);
  prevBtn.addEventListener('click', prevSlideEvent);
  window.addEventListener('resize', setSlideSize);
}

renderNav();
renderFooter();
addAllEvents();
getNewArrival();
