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
}