// Déclaration des constantes utilisées dans les fonctions
const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const HmacSHA256 = require("crypto-js/hmac-sha256");

// Constante pour le modèle mongoose
const User = require("../models/user");

// Fonction de la route POST signup
exports.createUser = (req, res, next) => {
  let mail = HmacSHA256(req.body.email, process.env.cryptKey).toString();
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        userId: ObjectId(),
        email: mail,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur crée" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

// Fonction de la route POST login
exports.connectUser = (req, res, next) => {
  let mail = HmacSHA256(req.body.email, process.env.cryptKey).toString();
  User.findOne({
    email: mail,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error });
          }
          res.status(200).json({
            userId: user.userId,
            token: jwt.sign({ userId: user.userId }, process.env.tokenKey, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
