$(function() {
    // Initialize the twitter buttons
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
    $(".hide-on-start").hide();

    $(".submit-cancel").on("click", function(event) {
        event.preventDefault();
        var id = $(event.target).attr("data-id");
        var displayBox = $('#entry-display-' + id);
        var editBox = $('#entry-edit-' + id);

        editBox.hide();
        displayBox.show();
    });

    $(".entry-edit-ajax").on("click", function(event) {
        event.preventDefault();
        var id = $(event.target).attr("data-id");
        var displayBox = $('#entry-display-' + id);
        var editBox = $('#entry-edit-' + id);

        editBox.show();
        displayBox.hide();
    });

    $(".submit-button").on("click", function(event) {
        event.preventDefault();
        var id = $(event.target).attr("data-id");
        var displayBox = $('#entry-display-' + id);
        var editBox = $('#entry-edit-' + id);
        var editForm = $('#edit-form-' + id);

        var title = $("#title-edit-" + id).val();
        var text = $("#text-edit-" + id).val();
        var action = editForm.attr("action");

        $.ajax({
            method: "POST",
            url: action,
            data: {
                id: id,
                title: title,
                text: text
            }
        }).done(function(response) {
            $("#title-edit-" + id).val(response.entry.title);
            $("#header-link-" + id).text(response.entry.title);
            $("#text-edit-" + id).val(response.entry.text);
            $("#entry-body-" + id).html(response.entry.markdown);
            displayBox.show();
            editBox.hide();
        });
    });

    $("#new_entry").on("click", function(event) {
        event.preventDefault();
        $("#ajax-new-entry").show();
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
            $("#ajax-new-entry").hide();
            $("#no-entries").hide();
            $("#ajax-title").val("");
            $("#ajax-text").val("");
            $("#entry-list").prepend(response);
            twttr.widgets.load();
        });
    });
});
