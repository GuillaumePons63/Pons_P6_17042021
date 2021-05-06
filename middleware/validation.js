// déclaration des constantes necessaire à l'utilisation d'express-validator
const { body, validationResult } = require("express-validator");

// fonction des régles de validation des informations utilisateurs.
const userValidationRules = () => {
  return [
    // req.body.email doit être un Email
    body("email").isEmail(),
    // req.body.password doit avoir au moins 8 caractères, un chiffre, une lettre majuscule et une lettre minuscule
    body(
      "password",
      "Le mot de passe doit contenir au moins 8 caractères, dont un chiffre, une lettre majuscule et une lettre minuscule"
    )
      .isLength({
        min: 8,
      })
      .matches("[0-9]")
      .matches("[A-Z]")
      .matches("[a-z]"),
  ];
};

// Gestion des résultats
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

// Exportation pour le fichier routes/user.js
module.exports = {
  userValidationRules,
  validate,
};
