$(document).ready(function () {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    renderPage();

    // A function for initially running the page
    function renderPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=true")
            .then(function (data) {
                if (data && data.length) {
                    renderArticles(data);
                } else {
                    renderEmpty();
                }
            });
    }

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
                '<div class="modal-body">It appears thou hast no saved articles. Wouldst thou like to browse available articles?</div>',
                '<div class="modal-footer">',
                '<a class="btn btn-primary" href="/">Verily!</a>',
                '</div>',
                '</div>',
                '</div>',
                '</div>'
            ].join(""));
        articleContainer.append(emptyAlert);
        $("#emptyModal").modal(options);
    }

    function renderNotesList(data) {
        var NotesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = [
                "<li class='list-group-item'>",
                "There be nary a note here, m'lord!",
                "</li>"
            ].join("");
            NotesToRender.push(currentNote);
        } else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                NotesToRender.push(currentNote);
            }
        }
        $(".note-container").append(NotesToRender);
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
                            <a class="btn btn-danger delete">Delete Article</a>
                            <a class="btn btn-info notes">Article Notes</a>
                        </div>
                        </div>
                    </div>
                </div>`
            );
        card.data("_id", article._id);

        return card;
    }

    function handleArticleDelete() {
        var articleToDelete = $(this).parents(".card").data();
        $.ajax({
                method: "DELETE",
                url: "/api/headlines/" + articleToDelete._id
            })
            .then(function (data) {
                if (data.ok) {
                    renderPage();
                }
            });
    }

    function handleNoteSave() {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function () {
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            bootbox.hideAll();
        });
    }
    
    function handleArticleNotes() {
        var currentArticle = $(this).parents(".card").data();
        $.get("/api/notes/" + currentArticle._id).then(function (data) {
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes for Article: ",
                currentArticle._id,
                "</h4>",
                "<ul class='list-group' note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Thine Note</button>",
                "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };

            $(".btn.save").data("article", noteData);

            renderNotesList(noteData);
        });
    }





})