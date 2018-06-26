$(document).ready(function () {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initPage();

    // A function for initially running the page
    function initPage() {
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
        var emptyAlert = $(
        [
            "<div class='alert alert-warning text-center'>",
            "<h4>Zwounds! You've not saved any articles!</h4>",
            "</div>",
            "<div class='card'>",
            "<div class='card-header text-center'>",
            "<h3>Wouldst thou like to browse available articles?</h3>",
            "</div>",
            "<div class='card-body text-center'>",
            "<h4><a href='/'>Browse Articles</a></h4>",
            "</div>",
            "</div>"
        ].join("")
        );
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = [
                "<li class='list-group-item'>",
                "There be nary a note here, m'lord!",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        } else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }


    function createCard(article) {
        var card = 
        $(["<div class='card'>",
            "<h5 class='card-title'>",
            article.headline,
            "<a class='btn btn-danger delete'>",
            "Abandon Article",
            "</a>",
            "<a class='btn btn-info notes'>Taketh a Note</a>",
            "</h5>",
            "<div class='card-body'>",
            "<p class='card-text'>",
            article.summary,
            "</p>",
            "</div",
            "</div>"
        ].join(""));

        card.data("_id", article._id);
        return card;
    }

    function handleArticleDelete() {
        var articleToDelete = $(this).parents(".card").data();
        $(this).parents(".card").remove();
        $.ajax({
                method: "DELETE",
                url: "/api/headlines/" + articleToDelete._id
            })
            .then(function (data) {
                if (data.ok) {
                    initPage();
                }
            });
    }

    function handleArticleNotes() {
        var currentArticle = $(this).parents(".card").data();
        $.get("/api/notes/" + currentArticle._id).then(function (data) {
            var modalText = $("<div class='container-fluid text-center'>").append(
                $("<h4>").text("Thine Notes for Article: " + currentArticle._id),
                $("<hr>"),
                $("<ul class='list-group note-container'>"),
                $("<textarea placeholder='New Note' rows='4' cols='60'>"),
                $("<button class='btn btn-success save'>Save Note</button>")
              );
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
});