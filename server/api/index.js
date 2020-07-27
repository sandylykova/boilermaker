const router = require('express').Router();

router.use((req, res, next) => {
  const error = new Error('API ROUTE NOT FOUND');
  error.status = 404;
  next(error);
});

module.exports = router;
