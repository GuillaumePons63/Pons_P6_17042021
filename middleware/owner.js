// utilisation du modèle mongoose présent dans models/sauce.js
const Sauce = require("../models/sauce");

module.exports = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // userIdFromToken est créé dans le middleware auth
      if (req.body.userIdFromToken === sauce.userId) {
        next();
      } else {
        res.status(401).json({ error });
      }
    })
    .catch((error) => res.status(401).json({ error }));
};
