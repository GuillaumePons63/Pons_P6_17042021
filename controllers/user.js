const bcrypt = require("bcrypt");
const { ObjectID } = require("bson");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        userId: ObjectID(),
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateurs créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};
