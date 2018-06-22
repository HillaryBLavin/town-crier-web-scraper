// Require Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var expressBars = require("express-handlebars");
var mongoose = require("mongoose");
// var axios = require("axios");
var cheerio = require("cheerio");

// Connect to server
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();
// Initialize Express router
var router = express.Router();

// Require all models
// var db = require("./models");

// Require routes
require("./config/routes")(router);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";



// Configure Handlebars
app.engine("handlebars", expressBars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Configure middleware
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static(__dirname + "/public"));

app.use(router);

app.listen(PORT, function() {
    console.log("Thou art successfully connected on port " + PORT + "!");
});

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Congratulations! Thou hast caught the mongoose!");
    }
});