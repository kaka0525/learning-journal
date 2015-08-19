$(function() {
    // Initialize the twitter buttons
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
    $(".hide-on-start").hide();

    $(".journal-list-item").on("click", function(event) {
        event.preventDefault();

        var id = $(this).attr("id").split("-")[1];
        $("#edit-form-url").val('/edit/' + id);

        $.ajax ({
            method: "GET",
            url: "/detail/" + id
        })
        .done(function(response) {
            console.log(response);
            $("#entry-title").html(response.entry.title);
            $(".twitter-share-button").attr({
                "data-text": response.entry.title,
                "data-url": window.location.href + 'detail/' + id

            });
            // !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
            $("#entry-text").html(response.entry.text);
            $(".journal-entry").show();
        });
    });

    $("#new_entry").on("click", function (event) {
        event.preventDefault();
        console.log("clicking the new entry button");
        $("#ajax-new-entry").show();
        // $("#edit-header").text("Make a new entry!");
        // $("#edit-form-url").val('/add');
        // $("#in-title").val('');
        // $("journal-entry").hide();
        // $("edit-form-container").show();
    });

    $('#submit-new-ajax').on("click", function(event) {
        event.preventDefault();

        var title = $("#ajax-title").val();
        var text = $("#ajax-text").val();
        var action = $("#ajax-new-entry-form").attr("action");

        $.ajax({
            method: "POST",
            url: action,
            data: {
                title: title,
                text: text
            }
        }).done(function(response) {
            console.log("I got a response!");
            console.log(response);
            $("#ajax-new-entry").hide();
            $("#no-entries").hide();
            $("#ajax-title").val("");
            $("#ajax-text").val("");
            $("#entry-list").prepend(response);
            twttr.widgets.load();
        });
    });

});
