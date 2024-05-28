const { Pokemon } = require("../db/sequelize");
const { Op } = require("sequelize");

module.exports = (app) => {
  app.get("/api/pokemons", (req, res) => {
    if (req.query.name) {
      const name = req.query.name;
      const limit = parseInt(req.query.limit) || 5;

      if (name.lenth < 2) {
        const message =
          "Le terme de recherche doit contenir au moins 02 caracteres";
        return res.status(400).json({ message });
      }

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
        order: ["name"],
        limit: limit, // limiter les résultats dynamiquement
        // Explication:
        // L'utilisateur souhaite récupérer 5 pokémons
        // mon-site.com/api/pokemons?limit=5

        // L'utilisateur souhaite récupérer 10 pokémons
        // mon-site.com/api/pokemons?limit=10

        // L'utilisateur souhaite récupérer 1 pokémons
        // mon-site.com/api/pokemons?limit=1

        // Par défault, la limite est à 5 pokémons
        // mon-site.com/api/pokemons
      }).then(({ count, rows }) => {
        const message = `Il y a ${count} pokemons qui corresponde aux termes de recherche ${name} `;
        res.json({ message, data: rows });
      });
    } else {
      Pokemon.findAll({ order: ["name"] })
        //Explication:
        //Cas1: On tri par ordre alphabétique croissant, sur la propriété "name" : ['name','ASC']
        //Cas2: On tri par ordre alphabétique décroissant, sur la propriété "name" : ['name','DESC']

        //Cas3: On tri par ordre alphabétique croissant, sur la propriété "name",
        //(par default) en utilisant un raccourci de syntaxe. Identique au cas n°1 ! : ['name']

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
