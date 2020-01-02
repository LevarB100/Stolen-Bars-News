var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = process.env.PORT || 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

//Require our routes
require("./routes/api-routes.js")(app);

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";
mongoose.connect(MONGODB_URI);

// old version
// mongoose.connect("mongodb://localhost/populatedb", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
