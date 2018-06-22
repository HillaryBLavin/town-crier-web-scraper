var request = require("request");
var cheerio = require("cheerio");

var scrape = function(cb) {
    request("https://www.independent.co.uk/us", function(err, res, body) {
        var $ = cheerio.load(body);
        var articles = [];
        $("article .content").each(function(i, element) {
            var title = $(this).children(".h1 a").text().trim();
            var image = $(this).children("image_wrapper").attr("data-original");
            var link = $(this).children(".h1 a").attr("href");

            var articleData = {
                headline: title,
                thumbnail: image,
                link: link
            };

            articles.push(articleData);
        });
        cb(articles);
    });
}

module.exports = scrape;