var loginURL = 'http://localhost:3001/login'

jQuery(document).ready(function($){

	$("a#guestSubmit").bind('click',function(){
        document.cookie = "session=$" //đánh dấu tài khoản khách
        var body =  {
            session : "$"
        }
		$.ajax({
            url: loginURL,
            type:"POST",
            data: JSON.stringify(body),
            error: function(error){
                alert(error.toString())
                location.reload()
            },
            success: function(data){
                location.reload()
            }
        })
	})

	$("#staffSubmit").click(function(){
        var jBody = {
            "username" : $("#staffLoginID").val(),
            "password": $("#staffLoginPassword").val(),
            "manager" : false
        }

        $.ajax({
            url: loginURL,
            type:"POST",
            data: JSON.stringify(jBody),
            error: function(error){
                alert(error.toString())
                location.reload()
            },
            success: function(data){
                document.cookie = "session=" + data
                location.reload()
            }
        })
    })

    $("#adminSubmit").click(function(){
        var jBody =  {
            "username" : $("#adminLoginID").val(),
            "password": $("#adminLoginPassword").val(),
            "manager" : true
        }

        $.ajax({
            url: loginURL,
            type:"POST",
            data: JSON.stringify(jBody),
            error: function(error){
                alert(error.toString())
                location.reload()
            },
            success: function(data){
                alert("Logged In")
                document.cookie = "session=" + data
                location.reload()
            }
        })
    })
})

