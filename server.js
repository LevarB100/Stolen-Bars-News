const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const databaseUrl = "scraper";
const collections = ["scrapedData"];

const db = mongoose(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
  res.send("Hello");
});

app.get("/all", function(req, res) {
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request via axios for the news section of `yahoo`
  axios.get("www.yahoo.com").then(function(response) {
    // Load the html body from axios into cheerio
    const $ = cheerio.load(response.data);

    const articles = [];
    // For each element with a "title" class
    $(".stretchedbox").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      const title = $(element)
        .parent("a")
        .text();
      const link = $(element)
        .parent("a")
        .attr("href");

      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        articles.push({
          title: title,
          link: link
        });
      }
    });

    db.scrapedData.insert(articles, function(err) {
      if (err) return res.json({ err: err.message });

      // Send a "Scrape Complete" message to the browser
      res.send("Scrape Complete");
    });
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
