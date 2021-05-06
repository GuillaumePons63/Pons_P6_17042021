// Permet l'identification des requêtes par token d'accées
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.tokenKey);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      // Déclaration de userIdFromToken qui est utilisé dans le middleware owner
      req.body.userIdFromToken = userId;
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
