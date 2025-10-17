const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/breathingcontroller");

router.get("/", ctrl.get);

module.exports = router;
