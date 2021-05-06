// Déclaration des constantes necessaires aux fonctions
const Sauce = require("../models/sauce");
const fs = require("fs");
const { ObjectID } = require("bson");
const jwt = require("jsonwebtoken");

// Fonction de la route GET qui permet d'envoyer toutes les Sauces
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

// Fonction de la route post qui permet la création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    id: ObjectID(),
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

// fonction de la route delete qui permet la suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      // permet de supprimer l'image du dossier image
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(201).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Fonction de la route GET qui permet de n'afficher qu'une seule sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Fonction de la route PUT pour modifier une sauce
exports.modifySauce = (req, res, next) => {
  // Supprime l'ancien fichier si un fichier est présent dans la requête
  if (req.file) {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (error) => {
        if (error) {
          res.status(400).json({ error });
        }
      });
    });
  }
  // Création d'une constante qui n'est pas la même selon la présence d'un fichier avec la requête
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  // Mise à jour de la sauce avec la constante créée plus tôt
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction de la route POST qui ajoute les likes et les dislikes aux sauces
exports.ctrlLike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Cas où l'utilisateur ajoute un like
      if (req.body.like === 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $push: { usersLiked: req.body.userId }, $inc: { likes: 1 } }
        )
          .then(() => res.status(201).json({ message: "like ajouté !" }))
          .catch((error) => res.status(400).json({ error }));
        // Cas où l'utilisateur ajoute un dislike
      } else if (req.body.like === -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 } }
        )
          .then(() => res.status(201).json({ message: "dislike ajouté !" }))
          .catch((error) => res.status(400).json({ error }));
        // Cas où l'utilisateur retire son like
      } else if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
        )
          .then(() => res.status(201).json({ message: "Like retiré !" }))
          .catch((error) => res.status(400).json({ error }));
        // Cas où l'utilisateur retire son dislike
      } else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $pull: { usersDisliked: req.body.userId },
            $inc: { dislikes: -1 },
          }
        )
          .then(() => res.status(201).json({ message: "Dislike retiré !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
