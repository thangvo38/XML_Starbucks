jQuery(document).ready(function($){

	$("a#guestSubmit").bind('click',function(){
        document.cookie = "session=$" //đánh dấu tài khoản khách
		$.ajax({
            url: '/',
            type:"POST",
            headers:{
                "guest": true
            },
            error: function(error){
            	alert("Unexpected Error")
            },
            success: function(data){
                location.reload()
                // $("html").empty();
                // $("html").append(data);
            }
        })
	})

	$("#staffSubmit").click(function(){
        $.ajax({
            url: '/',
            type:"POST",
            headers: {
                "username" : $("#staffLoginID").val(),
                "password": $("#staffLoginPassword").val(),
                "manager" : false
            },
            error: function(error){
            	alert("Wrong Username or Password")
            },
            success: function(data){
                document.cookie = "session=" + data
                location.reload()
            }
        })
    })

    $("#adminSubmit").click(function(){
        $.ajax({
            url: '/',
            type:"POST",
            headers: {
                "username" : $("#adminLoginID").val(),
                "password": $("#adminLoginPassword").val(),
                "manager" : true
            },
            error: function(error){
            	alert("Wrong Username or Password")
            },
            success: function(data){
                document.cookie = "session=" + data
                location.reload()
            }
        })
    })
})

