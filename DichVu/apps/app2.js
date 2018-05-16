var http = require('http')
var fs = require('fs')
var sha256 = require('js-sha256');
var xml2js = require('xml2js')
var url = require('url')

var port = 3000

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

http.createServer((req,res)=>{
    // console.log(`${req.method} ${req.url}`);

	var req_url
	var getPage = false

	//Lấy session của client
	var cookie = getCookie(req.headers.cookie,"session")

	//Lưu thông tin để gửi đến BUS
	var options = {}
	//Biến request lên server khác
	var httpReq

	switch(req.method){
		case "POST":

			//[START]Trường hợp logout
			if(cookie != '' && req.headers["action"] == 'logout'){
				options = {
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
			//[END] Trường hợp logout

			//[START]Trường hợp là khách
			if(cookie=="$"){
    			res.writeHeader(200, {'Content-Type': 'text/plain'})
                res.end(cookie)
                return
			}
			//[END]Trường hợp là khách


			//[START] Trường hợp là nhân viên/quản lí
			//Kiểm tra request có gửi username và password hay không
			if(req.headers["username"] != null && req.headers["password"] != null && req.headers["manager"] != null){
				//Xử lí username và password có tồn tại hay không
	    		options ={
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

			break;
		case "GET":
			switch(req.url.split('?')[0]){
				case '/':
					if(cookie == '')
						req_url = "/index.html"
					else{
						getPage = true
						options = {
							host: "localhost",
							port: 3001,
							path: "/getrole",
							method: "POST",
							headers:{
								"session": cookie
							}
						}
						var body = ''
			    		var httpReq = http.get(options,function (response) {

			    			//Lấy kết quả trả về (Nếu thành công: body=GUEST hoặc ADMIN hoặc STAFF)
				            response.on('data',function(chuck){
				                body+=chuck
				            })

				            //Trường hợp tài khoản không hợp lệ
				            response.on('error',function(){
				            	console.log("Can't return ROLE")
				            	res.writeHead(404, 'Not found')
							    res.end("ERROR")
				            })

				            //Trường hợp tài khoản hợp lệ
				            response.on('end',function(){
				            	console.log("ROLE= " + body)
				            	switch(body){
				            		case "GUEST":
				            			req_url = "/products.html"
				            			break
				            		case "STAFF":
				            			req_url = "/products_nv.html"
				            			break
				            		case "ADMIN":
				            			req_url = "/products_ql.html"
				            			break
				            		default:
				            			req_url = "/index.html"
				            			break
				            	}
				            	fs.readFile( __dirname + req_url, (err, data)=>{
							        if (err) {
							            // Xử lý phần tìm không thấy resource ở Server
							            console.log('==> Error: ' + err)
							            console.log('==> Error 404: file not found ' + res.url)
							            
							            // Set Header của res thành 404 - Not found (thông báo lỗi hiển thị cho Client --> coi trong phần console của Browser nếu có lỗi)
							            res.writeHead(404, 'Not found')
							            res.end()
							        } else {
							            res.setHeader('Content-type' , 'text/html');
							            res.end(data);
							        }
							        return
							    })
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
					break
				case '/viewProduct':
					var query = url.parse(req.url,true).query
					if(query["id"] == null || cookie != '$'){
						res.writeHead(404, 'Not found')
						res.end("ERROR")
						return
					}

					req_url = "single-product.html"
					break
				default: //Những file resource
					req_url = req.url
					break
			}

			if(getPage == false){
				console.log(req_url)
				var file_extension = req_url.lastIndexOf('.');
			    var header_type = (file_extension == -1) ? 'text/plain' : getHeaderType(req_url.substr(file_extension))

			    // Đọc file theo req gửi từ Client lên (lưu ý, phần này sẽ được call nhiều lần để đọc các file Resource)
			    fs.readFile( __dirname + req_url, (err, data)=>{
			        if (err) {
			            // Xử lý phần tìm không thấy resource ở Server
			            console.log('==> Error: ' + err)
			            console.log('==> Error 404: file not found ' + res.url)
			            
			            // Set Header của res thành 404 - Not found (thông báo lỗi hiển thị cho Client --> coi trong phần console của Browser nếu có lỗi)
			            res.writeHead(404, 'Not found')
			            res.end()
			        } else {
			            // Set Header cho res (phần header_type đã được xử lý tính toán ở dòng code thứ 16 và 17)
			            res.setHeader('Content-type' , header_type);
			            res.end(data);
			            // console.log( req.url, header_type );
			        }
			    })
			}

			break
	}

}).listen(port, (err) => {
    if(err != null)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})

function getHeaderType(ext){
	return {
            '/' : 'text/html',
            '.html' : 'text/html',
            '.ico' : 'image/x-icon',
            '.jpg' : 'image/jpeg',
            '.png' : 'image/png',
            '.gif' : 'image/gif',
            '.css' : 'text/css',
            '.js' : 'text/javascript',
            '.map' : 'text/plain'
            }[ext]
}