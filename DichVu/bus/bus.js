var http = require('http')
var fs = require('fs')
var xml2js = require('xml2js')
var querystring = require('querystring');
var sha256 = require('js-sha256');
var port = 3001

//Cache
//Cache danh sách sản phẩm (JSON)
var cacheProducts = {}
//Cache danh sách các token (String Array)
var sessions = []

//Read session from file
function getSession(){
	try
	{
		var data = fs.readFileSync("session.ss","utf-8")
		if(data != null){
			data = data.split('\n')
			sessions = data.filter(word => (word.length > 0 && word != '\n'))
			// console.log(session)
		}
	}
	catch(err){
		console.log("READFILE=>" + err)
	}	
}

function writeSession(){
	try{
		var file = fs.createWriteStream("session.ss");
		file.on('error', function(err) { /* error handling */ });
		sessions.forEach(function(v) { file.write(v+'\n'); });
		file.end();
	}
	catch(err){
		console.log("WRITEFILE=>" + err)
	}
}
//End

http.createServer((req,res)=>{
	console.log(`${req.method} ${req.url}`);

	//Lưu thông tin gửi đến DAL
	var options = {}
	console.log(`${req.method} ${req.url}`)
	switch(req.method){
		case "POST":
			switch(req.url){
				case "/login":
					options = {
						host: 'localhost',
		    			port: 3002,
		    			path: "/login",
		    			method: "POST",
		    			headers: {
		    				"username": req.headers["username"],
		    				"password": req.headers["password"],
		    				"manager": req.headers["manager"]
		    			}
					}

					var body = ''
		    		var httpReq = http.get(options,function (response) {

		    			//Lấy kết quả trả về (Nếu thành công: body=session do BUS cấp)
			            response.on('data',function(chuck){
			                body+=chuck
			            })

			            //Trường hợp tài khoản không hợp lệ
			            response.on('error',function(){
			            	console.log("ERROR=>Can't get data from users file")
		    				res.writeHeader(404, {'Content-Type': 'text/plain'})
		                    res.end("Request was not support!!!")
		                    return
			            })

			            //Trường hợp tài khoản hợp lệ
			            response.on('end',function(){

			            	//Kiểm tra tài khoản đã đang đăng nhập ở browser khác hay chưa, nếu có thì chặn tiến trình này lại
			            	if(sessions.indexOf(body) != -1){
			            		res.writeHeader(404, {'Content-Type': 'text/plain'})
		                    	res.end()
		                    	return
			            	}

			            	if(body != "$"){
			            		sessions.push(body)
			            		writeSession()
			            	}

			            	res.writeHeader(200, {'Content-Type': 'text/plain'})
		                    res.end(body)
		                    return
			            })
			        })

			        //Trường hợp không kết nối được đến server
		            httpReq.on('error',function(){
		            	console.log("Can't connect to DAL Server")
		            	res.writeHead(404, 'Not found')
					    res.end("404 NOT FOUND")
					    return
		            })
				break
				case "/getrole":
					var token = req.headers["session"]
					console.log(token)
					//Trường hợp là khách
					if(token == "$"){
						res.writeHeader(200, {'Content-Type': 'text/plain'})
		                res.end("GUEST")
		                return
					}

					//Trường hợp là nv/ql => Tìm kiếm trong sessions trước
					var index = sessions.indexOf(token)
					if(index != -1){
						var role = (sessions[index][0] == "0") ? "STAFF" : "ADMIN"
						res.writeHeader(200, {'Content-Type': 'text/plain'})
		                res.end(role)
		                return
					}

					//Lỗi
					res.writeHeader(404, {'Content-Type': 'text/plain'})
		            res.end("Request was not support!!!")
				break
				case "/logout":
					var index = sessions.indexOf(req.headers["session"])
					console.log(index)
					//Kiểm tra lỗi
					if(index == -1){
	            		res.writeHeader(404, {'Content-Type': 'text/plain'})
                    	res.end()
                    	return
			        }

			        var token = sessions[index]
			        //Xóa session khỏi cache
			        sessions = sessions.filter(item=>{
			        	item != token
			        })
			        writeSession()
			        res.writeHeader(200, {'Content-Type': 'text/plain'})
		            res.end("Session removed")
		            return
				break
			}
		break
		case "GET":
			switch(req.url){
				case "/getdata":
					if(sessions.indexOf(req.headers["session"]) == -1){
						res.writeHeader(404, {'Content-Type': 'text/plain'})
                    	res.end("Authentication Error")
                    	return
					}

					//Lấy ra từ cache nếu có
					if(cacheProducts != null){
						var builder = new xml2js.Builder({headless:true}); 
						var xml = builder.buildObject(cacheProducts);

						res.writeHeader(200, {'Content-Type': 'text/xml'})
		                res.end(xml)
		                return
					}

					//Trường hợp cache rỗng => Load từ DAL

					options = {
						host: 'localhost',
		    			port: 3002,
		    			path: "/getdata",
		    			method: "GET"
					}

					var body = ''
		    		var httpReq = http.get(options,function (response) {

		    			//Lấy kết quả trả về (Nếu thành công: body=chuỗi xml danh sách sản phẩm)
			            response.on('data',function(chuck){
			                body+=chuck
			            })

			            //Trường hợp không lấy được data
			            response.on('error',function(){
			            	console.log("ERROR=>Can't get data from users file")
		    				res.writeHeader(404, {'Content-Type': 'text/plain'})
		                    res.end("Request was not support!!!")
		                    return
			            })

			            //Trường hợp lấy được data
			            response.on('end',function(){

			            	//Lưu vào cache
			            	if(cacheProducts == null){
			            		var parser = new xml2js.Parser()
	                			parser.parseString(body,function(err,result){
	                				cacheProducts = result
	                				res.writeHeader(200, {'Content-Type': 'text/plain'})
			                    	res.end(body)
			                    	return
	                			})
			            	}
			            	else{
			            		res.writeHeader(200, {'Content-Type': 'text/plain'})
		                    	res.end(body)
		                    	return
		                	}

			            })
			        })

			        //Trường hợp không kết nối được đến server
		            httpReq.on('error',function(){
		            	console.log("Can't connect to DAL Server")
		            	res.writeHead(404, 'Not found')
					    res.end("404 NOT FOUND")
					    return
		            })
				break
				case "/getproduct": //???
					
				break
			}
		break
	}

}).listen(port, (err) => {
    if(err)
        console.log('==> Error: ' + err)
    else{
    	getSession()
        console.log('Server is starting at port ' + port)
    }
})