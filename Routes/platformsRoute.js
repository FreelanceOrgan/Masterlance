const express = require("express");
const {getUserInfoFromFreelancer} = require("../Controllers/platformsController");
const router = express.Router();

router.route('/freelancer/userinfo')
  .post(getUserInfoFromFreelancer);

module.exports = router;
