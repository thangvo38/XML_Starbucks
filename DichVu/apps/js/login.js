jQuery(document).ready(function($){

	$("#viewEmployee").click(function(){
        console.log("Clicked")
        $.ajax({
            type:"POST",
            headers: {
                "username" : "thangvo",
                "password": "thang123",
                "manager" : false
            },
            error: function(error){
            	alert("Wrong Username or Password")
            },
            success: function(data){
                document.cookie = "session:" + data
                location.reload()
            }
        })
    })
})

