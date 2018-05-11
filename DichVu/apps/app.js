var http = require('http')
var fs = require('fs')
var sha256 = require('js-sha256');
var xml2js = require('xml2js')

var port = 3000
var session = []
//Read session from file
function getSession(){
	try
	{
		var data = fs.readFileSync("session.ss","utf-8")
		if(data != null){
			data = data.split('\n')
			session = data.filter(word => (word.length > 0 && word != '\n'))
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
		session.forEach(function(v) { file.write(v+'\n'); });
		file.end();
	}
	catch(err){
		console.log("WRITEFILE=>" + err)
	}
}
//End

//Check Auth
function checkAuth(hash){
    for(var i = 0; i < session.length; i++){
        if(hash == session[i]){
            return true
        }
    }
    return false
}
//End

//Get Cookie
function getCookie(cookie,cname) {
    var name = cname + ":";
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

getSession()
http.createServer((req,res)=>{
    // console.log(`${req.method} ${req.url}`);

	var req_url
	var getPage = false

	var cookie = getCookie(req.headers.cookie,"session")
	//     console.log("cookie: " + cookie)
	// if(cookie != '')
	// 	console.log(cookie)

    if(cookie != '' || (req.headers["username"] != null && req.headers["password"] != null && req.headers["manager"] != null) )
    {
    	var hashCode = (cookie != '') ? cookie : ''

    	switch(req.method){
    		case "POST":
    			//Trường hợp logout
				if(hashCode != '' && req.headers["action"] == 'logout'){
					if(checkAuth(hashCode) === true)
	    			{
	    				session = session.filter(item=>{
	    					item != hashCode
	    				})
			    		writeSession()
			    		res.writeHeader(200, {'Content-Type': 'text/plain'})
			            res.end("Logged Out")
	    			}
	    			else{
	    				res.writeHeader(404, {'Content-Type': 'text/plain'})
	                    res.end("Request was not support!!!")
	    			}
				}

				//Trường hợp là khách
				if(hashCode=="$"){
					//Đọc file session.ss
	    			if(checkAuth(hashCode) === false)
	    			{
	    				session.push(hashCode)
	    				writeSession()
	    			}
	    			res.writeHeader(200, {'Content-Type': 'text/plain'})
	                res.end(hashCode)
	                return
				}

				//Trường hợp là nhân viên/quản lí
    		    //Xử lí username và password có tồn tại hay không
	    		var options ={
	    			host: 'localhost',
	    			port: 3002,
	    			path: "/getUsers",
	    			method: "POST"
	    		}
	    		var body = ""
	    		http.get(options,function (response) {
		            response.on('data',function(chuck){
		                body+=chuck
		            })

		            response.on('error',function(){
		            	console.log("ERROR=>Can't get data from users file")
	    				res.writeHeader(404, {'Content-Type': 'text/plain'})
	                    res.end("Request was not support!!!")
	                    return
		            })

		            response.on('end',function(){
		                var parser = new xml2js.Parser()
		    			parser.parseString(body,function(err,result){
		    				console.log(JSON.stringify(result))
		    				var userList = result['DanhSachTaiKhoan']['TaiKhoan']
		    				for(var i = 0;i<userList.length;i++){
		    					var user = userList[i]['$']
		    					console.log(user)
		    					if(user.id == req.headers["username"] 
		    						&& user.password == req.headers["password"] && user.QuanLi == req.headers["manager"]){
		    						var isManager = (user.QuanLi == 'true') ? '1' : '0'
		    						console.log("Is Manager: " + isManager)
		    						hashCode = isManager + sha256(req.headers["username"] + req.headers["password"])
		    						break
		    					}
		    				}

		    				if(hashCode == ''){
		    					res.writeHeader(404, {'Content-Type': 'text/plain'})
		                    	res.end("User not exists")
		                    	return
		    				}

		    				//Đọc file session.ss
			    			if(checkAuth(hashCode) === false)
			    			{
			    				session.push(hashCode)
			    				writeSession()
			    			}
			    			res.writeHeader(200, {'Content-Type': 'text/plain'})
			                res.end(hashCode)
			                return
		    			})
		            })
		        })

    			break;
    		case "GET":
    			if(checkAuth(hashCode) === true){

    				switch(req.url){
						case '/': //XỬ LÍ ROUTE RA NHỮNG TRANG HTML CHO NHÂN VIÊN/QUẢN LÍ
							if(hashCode == "$") //Là khách
								req_url = "/products.html"
							else
							if(hashCode[0] == '1') //Là quản lí
								req_url = "/products_ql.html"
							else //Là nhân viên
								req_url = "/products_nv.html"
							getPage = true
							break
						default:
							req_url = req.url
							break
					}
    			}
    			else
    			{
    				// CÓ THỂ GỬI THÔNG BÁO VÀ XỬ LÍ XÓA COOKIE Ở CLIENT
    				res.writeHeader(404, {'Content-Type': 'text/plain'})
                    res.end("Request was not support!!!")
                    return
    			}
    			break;
    	}
    }
    else //Chưa đăng nhập
    {
    	switch(req.url){
			case '/':
				req_url = "/index.html"
				getPage = true
				break
			case '/products':
				req_url = "/products.html"
				getPage = true
				break
			default:
				req_url = req.url
				break
		}
    }
	
    if(getPage)
    	console.log(`${req.method} ${req_url}`);

    if(req.method == "GET"){
		var file_extension = req_url.lastIndexOf('.');
	    var header_type = (file_extension == -1 && !getPage)
	                    ? 'text/plain'
	                    : {
	                        '/' : 'text/html',
	                        '.html' : 'text/html',
	                        '.ico' : 'image/x-icon',
	                        '.jpg' : 'image/jpeg',
	                        '.png' : 'image/png',
	                        '.gif' : 'image/gif',
	                        '.css' : 'text/css',
	                        '.js' : 'text/javascript',
	                        '.map' : 'text/plain'
	                        }[ req_url.substr(file_extension) ];

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
	

}).listen(port, (err) => {
    if(err != null)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})