// Import scrape script
var scrape = require("../scripts/scrape");

// Import controllers
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");


// Routes for GET requests to render site pages
module.exports = function(router) {
    // Render Home page
    router.get("/", function(req, res) {
        res.render("home");
    });
    // Render Saved page
    router.get("/saved", function (req, res) {  
        res. render("saved");
    });

    router.get("/api/fetch", function (req, res) {
        headlinesController.fetch(function (err, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "All's quiet, m'lord. Check back on the morrow!"
                });
            } else {
                res.json({
                    message: "Hear ye, hear ye! " + docs.insertedCount + " new articles!"
                });
            }
        });
    });
} 