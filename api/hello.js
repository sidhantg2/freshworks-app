'use strict';

function get(req, res) {
  if (req.query.error) {
    // Intentionally call a nonexistent function to trigger an error
    /* eslint-disable-next-line no-undef */
    noSuchFunction();
  }

  const name = req.swagger.params.name.value || 'stranger';

  res.json({
    message: `freshworks says hello, ${name}!`,
  });
}

module.exports = {
  get: get,
};
