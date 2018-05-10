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

				case "/getData":
				var dir = "../DuLieu/SanPham/";
				var data= "";
				fs.readdir(dir, (err, files) => {
					for(var i = 0 ;i<files.length;i++)
					{
						var file_dir = dir + "SP_" + i + ".xml"
						data += fs.readFileSync(file_dir,"utf-8");
					}
				});
				if(data != null){
					res.setHeader("Access-Control-Allow-Origin", '*')
					res.writeHeader(200, {'Content-Type': 'text/plain'})
                    res.end(data)
                    return
				}
				else{
					res.writeHeader(404, {'Content-Type': 'text/plain'})
                    res.end("Can't read file")
                    return
				}
				break;
			}
		break
	}

}).listen(port, (err) => {
    if(err)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})