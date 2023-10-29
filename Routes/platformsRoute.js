const express = require("express");
const {getLinkedinInfo} = require("../Controllers/platformsController");
const router = express.Router();

router.route('/linkedIn')
  .post(getLinkedinInfo);

module.exports = router;
