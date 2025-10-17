const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/plannercontroller");

router.post("/add", ctrl.add);
router.get("/list", ctrl.list);

module.exports = router;
