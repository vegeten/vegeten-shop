// 에러 미들웨어는 항상 (설령 안 쓰더라도)
// error~next의 4개 인자를 설정해 주어야 함.
function errorHandler(error, req, res, next) {
  // 터미널에 노란색으로 출력됨.
  console.log('\x1b[33m%s\x1b[0m', error.stack);

  // 에러는 해당 http status 코드의 JSON 형태로 프론트에 전달됨
  // 지정된게 없다면 500에러로 지정
  if (!error.status) {
    res.status(500).send({
      status: 500,
      reason: error.message,
    });
  }
  res.status(error.status).json({ status: error.status, reason: error.message });
}

export { errorHandler };
