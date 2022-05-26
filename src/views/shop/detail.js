import { getNode } from '../useful-functions.js';
import renderFooter from '../components/footer.js';
import { renderNav } from '../components/nav.js';

renderNav();
renderFooter();

// 선택한 수량에 따른 총액 계산하기
const selections = getNode('#total-count'); // select 드롭박스
const totalPrice = getNode('.total-price div:nth-child(2)'); // 총가격 
selections.addEventListener("change", () => { // 선택이 바뀔때마다 총액 계산하기
  const selected = selections.value.replace('개', '');
  const price = document.getElementsByName("price")[0].textContent.replace('원', '');
  totalPrice.innerHTML = (selected * price).toLocaleString() + ' 원';

});

// const selectedOption = getNode('select#total-count option:checked').value;
// console.log(selectedOption.substring(0, selectedOption.length-1));
