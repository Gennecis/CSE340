const express = require('express');
const router = express.Router();

// Route that intentionally triggers a 500 error
router.get('/trigger-error', (req, res, next) => {
  const error = new Error('Intentional Server Error');
  error.status = 500;
  next(error); // Pass it to the error handler middleware
});

module.exports = router;