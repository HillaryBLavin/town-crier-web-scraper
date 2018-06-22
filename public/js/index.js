$(document).ready(function() {
    var articleContainer = $(".article-container"); // Hosaved into article-container div
    $(document).on("click", ".btn.save", handleArticleSave); // On-click for "Save Article" button
    $(document).on("click", ".scrape-new", handleArticleScrape); // On-click for "Scrape Ye New Articles" button

    renderPage(); 

    // A function for initially running the page
    function renderPage() {

        $.get("/api/headlines?saved=false")
        .then(function(data) {
            articleContainer.empty();
            if (data && data.length) {
                renderArticles(data);
            } else {
                renderEmpty();
            }
        });
    }

    // Display articles 
    function renderArticles(articles) {
        var articleCards = [];
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    function createCard(article) {
        var card = 
            $(
                `<div class="row">
                    <div class="col-3">
                        <img src="${article.thumbnail}" alt="Image" class="img-thumbnail">
                    </div>
                    <div class="col-sm-9">
                        <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${article.headline}</h5>
                            <p class="card-text">${article.date}</p>
                            <a class="btn btn-primary save">Save Article</a>
                        </div>
                        </div>
                    </div>
                </div>`
            );
        card.data("_id", article._id);

        return card;
    }

    function renderEmpty() {
        var emptyAlert = $(
        [
            "<div class='alert alert-warning text-center'>",
            "<h4>Uh Oh. Losaveds like we don't have any new articles.</h4>",
            "</div>",
            "<div class='card'>",
            "<div class='card-header text-center'>",
            "<h3>What Would You Like To Do?</h3>",
            "</div>",
            "<div class='card-body text-center'>",
            "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
            "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
            "</div>",
            "</div>"
        ].join("")
        );
        articleContainer.append(emptyAlert);
    }



    function handleArticleSave() {
        var articleToSave = $(this).parents(".card").data();
        articleToSave.saved = true;
        $.ajax({
            method: "PUT",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function (data) {  
            if (data.saved) {
                renderPage();
            }
        });
    }

    function handleArticleScrape() {

        $.get("/api/fetch")
            .then(function(data) {
                renderPage();
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>")
            });
    }
});