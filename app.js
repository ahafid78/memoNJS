const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");

const sequelize = require("./src/db/sequelize");

const app = express();
const port = 3000;

// Ne pas oublier l'installation des middlewares (dans le terminal avec la commande : npm install nom-middleware --save-dev) et l'importation avec : (const nom-middleware = require('nom-depende-middleware'))
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

sequelize.initDb();

// Ici, nous placerons nos futurs points de terminison

require("./src/routes/findAllPokemons")(app);
require("./src/routes/findAllPokemonByPK")(app);
require("./src/routes/createPokemon")(app);
require("./src/routes/updatePokemon")(app);
require("./src/routes/deletePokemon")(app);

// On ajoute la gestion des erreurs 404
const errorHandler = (req, res, next) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer ube autre URL";
  res.status(404).json({ message, data: error });
  next();
};
app.use(errorHandler);

app.listen(port, () =>
  console.log(
    `Notre application Node est démarrée sur : http://localhost:${port}`
  )
);
