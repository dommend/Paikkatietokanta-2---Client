const db = require("../models");
const Location = db.locations;
const Op = db.Sequelize.Op;
const paginate = require('jw-paginate');

// Retrieve all Locations from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Location.findAll({ where: condition, order: [ [ 'createdAt', 'DESC' ]] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving locations."
      });
    });
};

// Find all and do pagination
exports.findAllPaged = (req, res, next) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Location.findAll({ where: condition, order: [ [ 'createdAt', 'DESC' ]] })
    .then(data => {
      const items = data;
      const page = parseInt(req.query.page) || 1;

      // Get pager object for specified page
      const pageSize = 12;
      const pager = paginate(items.length, page, pageSize);
  
      // Get page of items from items array
      const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

      res.send({pager, pageOfItems});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving locations."
      });
    });
};

// Find all and do long pagination
exports.findAllPagedLong = (req, res, next) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Location.findAll({ where: condition, order: [ [ 'createdAt', 'DESC' ]] })
    .then(data => {
      const items = data;
      const page = parseInt(req.query.page) || 1;

      // Get pager object for specified page
      const pageSize = 50;
      const pager = paginate(items.length, page, pageSize);
  
      // Get page of items from items array
      const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

      res.send({pager, pageOfItems});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving locations."
      });
    });
};

// Retrieve all Locations A-Z from the database.
exports.findAllTitle = (req, res) => {
  Location.findAll({ order: [ [ 'title', 'ASC' ]] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving locations."
      });
    });
};

// Find all markedImportant Location
exports.findAllMarkedImportant = (req, res) => {
  Location.findAll({ where: { markedImportant: true }, order: [ [ 'createdAt', 'DESC' ]] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving locations."
      });
    });
};

// Find a single Location with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Location.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Location with id=" + id
      });
    });
};
