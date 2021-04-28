const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const hmacSHA512 = require("crypto-js/hmac-sha512");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  let mail = hmacSHA512(req.body.email, process.env.cryptKey).toString();
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
        .then(() => res.status(201).json({ message: "Utilisateurs créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.connectUser = (req, res, next) => {
  let mail = hmacSHA512(req.body.email, process.env.cryptKey).toString();
  User.findOne({
    email: mail,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user.userId,
            token: jwt.sign({ userId: user.userId }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
