const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const ExpressCache = require('express-cache-middleware')
const cacheManager = require('cache-manager')

// Cache
const cacheMiddleware = new ExpressCache(
	cacheManager.caching({
		store: 'memory', max: 10000, ttl: 3600
	})
)

// Enable Cors
var corsOptions = {
  origin: ['https://paikkatietokanta.net', 'https://www.paikkatietokanta.net']
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();

// Layer the caching in front of the other routes
cacheMiddleware.attach(app)

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello there!" });
});

require("./app/routes/location.routes")(app);

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});