$(document).ready(function() {
  //When the 'Scrape all articles' button is clicked
  $(document).on("click", "#scrape-articles", function(data) {
    console.log("Scrape articles button clicked");
    $.get("/scrape", function(data) {
      console.log(data.nInserted);
      $("#new-article-statement").text(
        "Number of new articles: " + data.nInserted
      );
      $(".new-article-modal").modal("show");
      shownews(data);
    });
  });

  function shownews() {
    $("#article-container").empty();
    $.getJSON("/articles", function(data) {
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#article-container").prepend(
          "<tr><td><h5><a href ='" +
            data[i].link +
            "'>" +
            data[i].title +
            "</a></h5>" +
            "<h6>" +
            data[i].summary +
            "</h6>" +
            "<td></td>" +
            "</td><td><button class='save-article-btn btn btn-info btn-sm' article-id='" +
            data[i]._id +
            "'>Save Article</button></td><tr>"
        );
      }
    });
  }

  // When a Save Article button is clicked
  $(document).on("click", ".save-article-btn", function(data) {
    var thisID = $(this).attr("article-id");
    $.ajax({
      type: "PUT",
      url: "/saved/" + thisID
    });
    unsavednews();
  });

  function unsavednews() {
    $("#article-container").empty();
    $.getJSON("/unsaved", function(data) {
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#article-container").prepend(
          "<tr><td><h5><a href ='" +
            data[i].link +
            "'>" +
            data[i].title +
            "</a></h5>" +
            "<h6>" +
            data[i].summary +
            "</h6>" +
            "<td></td>" +
            "</td><td><button class='save-article-btn btn btn-info' article-id='" +
            data[i]._id +
            "'>Save Article</button></td><tr>"
        );
      }
    });
  }

  //When the 'View saved articles' button is clicked
  $(document).on("click", "#saved-articles", function(data) {
    console.log("Saved button clicked");
    $.get("/saved", function(data) {
      savednews(data);
    });
  });

  function savednews() {
    $("#article-container").empty();
    $.getJSON("/saved", function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#article-container").prepend(
          "<tr><td><h5><a href ='" +
            data[i].link +
            "'>" +
            data[i].title +
            "</a></h5>" +
            "<h6>" +
            data[i].summary +
            "</h6>" +
            "<td></td>" +
            "</td><td><button class='article-notes-btn btn btn-secondary btn-sm' article-id='" +
            data[i]._id +
            "'>Article Notes</button></td><td><button class='delete-from-saved-btn btn btn-danger btn-sm' article-id='" +
            data[i]._id +
            "'>Delete from Saved</button></td><tr>"
        );
      }
    });
  }

  // When a 'Delete from Saved' button is clicked from saved articles
  $(document).on("click", ".delete-from-saved-btn", function(data) {
    var thisID = $(this).attr("article-id");
    $.ajax({
      type: "GET",
      url: "/deleteArticle/" + thisID
    });
    savednews();
  });

  let articleID;

  //When the 'Article Notes' button is clicked
  $(document).on("click", ".article-notes-btn", function(data) {
    // console.log("Article Notes button clicked");
    $("#posted-notes").text("");
    articleID = $(this).attr("article-id");
    // console.log("Article note ID: " + articleID);
    $.ajax({
      type: "GET",
      url: "/populated/" + articleID
    }).then(function(data) {
      console.log(data);
      if (data) {
        for (i = 0; i < data[0].notes.length; i++) {
          $("#posted-notes").append("<p>" + data[0].notes[i].comment + "</p>");
        }
      }
    });
    $(".notes-modal").modal("show");
  });

  // When the 'Save Note' button is clicked in the modal
  $(docum).on("click", "#save-note-btn", function(data) {
    console.log("Save note button clicked");
    $.ajax({
      type: "POST",
      url: "/savenote/" + articleID,
      data: {
        comment: $("#newCommentID").val()
      }
    });
    $("#newCommentID").val("");
  });

  // When a 'Delete Existing Notes' button is clicked in the modal
  $(document).on("click", "#delete-note-btn", function(data) {
    console.log("Delete note button clicked");
    // var thisID = $(this).attr("article-id");
    $.ajax({
      type: "POST",
      url: "/deleteNote/" + articleID
    });
    $("#posted-notes").val("");
  });
});
