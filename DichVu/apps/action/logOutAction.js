var http = require('http')

exports.call = (res,cookie) => {
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
	var httpReq = http.get(options,function (response){
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