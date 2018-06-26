jQuery(document).ready(function ($) {
    //Log out
    $("#logOut").click(function () {
        console.log("Clicked")

        $.ajax({
            url: '/logout',
            type: "POST",
            error: function (error) {
                alert("ERROR: " + error)
            },
            success: function (data) {
                document.cookie = 'session='
                location.reload()
            }
        })
    })
})