import * as Api from '/api.js';

async function getDataItems() {
  const data =await Api.get('/api/shop/list');
  
}

