jQuery(document).ready(function($){

	$("#logOut").click(function(){
        console.log("Clicked")
        $.ajax({
            type:"POST",
            headers: {
                "action": "logout"
            },
            error: function(error){
            	alert("Wrong Username or Password")
            },
            success: function(data){
                document.cookie = "session:" + ''
                location.reload()
            }
        })
    })
})

