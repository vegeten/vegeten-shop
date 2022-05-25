import { getNode } from '../useful-functions.js';
import renderFooter from '../components/footer.js';
import renderNav from '../components/nav.js';

const mockUserAPI = {
  email: 'test@test.com',
  fullName: '김정현',
  password: '12341234',
  phoneNumber: '010-5628-9304',
  address: {
    postalCode: '1234',
    address1: '마포구 합정동',
    address2: '123-123',
  },
  role: 'basic-user',
};

renderNav(mockUserAPI.role === 'basic-user' ? false : true);
renderFooter();

// 선택한 수량에 따른 총액 계산하기
const selections = getNode('#total-count'); // select 드롭박스
const totalPrice = getNode('.total-price div:nth-child(2)'); // 총가격 
selections.addEventListener("change", () => { // 선택이 바뀔때마다 총액 계산하기
    const selected = selections.value.replace('개', '');
    const price = document.getElementsByName("price")[0].textContent.replace('원','');
    totalPrice.innerHTML = (selected * price).toLocaleString() + ' 원'

})

// const selectedOption = getNode('select#total-count option:checked').value;
// console.log(selectedOption.substring(0, selectedOption.length-1));
