const Sauce = require("../models/sauce");
const fs = require("fs");
const { ObjectID } = require("bson");
const jwt = require("jsonwebtoken");
const sauce = require("../models/sauce");

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce crée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(201).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.ctrlLike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.body.like == 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $push: { usersLiked: req.body.userId }, $inc: { likes: 1 } }
        )
          .then(() => res.status(201).json({ message: "user ajouté !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (req.body.like == -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 } }
        )
          .then(() => res.status(201).json({ message: "user ajouté !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
        )
          .then(() => res.status(201).json({ message: "ok" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $pull: { usersDisLiked: req.body.userId },
            $inc: { dislikes: -1 },
          }
        )
          .then(() => res.status(201).json({ message: "ok" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
