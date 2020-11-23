'use strict';
const apiAdapter = require('../util/apiAdapter');
const BASE_URL = 'http://localhost:3000/v1/';
const api = apiAdapter(BASE_URL);

function get(req, res) {
  api.get(req.swagger.apiPath, {
    params: {
      name: req.swagger.params.name.value
    }
  }).then(resp => {
    res.json(resp.data);
  }, err => {
    res.status(err.response.status).json(err.response.statusText);
  }).catch(error => {
    console.log(error);
  });
}

module.exports = {
  get: get,
};
