module.exports = app => {
  const locations = require("../controllers/location.controller.js");

  var router = require("express").Router();

  // Retrieve all Locations
  router.get("/", locations.findAll);

  // Retrieve tags
  router.get ('/tags/:tagID', locations.findByTagID);
  router.get ('/tags/name/:name', locations.findByTagName);
  router.get ('/tags/', locations.findAllTags);

  // Retrieve all markedImportant Locations
  router.get("/markedImportant", locations.findAllMarkedImportant);

  // Retrieve all Locations and do advanced pagination
  router.get("/pages/", locations.findAllAdvance);

  // Retrieve all Titles
  router.get("/title", locations.findAllTitle);

  // Retrieve a single Location with id
  router.get("/:id", locations.findOne);

  app.use('/api/locations', router);
};
