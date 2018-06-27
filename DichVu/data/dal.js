var http = require('http')
var fs = require('fs')
var xml2js = require('xml2js')
var sha256 = require('js-sha256');
var updateProductAction = require('./action/updateProductAction')
var loginAction = require('./action/loginAction')
var purchaseAction = require('./action/purchaseAction')

var port = 3002

http.createServer((req,res)=>{
	console.log(`${req.method} ${req.url}`);
	switch(req.method){
		case "POST":
			switch(req.url){
				case "/login":{
					var body = ''
					req.on('data',chunk=>{
						body+=chunk
					})

					req.on('end',()=>{
						loginAction.call(body,__dirname+'/DuLieu')
						.then(result=>{
							console.log("Login done")
							res.writeHeader(200, {
								'Content-Type': 'text/plain',
								'Access-Control-Allow-Origin': '*'
							})
							res.end(result)
							return
						})
						.catch(err=>{
							console.log(err.toString())
							res.writeHeader(404, {
								'Content-Type': 'text/plain',
								'Access-Control-Allow-Origin': '*'
							})
							res.end(err.toString())
							return
						})
					})
	    		}
				break

				case "/getProduct":{
					console.log(req.headers.id)
					var product = fs.readFileSync(`./DuLieu/SanPham/${req.headers.id}.xml`,"utf-8")
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
					var body = ''
					req.on('data',chunk=>{
						body+=chunk
					})

					req.on('end',()=>{
						console.log(body)
						var data = JSON.parse(body)
						var id = data.id,
							price = data.price,
							status = data.status

						updateProductAction.call(id,price,status,__dirname+'/DuLieu')
						.then(result=>{
							console.log("Success")
							res.writeHeader(200, {'Content-Type': 'text/xml'})
							res.end(result)
							return
						})
						.catch(err=>{
							console.log(err.toString())
							res.writeHeader(404, {'Content-Type': 'text/plain'})
							res.end(err.toString())
							return
						})
					});
					
				}
				break

				case "/purchase":{
					var body = ''
					req.on('data',chunk=>{
						body+=chunk
					})

					req.on('end',()=>{
						purchaseAction.call(body,__dirname+'/DuLieu')
						.then(result=>{
							console.log("Success")
							res.writeHeader(200, {'Content-Type': 'text/xml'})
							res.end(result)
							return
						})
						.catch(err=>{
							console.log(err.toString())
							res.writeHeader(404, {'Content-Type': 'text/plain'})
							res.end(err.toString())
							return
						})
					})
				}
				break
			}
		break
		case "GET":
		switch(req.url){
				case "/getdata":
					var dir = "./DuLieu/SanPham/";
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
					var dir = "./DuLieu/PhieuBanHang/";
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
				var dir = "./DuLieu/SanPham/";
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