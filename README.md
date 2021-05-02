Afin de faire fonctionner cet API, vous devez avoir node.js installé sur votre machine et posseder un compte sur le service Atlas de MongoDB.

Le paquet dot env est installé sur cette API, vous devez donc créer un fichier .env afin de rentrer ces variables.

mongoUser=<"Nom d'utilisateur pour mongo Atlas">
mongoPassword=<"Mot de passe pour mongo Atlas">
cryptKey=<"clef de chiffrage des Email">
tokenKey=<"Clefs de hachage des mots de passe">

Pour lancer l'API, faite "npm start" dans un terminal(afin de lancer dot env avec l'API).
