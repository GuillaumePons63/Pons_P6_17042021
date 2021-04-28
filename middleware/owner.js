const Sauce = require("../models/sauce");

module.exports = (req, res, next) => {
  const sauceObject = req.file
    ? { ...JSON.parse(req.body.sauce) }
    : { ...req.body };
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauceObject.userId == sauce.userId) {
        next();
      } else {
        res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
    })
    .catch((error) => res.status(401).json({ error }));
};
