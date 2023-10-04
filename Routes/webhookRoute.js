const express = require("express");
const router = express.Router();
const {confirmTransaction} = require("../Controllers/webhookController");

router.route("/confirm")
    .post(confirmTransaction);

module.exports = router;