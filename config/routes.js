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
    router.get("/api/headlines", function (req, res) {
        var query = {};
        if (req.query.saved) {
            query = req.query;
        }
        headlinesController.get(query, function(data) {
            res.json(data);
        });
    });
    router.delete("/api/headlines/:id", function(req, res) {
        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function(err, data) {
            res.json(data);
        });
    });
    router.put("/api/headlines", function(req, res) {
        headlinesController.update(req.body, function(err, data) {
            res.json(data);
        });
    });
    router.get("/api/notes/:headline_id?", function(req, res) {
        var query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }
        notesController.get(query, function(err, data) {
            res.jsoon(data);
        });
    });
    router.delete("/api/notes/:id", function(req, res) {
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data) {
            res.json(data);
        });
    });
    router.post("/api/notes", function(req, res) {
        notesController.save(req.body, function(data) {
            res.json(data);
        });
    });
} 