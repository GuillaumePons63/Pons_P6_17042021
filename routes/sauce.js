const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");

router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, sauceCtrl.createSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);

module.exports = router;
