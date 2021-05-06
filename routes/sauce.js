// Déclaration du framework Express
const express = require("express");
const router = express.Router();

// Déclaration des constantes présentes dans les autres fichiers de l'applicaiton
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const owner = require("../middleware/owner");

// Routes des sauces api/sauces
router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.delete("/:id", auth, owner, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, owner, multer, sauceCtrl.modifySauce);
router.post("/:id/like", auth, sauceCtrl.ctrlLike);

module.exports = router;
