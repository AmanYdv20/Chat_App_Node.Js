var moment = require('moment');

var generateMessage = (from, text)=> {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

var generateLocationMessage = (from, latitute, longitute)=> {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitute},${longitute}`,
    created: moment().valueOf()
  };
};

module.exports = {generateMessage, generateLocationMessage};
