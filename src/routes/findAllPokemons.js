const { Pokemon } = require("../db/sequelize");
const { Op } = require("sequelize");

module.exports = (app) => {
  app.get("/api/pokemons", (req, res) => {
    if (req.query.name) {
      const name = req.query.name;
      return Pokemon.findAndCountAll({
        where: {
          name: {
            // 'name' est la propriété du modèle pokémon
            // [Op.eq]: name,  'name' est le critère de la recherche
            [Op.like]: `%${name}%`, // 'name' est le critère de la recherche
            // Explication:
            // On recherche un pokémon qui commence par le terme de recherche :  ${name}%
            // On recherche un pokémon qui qui se termine par le terme de recherche :  %${name}
            // On recherche un pokémon qui qui contient le terme de recherche (notre cas):  %${name}%
          },
        },
        limit: 5, // limiter les résultats à  05
      }).then(({ count, rows }) => {
        const message = `Il y a ${count} pokemons qui corresponde aux termes de recherche ${name} `;
        res.json({ message, data: rows });
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
