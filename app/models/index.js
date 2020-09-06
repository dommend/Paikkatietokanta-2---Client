const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const SequelizeSimpleCache = require('sequelize-simple-cache');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
 
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const cache = new SequelizeSimpleCache({
  User: { ttl: 5 * 60  }, // 5 minutes
  Page: {   }, // default ttl is 1 hour
});

const Location = cache.init(sequelize.import('./location.model.js'));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.locations = require("./location.model.js")(sequelize, Sequelize);
db.tags = require("./tag.model.js")(sequelize, Sequelize);

db.tags.belongsToMany(db.locations, {
  through: "locations_tag",
  as: "locations",
  foreignKey: "tag_id",
});
db.locations.belongsToMany(db.tags, {
  through: "locations_tag",
  as: "tags",
  foreignKey: "location_id",
});

module.exports = db;