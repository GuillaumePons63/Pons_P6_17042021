const Sauce = require("../models/sauce");

module.exports = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.body.userIdFromToken === sauce.userId) {
        next();
      } else {
        res.status(401).json({ error: "Utilisateur non autorisé !" });
      }
    })
    .catch((error) => res.status(401).json({ error }));
};
