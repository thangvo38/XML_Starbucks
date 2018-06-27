var http = require('http')
var fs = require('fs')
var sha256 = require('js-sha256');
var xml2js = require('xml2js')
var url = require('url')
var service = require('../appService/appService')
var logOutAction = require('./action/logOutAction')
var loginAction = require('./action/loginAction')
var loadPageAction = require('./action/loadPageAction')
var changeDataAction = require('./action/changeDataAction')

var port = 3000

//Get Cookie
function getCookie(cookie, cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
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

http.createServer((req, res) => {
	console.log(`${req.method} ${req.url}`);

	//Lấy session của client
	var cookie = getCookie(req.headers.cookie, "session")

	//Lưu thông tin để gửi đến BUS
	var options = {}
	//Biến request lên server khác
	var httpReq

	switch (req.method) {
		case "GET":
			{
				var req_url
				var getPage = false
				switch (req.url.split('?')[0]) {
					case '/':
						{
							if (cookie == '')
								req_url = "/index.html"
							else {
								getPage = true
								loadPageAction.call(res, cookie, __dirname)
							}
						}

						break
					default: //Những file resource
						req_url = req.url
						break
				}

				if (getPage == false) {
					console.log(req_url)
					var file_extension = req_url.lastIndexOf('.');
					var header_type = (file_extension == -1) ? 'text/plain' : getHeaderType(req_url.substr(file_extension))

					// Đọc file theo req gửi từ Client lên (lưu ý, phần này sẽ được call nhiều lần để đọc các file Resource)
					fs.readFile(__dirname + req_url, (err, data) => {
						if (err) {
							// Xử lý phần tìm không thấy resource ở Server
							console.log('==> Error: ' + err)
							console.log('==> Error 404: file not found ' + res.url)

							// Set Header của res thành 404 - Not found (thông báo lỗi hiển thị cho Client --> coi trong phần console của Browser nếu có lỗi)
							res.writeHead(404, 'Not found')
							res.end()
						} else {
							// Set Header cho res (phần header_type đã được xử lý tính toán ở dòng code thứ 16 và 17)
							res.setHeader('Content-type', header_type);
							res.end(data);
							// console.log( req.url, header_type );
						}
					})
				}

				break
			}
	}

}).listen(port, (err) => {
	if (err != null)
		console.log('==> Error: ' + err)
	else
		console.log('Server is starting at port ' + port)
})

function getHeaderType(ext) {
	return {
		'/': 'text/html',
		'.html': 'text/html',
		'.ico': 'image/x-icon',
		'.jpg': 'image/jpeg',
		'.png': 'image/png',
		'.gif': 'image/gif',
		'.css': 'text/css',
		'.js': 'text/javascript',
		'.map': 'text/plain'
	}[ext]
}