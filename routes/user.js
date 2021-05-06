// Déclaration des constantes
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { userValidationRules, validate } = require("../middleware/validation");

// Routes des utilisateurs api/auth
router.post("/signup", userValidationRules(), validate, userCtrl.createUser);
router.post("/login", userCtrl.connectUser);

module.exports = router;
