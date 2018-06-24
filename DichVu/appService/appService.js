exports.logOutService = (req,res,cookie) => {
	var options = {
					host: "localhost",
					port: 3001,
					path: "/logout",
					method: "POST",
					headers: {
						"session": cookie
					}
				}

	var body = ''
	httpReq = http.get(options,function (response){
		response.on('data',function(chuck){
            body+=chuck
        })

        response.on('error',function(){
        	console.log("ERROR=>Can't post data from users file")
			res.writeHeader(404, {'Content-Type': 'text/plain'})
            res.end("Request was not support!!!")
            return
        })

   		response.on('end',function(){
   			console.log("Logout success")
   			res.writeHeader(200, {'Content-Type': 'text/plain'})
        	res.end("Logged Out")
        	return
   		})
	})

	//Trường hợp không kết nối được đến server
    httpReq.on('error',function(){
    	console.log("Can't connect to BUS Server")
    	res.writeHead(404, 'Not found')
	    res.end("404 NOT FOUND")
	    return
    })
}

exports.loginService = (req,res,cookie) => {
	//Xử lí username và password có tồn tại hay không
	var options ={
		host: 'localhost',
		port: 3001,
		path: "/login",
		method: "POST",
		headers: {
			"username": req.headers["username"],
			"password": req.headers["password"],
			"manager": req.headers["manager"]
		}
	}

	var body = ''
	httpReq = http.get(options,function (response) {

		//Lấy kết quả trả về (Nếu thành công: body=session do BUS cấp)
        response.on('data',function(chuck){
            body+=chuck
        })

        //Trường hợp tài khoản không hợp lệ
        //Thực hiện các POST của nhân viên/quản lí ở đây
        response.on('error',function(){
        	console.log("ERROR=>Can't get data from users file")
			res.writeHeader(404, {'Content-Type': 'text/plain'})
            res.end("Request was not support!!!")
            return
        })

        //Trường hợp tài khoản hợp lệ
        response.on('end',function(){
        	res.writeHeader(200, {'Content-Type': 'text/plain'})
            res.end(body)
            return
        })
    })

    //Trường hợp không kết nối được đến server
    httpReq.on('error',function(){
    	console.log("Can't connect to BUS Server")
    	res.writeHead(404, 'Not found')
	    res.end("404 NOT FOUND")
	    return
    })
}