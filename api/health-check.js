'use strict';

const timeout = require('connect-timeout')


function get(req, res) {
  setTimeout(() => {
    if (!req.timedout) {
      res.json({
        pong: true,
      })
    }

  }, 6000);

}

module.exports = {
  get: get,
};

