const { Pokemon } = require("../db/sequelize");

module.exports = (app) => {
  app.get("/api/pokemons", (req, res) => {
    if (req.query.name) {
      const name = req.query.name;
      return Pokemon.findAll({ where: { name: name } }).then((pokemons) => {
        const message = `Il y a ${pokemons.length} pokemons qui corresponde aux termes de recherche ${name} `;
        res.json({ message, data: pokemons });
      });
    } else {
      Pokemon.findAll()
        .then((pokemons) => {
          const message = "La liste des pokémons a bien été récupérée.";
          res.json({ message, data: pokemons });
        })
        .catch((error) => {
          const message = `La liste na pas pue être récupérée, réessayez dans quelques instants`;
          res.status(500).json({ message, data: error });
        });
    }
  });
};
