//login-required와 같이 써야 함
function adminAuth(req, res, next) {
  //login-required에서 다음 미들웨어로 넘겨준 decoded jwt
  const decoded = req.decoded;
  console.log(decoded.role);
  if (decoded.role !== 'admin') {
    next(new Error('관리자만 접근 가능합니다.'));
  }
  next();
  //   return;
}

export { adminAuth };
