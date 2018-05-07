jQuery(document).ready(function($){

	$("#viewEmployee").click(function(){
        console.log("Clicked")
        $.ajax({
            type:"POST",
            headers: {
                "username" : "thangvo",
                "password": "1512526"
            },
            success: function(data){
                document.cookie = "session:" + data
                $.ajax({
                    type:"GET",
                    url:"/",
                    headers: {
                        "username" : "thangvo",
                        "password": "1512526"
                    },
                    success: function(data){
                       $("html").empty();
                       $("html").append(data);
                    }
                })
            }
        })
    })
})

