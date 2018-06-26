var http = require('http')
var fs = require('fs')
var xml2js = require('xml2js')
var url = require('url')
var sha256 = require('js-sha256');
var port = 3001

var changeDataAction = require('./action/changeDataAction')

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

//Cache
//Cache danh sách sản phẩm (JSON)
var cacheProducts = null
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
	var cookie = getCookie(req.headers["token"],"session")

	switch(req.method){
		case "POST":
			switch(req.url){
				//Kiểm tra tài khoản đăng nhập
				case "/login":{
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
			            		console.log("Already login")
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
				}
				break

				//Kiểm tra role để load website
				case "/getrole":{
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
				}
				break

				//Kiểm tra điều kiện để thực hiện đăng xuất
				case "/logout":{
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
				}
				break

				//Thay đổi thông tin sản phẩm
				case "/changedata":{
					var body = ''
					req.on('data',chunk=>{
						body+=chunk
					})
			
					req.on('end',()=>{
						changeDataAction.call(body,sessions)
						.then(result=>{
							console.log("Success")
							//Kiểm tra trong cache
							if(cacheProducts != null){
								var data = JSON.parse(result)
								var products = cacheProducts["DanhSach"]["San_Pham"]
								for(var i =0;i<products.length;i++){
									if(products[i]['$']["Ma_so"] == data.id) {
										products[i]['$']["Gia_ban"] = data.price
										products[i]['$']["Tam_ngung"] = data.status

										cacheProducts["DanhSach"]["San_Pham"][i] = products[i]
										console.log(cacheProducts["DanhSach"]["San_Pham"][i])
										break
									}
								}

								res.writeHeader(200, {
									'Content-Type': 'text/plain',
									'Access-Control-Allow-Origin': '*'
								})
								res.end("Data Changed")
								return
							}
						})
						.catch(err=>{
							res.writeHeader(404, {'Content-Type': 'text/plain'})
							res.end(err)
							return
						})	

					});
					
				}
				break
			}
			break
		case "GET":
			switch(req.url.split('?')[0]){
				//Lấy toàn bộ danh sách sản phẩm
				case "/getdata":{
					console.log(sessions)
					console.log("SESSION: " + cookie)
					// if(sessions.indexOf(cookie) == -1){
					// 	console.log("AUTH ERR")
					// 	res.writeHeader(404, {'Content-Type': 'text/plain'})
	    			// 	res.end("Authentication Error")
	     			//  return
					// }

					if(cacheProducts != null){
						console.log("Cache is not NULL")
						var builder = new xml2js.Builder({headless:true}); 
						var xml = builder.buildObject(cacheProducts);
						res.setHeader("Access-Control-Allow-Origin", '*')
						res.writeHeader(200, {'Content-Type': 'text/plain'})
		                res.end(xml)
		                return
					}

					//Trường hợp cache rỗng => Load từ DAL
					console.log("Cache is NULL")
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
			            		var parser = new xml2js.Parser({explicitArray : false})
	                			parser.parseString(body,function(err,result){
	                				cacheProducts = result
	                				res.setHeader("Access-Control-Allow-Origin", '*')
									res.writeHeader(200, {'Content-Type': 'text/plain'})
			                    	res.end(body)
			                    	return
	                			})
			            	}
			            	else{
			            		res.setHeader("Access-Control-Allow-Origin", '*')
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
				}
				//Lấy chi tiết 1 sản phẩm theo id
				case "/getproduct": 
					var query = url.parse(req.url,true).query
					var cookie = getCookie(req.headers.cookie,"session")

					//Kiểm tra query và session có hợp lệ hay không
					if(query["id"] == null || cookie != '$'){
						res.writeHeader(404, {'Content-Type': 'text/plain'})
                    	res.end("Authentication Error")
                    	return
					}

					//Kiểm tra xem cache có rỗng không
					//TH không rỗng => Load từ cache
					if(cacheProducts != null){
						
					}

					//TH rỗng => ???

					break
			}
			break
		case "OPTIONS":
			switch(req.url){
				//Thay đổi đơn giá bán và trại thái của sản phẩm
				
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