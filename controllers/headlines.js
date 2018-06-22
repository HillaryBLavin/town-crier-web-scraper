// Import scripts for scraping and creating the current date
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// Import models
var Headline = require("../models/Headline");

module.exports = {
    // Scrape and add new articles to the collection
    fetch: function (cb) {
        scrape(function (data) {
            var articles = data;
            for (var i = 0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }
            // Insert new articles into collection 
            Headline.collection.insertMany(articles, {
                ordered: false
            }, function (err, docs) {
                cb(err, docs);
            });
        });
    },
    // Delete articles
    delete: function(query, cb) {
        Headline.remove(query, cb);
    },
    // Retrieve articles from collection
    get: function(query, cb) {
        Headline.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc) {
            cb(doc);
        });
    },
    // Update articles in collection
    update: function(query, cb) {
        Headline.update({_id: query._id}, {
            $set: query
        }, {}, cb);
    }
};