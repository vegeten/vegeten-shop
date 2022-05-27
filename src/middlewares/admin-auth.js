
function adminAuth(req, res, next) {
  const decoded = req.decoded;
  if (decoded.role !== 'admin') {
    next(new Error('관리자만 접근 가능합니다.'));
  }
  next();
  return;
}

export { adminAuth };
