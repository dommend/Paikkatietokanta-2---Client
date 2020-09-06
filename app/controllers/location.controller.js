const db = require("../models");
const Location = db.locations;
const Tag = db.tags;
const Op = db.Sequelize.Op;

// Retrieve all Locations and do advanced pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit, listOrder, listTitle) => {
  const { count: totalItems, rows: locations } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, locations, totalPages, currentPage, listOrder, listTitle };
};

exports.findAllAdvance = (req, res) => {
  const { page, size, title, listOrder, listTitle } = req.query;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  const { limit, offset } = getPagination(page, size);

  Location.findAndCountAll({
    where: condition, limit, offset, order: [[`${listTitle}`, `${listOrder}`]],
    include: [
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "tagName"],
        through: {
          attributes: [],
        },
      },
    ]
  })
    .then(data => {
      const response = getPagingData(data, page, limit, listOrder, listTitle);
      res.send(response);
    })
    .catch((err) => {
      console.log(">> Error while retrieving Locations: ", err);
    });
};

// Retrieve all Locations from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Location.findAll({ where: condition, order: [ [ 'createdAt', 'DESC' ]],
  include: [
    {
      model: Tag,
      as: "tags",
      attributes: ["id", "tagName"],
      through: {
        attributes: [],
      },
    },
  ],})
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
  Location.findByPk(id, {
    include: [
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "tagName"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then(data => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while finding location tag: ", err);
    });
};

exports.findByTagID = (req, res) => {
  const tag = req.params.tagID;
  Tag.findByPk(tag, {
    include: [
      {
        model: Location,
        as: "locations",
        attributes: ["id", "title", "description", "featuredImage", "URL", "coordinateN", "coordinateE"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then(data => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while finding location tag: ", err);
    });
};



exports.findByTagName = (req, res) => {
  const tag = req.params.tagName;
  Tag.findAll(tag, {
    include: [
      {
        model: Location,
        as: "locations",
        attributes: ["id", "title"],
        through: {
        },
      },
    ],
  })
    .then(data => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while finding tag: ", err);
    });
};

exports.findAllTags = (req, res) => {
  Tag.findAll({
    // include: [
    //   {
    //     model: Location,
    //     as: "locations",
    //     attributes: ["id", "title"],
    //     through: {
    //       attributes: [],
    //     },
    //   },
    // ],
  })
    .then(data => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while retrieving tags: ", err);
    });
};
