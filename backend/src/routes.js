const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bao Market API working',
  });
});

module.exports = router;