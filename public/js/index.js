$(document).ready(function() {
    var articleContainer = $(".article-container"); // Hook into article-container div
    $(document).on("click", ".btn-save", handleArticleSave); // On-click for "Save Article" button
    $(document).on("click", ".scrape-new", handleArticleScrape); // On-click for "Scrape Ye New Articles" button

    renderPage(); 

    // A function for initially running the page
    function renderPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
        .then(function(data) {
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

    function renderEmpty() {
        var emptyAlert = 
            $([
                '<div class="modal fade" id="exampleModalCenter emptyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">',
                '<div class="modal-dialog modal-dialog-centered" role="document">',
                    '<div class="modal-content">',
                    '<div class="modal-header">',
                        '<h5 class="modal-title" id="exampleModalLongTitle">Zwounds!</h5>',
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">',
                        '<span aria-hidden="true">&times;</span>',
                        '</button>',
                    '</div>',
                    '<div class="modal-body">It appears thou hast no new articles. What wouldst thou do?</div>',
                    '<div class="modal-footer">',
                        '<a class="btn btn-primary scrape-new">Scrape Ye New Articles!</a>',
                        '<a class="btn btn-primary" href="/saved">Saved Articles</a>',
                    '</div>',
                    '</div>',
                '</div>',
                '</div>'
            ].join(""));
        articleContainer.append(emptyAlert);
        $("#emptyModal").modal(options);
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

    function handleArticleSave() {
        var articleToSave = $(this).parents(".card").data();
        articleToSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function (data) {  
            if (data.ok) {
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