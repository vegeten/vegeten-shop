const { nanoid } = require('nanoid');

const shortId = {
  type: String,
  default: () => {
    return nanoid(8);
  },
  require: true,
  index: true,
};

module.exports = shortId;
