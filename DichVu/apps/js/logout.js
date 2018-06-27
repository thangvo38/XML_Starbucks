jQuery(document).ready(function ($) {
    //Log out
    $("#logOut").click(function () {
        console.log("Clicked")
        var data = {
            session: getCookie(document.cookie,"session")
        }
        $.ajax({
            url: 'http://localhost:3001/logout',
            type: "POST",
            data: JSON.stringify(data),
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

//Get Cookie
function getCookie(cookie,cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return '';
}
//End