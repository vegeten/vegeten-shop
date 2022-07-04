import is from '@sindresorhus/is';

const validateDataType = (req, res, next) => {
  if (is.emptyObject(req.body)) {
    throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
  }
};

export { validateDataType };
