var http = require('http')
var fs = require('fs')
var xml2js = require('xml2js')
var sha256 = require('js-sha256');
var service = require('/dataService/dataService.js')
var port = 3002

http.createServer((req,res)=>{
	console.log(`${req.method} ${req.url}`);
	switch(req.method){
		case "POST":
			switch(req.url){
				case "/login":{
					var hashCode = ''
					var users = fs.readFileSync("../DuLieu/TaiKhoan/taikhoan.xml","utf-8")
					var parser = new xml2js.Parser()
	    			parser.parseString(users,function(err,result){
	    				console.log(JSON.stringify(result))
	    				var userList = result['DanhSachTaiKhoan']['TaiKhoan']
	    				for(var i = 0;i<userList.length;i++){
	    					var user = userList[i]['$']
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
	                    	res.end("User doesn't exist")
	                    	return
	    				}

		    			res.writeHeader(200, {'Content-Type': 'text/plain'})
		                res.end(hashCode)
		                return
	    			})
	    		}
				break
				case "/getProduct":{
					console.log(req.headers.id)
					var product = fs.readFileSync(`../DuLieu/SanPham/${req.headers.id}.xml`,"utf-8")
					if(product != null){
						console.log(product)
						res.writeHeader(200, {'Content-Type': 'text/xml'})
	                    res.end(product)
	                    return
					}
					else{
						res.writeHeader(404, {'Content-Type': 'text/plain'})
	                    res.end("Can't read file")
	                    return
					}
				}
				break
				case "/changedata":{
					var productXml = fs.readFileSync(`../DuLieu/SanPham/${req.headers.id}.xml`,"utf-8")
					if(productXml != null){
						product
						res.writeHeader(200, {'Content-Type': 'text/xml'})
	                    res.end(product)
	                    return
					}
					else{
						res.writeHeader(404, {'Content-Type': 'text/plain'})
	                    res.end("Can't read file")
	                    return
					}
				}
				break

			}
		break
		case "GET":
		switch(req.url){
				case "/getdata":
					var dir = "../DuLieu/SanPham/";
					var data= "<DanhSach>";
					fs.readdirSync(dir).forEach(files => {
						var file_dir = dir + files
						data += fs.readFileSync(file_dir,"utf-8");
					});
					data += "</DanhSach>"
					if(data != "<DanhSach></DanhSach>"){
						console.log("write SUCC")
						res.setHeader("Access-Control-Allow-Origin", '*')
						res.writeHeader(200, {'Content-Type': 'text/plain'})
	                    res.end(data)
	                    return
					}
					else{
						res.writeHeader(404)
	                    res.end("Can't read file")
	                    return
					}
				break
				case "/getPhieuBanHang":
					var dir = "../DuLieu/PhieuBanHang/";
					var data= "<DanhSach>";
					data += fs.readFileSync(dir + "PhieuBanHang.xml","utf-8");
					data += "</DanhSach>"
					if(data != "<DanhSach></DanhSach"){
						console.log("write SUCC")
						res.setHeader("Access-Control-Allow-Origin", '*')
						res.writeHeader(200, {'Content-Type': 'text/plain'})
						res.write(data)
	                    res.end()
	                    return
					}
					else{
						res.writeHeader(404)
	                    res.end("Can't read file")
	                    return
					}
				break
			}

			if (req.url.split("?")[0] == "/viewProduct")
			{
				var dir = "../DuLieu/SanPham/";
				var data= "<DanhSach>";
				data += fs.readFileSync(dir + "SP_" + req.url.split("?")[1]+".xml","utf-8");
				data += "</DanhSach>"
				if(data != "<DanhSach></DanhSach"){
					console.log("write SUCC")
					res.setHeader("Access-Control-Allow-Origin", '*')
					res.writeHeader(200, {'Content-Type': 'text/plain'})
					res.write(data)
					res.end()
					return
				}
				else{
					res.writeHeader(404)
					res.end("Can't read file")
					return
				}
			}
		break

	}

}).listen(port, (err) => {
    if(err)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})