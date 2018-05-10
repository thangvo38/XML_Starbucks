var http = require('http')
var fs = require('fs')
var xml2js = require('xml2js')
var port = 3002

http.createServer((req,res)=>{
	console.log(`${req.method} ${req.url}`);
	switch(req.method){
		case "POST":
			switch(req.url){
				case "/getUsers":
				var users = fs.readFileSync("../DuLieu/TaiKhoan/taikhoan.xml","utf-8")
				if(users != null){
					console.log(users)
					res.writeHeader(200, {'Content-Type': 'text/plain'})
                    res.end(users)
                    return
				}
				else{
					res.writeHeader(404, {'Content-Type': 'text/plain'})
                    res.end("Can't read file")
                    return
				}
				break


			}
		break
		case "GET":
				case "/getData":
				var dir = "../DuLieu/SanPham/";
				var data= "";
				fs.readdirSync(dir).forEach(files => {
					var file_dir = dir + files
					data += fs.readFileSync(file_dir,"utf-8");
				});
				if(data != null){
					console.log("write SUCC")
					res.setHeader("Access-Control-Allow-Origin", '*')
					res.writeHeader(200)
                    res.end(data)
                    return
				}
				else{
					res.writeHeader(404)
                    res.end("Can't read file")
                    return
				}
				break;
	}

}).listen(port, (err) => {
    if(err)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})