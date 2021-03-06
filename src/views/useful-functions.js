// 문자열+숫자로 이루어진 랜덤 5글자 반환
export const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

// 이메일 형식인지 확인 (true 혹은 false 반환)
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// 숫자에 쉼표를 추가함. (10000 -> 10,000)
export const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 13,000원, 2개 등의 문자열에서 쉼표, 글자 등 제외 후 숫자만 뺴냄
// 예시: 13,000원 -> 13000, 20,000개 -> 20000
export const convertToNumber = (string) => {
  return parseInt(string.replace(/(,|개|원)/g, ''));
};

// ms만큼 기다리게 함.
export const wait = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};

// selector의 DOM node요소를 가져옴.
export const getNode = (selector) => {
  return document.querySelector(selector);
};

// JWT 토큰 여부로 로그인 상태를 판단하여 객체로 전달해줌.
export const getAuthorizationObj = () => {
  return {
    isLogin: document.cookie.indexOf('refreshToken') === -1 ? false : true,
    isAdmin: false,
  };
};

export const setCookie = (key, value) => {
  let newCookie = encodeURIComponent(key) + '=' + encodeURIComponent(value) + ';path=/';
  document.cookie = newCookie;
};

export const getCookie = (cookieName) => {
  // const decodedCookieName = decodeURIComponent(cookieName);
  // const idx = document.cookie.indexOf(decodedCookieName);
  const idx = document.cookie.indexOf(cookieName);

  if (idx === -1) {
    return null;
  } else {
    const cookieValue = document.cookie
      .slice(idx)
      .split(';')
      .find((row) => row.startsWith(cookieName))
      .split('=')[1];

    return cookieValue;
  }
};

export const deleteCookie = (cookieName) => {
  document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
};

export const checkToken = async () => {
  const exp = localStorage.getItem('accessToken_exp');
  const expDate = new Date(0).setUTCSeconds(exp);
  const todayDate = new Date();
  const time_diff = 30000;

  // 만료되기 30초 이하
  if (expDate - todayDate.getTime() <= time_diff) {
    try {
      const res = await fetch('/api/users/refresh', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          Refresh: `Bearer ${getCookie('refreshToken')}`,
        },
      });
      // json() 할 때는 await 필요 없을 듯
      const result = await res.json();
      console.log(result);
      if (!result.refresh) return false;
      else if (!result.access) {
        console.log('액세스토큰 갱신!!');
        localStorage.setItem('accessToken_exp', result.data.exp);
        localStorage.setItem('accessToken', result.data.newAccessToken);
        return true;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  // 만료되기 5분 넘게 남음
  return true;
};
