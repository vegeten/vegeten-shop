import { checkToken, deleteCookie, getCookie } from './useful-functions.js';

// api 로 GET 요청 (/endpoint/params 형태로 요청함)
//isTokenRequired=false
async function getYesToken(endpoint, params = '') {
  const status = await checkToken();
  if (!status) {
    // deleteCookie('refreshToken');
    alert('로그인이 필요합니다.');
    window.location.href = '/login';
    return;
  } else {
    const apiUrl = `${endpoint}/${params}`;
    console.log(`%cGET 요청: ${apiUrl} `, 'color: #a25cd1;');

    const res = await fetch(apiUrl, {
      // JWT 토큰을 헤더에 담아 백엔드 서버에 보냄.
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    // 응답 코드가 4XX 계열일 때 (400, 403 등)
    if (!res.ok) {
      const errorContent = await res.json();
      const { reason } = errorContent;

      throw new Error(reason);
    }
    const result = await res.json();
    return result;
  }
}
// getNoToken
async function getNoToken(endpoint, params = '') {
  const apiUrl = `${endpoint}/${params}`;
  console.log(`%cGET 요청: ${apiUrl} `, 'color: #a25cd1;');

  const res = await fetch(apiUrl);

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }
  const result = await res.json();
  return result;
}

// api 로 POST 요청 (/endpoint 로, JSON 데이터 형태로 요청함)
async function postYesToken(endpoint, data) {
  const status = await checkToken();
  if (!status) {
    alert('로그인이 필요합니다.');
    window.location.href = '/login';
    return;
  } else {
    const apiUrl = endpoint;
    // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
    // 예시: {name: "Kim"} => {"name": "Kim"}
    const bodyData = JSON.stringify(data);
    console.log(`%cPOST 요청: ${apiUrl}`, 'color: #296aba;');
    console.log(`%cPOST 요청 데이터: ${bodyData}`, 'color: #296aba;');

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: bodyData,
    });

    // 응답 코드가 4XX 계열일 때 (400, 403 등)
    if (!res.ok) {
      const errorContent = await res.json();
      const { reason } = errorContent;

      throw new Error(reason);
    }
    const result = await res.json();
    return result;
  }
}

async function postNoToken(endpoint, data) {
  const apiUrl = endpoint;
  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}
  const bodyData = JSON.stringify(data);
  console.log(`%cPOST 요청: ${apiUrl}`, 'color: #296aba;');
  console.log(`%cPOST 요청 데이터: ${bodyData}`, 'color: #296aba;');

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyData,
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }
  const result = await res.json();
  return result;
}

// api 로 PATCH 요청 (/endpoint/params 로, JSON 데이터 형태로 요청함)
async function patchYesToken(endpoint, params = '', data) {
  const status = await checkToken();
  if (!status) {
    alert('로그인이 필요합니다.');
    window.location.href = '/login';
    return;
  } else {
    const apiUrl = `${endpoint}/${params}`;

    // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
    // 예시: {name: "Kim"} => {"name": "Kim"}
    const bodyData = JSON.stringify(data);
    console.log(`%cPATCH 요청: ${apiUrl}`, 'color: #059c4b;');
    console.log(`%cPATCH 요청 데이터: ${bodyData}`, 'color: #059c4b;');

    const res = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: bodyData,
    });

    // 응답 코드가 4XX 계열일 때 (400, 403 등)
    if (!res.ok) {
      const errorContent = await res.json();
      const { reason } = errorContent;

      throw new Error(reason);
    }
    const result = await res.json();
    return result;
  }
}

async function patchNoToken(endpoint, params = '', data) {
  const apiUrl = `${endpoint}/${params}`;

  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}
  const bodyData = JSON.stringify(data);
  console.log(`%cPATCH 요청: ${apiUrl}`, 'color: #059c4b;');
  console.log(`%cPATCH 요청 데이터: ${bodyData}`, 'color: #059c4b;');

  const res = await fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyData,
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }
  const result = await res.json();
  return result;
}

async function deleteYesToken(endpoint, params = '', data = {}) {
  const status = await checkToken();
  if (!status) {
    alert('로그인이 필요합니다.');
    window.location.href = '/login';
    return;
  } else {
    const apiUrl = `${endpoint}/${params}`;
    const bodyData = JSON.stringify(data);

    console.log(`DELETE 요청 ${apiUrl}`);
    console.log(`DELETE 요청 데이터: ${bodyData}`);

    const res = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: bodyData,
    });

    // 응답 코드가 4XX 계열일 때 (400, 403 등)
    if (!res.ok) {
      const errorContent = await res.json();
      const { reason } = errorContent;

      throw new Error(reason);
    }
    const result = await res.json();
    return result;
  }
}

async function deleteNoToken(endpoint, params = '', data = {}) {
  const apiUrl = `${endpoint}/${params}`;
  const bodyData = JSON.stringify(data);

  console.log(`DELETE 요청 ${apiUrl}`);
  console.log(`DELETE 요청 데이터: ${bodyData}`);

  const res = await fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyData,
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }
  const result = await res.json();
  return result;
}

// 아래처럼 export하면, import * as Api 로 할 시 Api.get, Api.post 등으로 쓸 수 있음.
export {
  getYesToken,
  getNoToken,
  postYesToken,
  postNoToken,
  patchYesToken,
  patchNoToken,
  deleteYesToken,
  deleteNoToken,
};
