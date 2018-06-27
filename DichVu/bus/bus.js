var http = require('http')
var fs = require('fs')
var xml2js = require('xml2js')
var url = require('url')
var sha256 = require('js-sha256');
var port = 3001

var changeDataAction = require('./action/changeDataAction')
var purchaseAction = require('./action/purchaseAction')
var sessionAction = require('./action/sessionAction')
var loginAction = require('./action/loginAction')
var getRoleAction = require('./action/getRoleAction')
var logoutAction = require('./action/logoutAction')
var getDataAction = require('./action/getDataAction')

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

//Cache
//Cache danh sách sản phẩm (JSON)
var cacheProducts = null
//Cache danh sách các user
var userInfo = []
// var sessions = []



http.createServer((req, res) => {
	console.log(`${req.method} ${req.url}`);
	//Lưu thông tin gửi đến DAL
	var options = {}
	var cookie = getCookie(req.headers["token"], "session")

	switch (req.method) {
		case "POST":
			switch (req.url) {
				//Kiểm tra tài khoản đăng nhập
				//Client <-> BUS <-> DAL
				case "/login":
					{
						var body = ''
						req.on('data', chunk => {
							body += chunk
						})

						req.on('end', () => {
							loginAction.call(body, userInfo)
								.then(result => {
									var info = JSON.parse(result)

									if (info.session != "$") {
										userInfo.push(info)
										//writeSession()
									}

									res.writeHeader(200, {
										'Content-Type': 'text/plain',
										'Access-Control-Allow-Origin': '*'
									})
									res.end(info.session)
									return

								}).catch(err => {
									console.log(err.toString())
									res.writeHeader(404, {
										'Content-Type': 'text/plain',
										'Access-Control-Allow-Origin': '*'
									})
									res.write(err)
									res.end()
									return
								})
						})
					}
					break

					//Kiểm tra role để load website
					//Client <-> WebServer <-> BUS
				case "/getrole":
					{
						getRoleAction.call(req, res, userInfo)
					}
					break

					//Kiểm tra điều kiện để thực hiện đăng xuất
					//Client <-> BUS
				case "/logout":
					{
						var body = ''
						req.on('data', chunk => {
							body += chunk
						})

						req.on('end', () => {
							var newInfo = logoutAction.call(body, userInfo)
							if (newInfo === null) {
								res.writeHeader(404, {
									'Content-Type': 'text/plain',
									'Access-Control-Allow-Origin': '*'
								})
								res.end()
								return
							} else {
								userInfo = newInfo
								//writeSession()
								res.writeHeader(200, {
									'Content-Type': 'text/plain',
									'Access-Control-Allow-Origin': '*'
								})
								res.write("Session removed")
								res.end()
								return
							}
						})
					}
					break

					//Thay đổi thông tin sản phẩm
					//Client <-> BUS <-> DAL
				case "/changedata":
					{
						var body = ''
						req.on('data', chunk => {
							body += chunk
						})

						req.on('end', () => {
							changeDataAction.call(body, userInfo)
								.then(result => {
									console.log("Success")
									//Kiểm tra trong cache
									if (cacheProducts != null) {
										var data = JSON.parse(result)
										var products = cacheProducts["DanhSach"]["San_Pham"]
										for (var i = 0; i < products.length; i++) {
											if (products[i]['$']["Ma_so"] == data.id) {
												products[i]['$']["Gia_ban"] = data.price
												products[i]['$']["Tam_ngung"] = data.status

												cacheProducts["DanhSach"]["San_Pham"][i] = products[i]
												console.log(cacheProducts["DanhSach"]["San_Pham"][i])
												break
											}
										}				
									}

									res.writeHeader(200, {
										'Content-Type': 'text/plain',
										'Access-Control-Allow-Origin': '*'
									})
									res.end("Data Changed")
									return

								})
								.catch(err => {
									res.writeHeader(404, {
										'Content-Type': 'text/plain',
										'Access-Control-Allow-Origin': '*'
									})
									res.write(err.toString())
									res.end()
									return
								})

						});

					}
					break

					//Mua hàng
					//Client <-> BUS <-> DAL
				case "/purchase":
					{
						var body = ''
						req.on('data', chunk => {
							body += chunk
						})

						req.on('end', () => {
							purchaseAction.call(body, userInfo)
								.then(result => {
									console.log("SUCCAF: " + result)
									res.writeHeader(200, {
										'Content-Type': 'text/xml',
										'Access-Control-Allow-Origin': '*'
									})
									res.write(result)
									res.end()
									return
								})
								.catch(err => {
									res.writeHeader(404, {
										'Content-Type': 'text/plain',
										'Access-Control-Allow-Origin': '*'
									})
									res.write(err)
									res.end()
									return
								})
						})

					}
					break
			}
			break
		case "GET":
			switch (req.url.split('?')[0]) {
				//Lấy toàn bộ danh sách sản phẩm
				//Client <-> BUS <-> DAL
				case "/getdata":
					{
						if (cacheProducts != null) {
							console.log("Cache is not NULL")
							var builder = new xml2js.Builder({
								headless: true
							});
							var xml = builder.buildObject(cacheProducts);

							res.setHeader("Access-Control-Allow-Origin", '*')
							res.writeHeader(200, {
								'Content-Type': 'text/plain',
								'Access-Control-Allow-Origin': '*'
							})
							res.end(xml)
							return
						}

						//Trường hợp cache rỗng => Load từ DAL
						console.log("Cache is NULL")
						getDataAction.call()
						.then(result => {
							//Lưu vào cache
							var parser = new xml2js.Parser({
								explicitArray: false
							})

							parser.parseString(result, function (err, xml) {
								cacheProducts = xml
								res.writeHeader(200, {
									'Content-Type': 'text/plain',
									'Access-Control-Allow-Origin': '*'
								})
								res.end(result)
								return
							})

							// cacheProducts = result
							// res.writeHeader(200, {
							// 	'Content-Type': 'text/plain',
							// 	'Access-Control-Allow-Origin': '*'
							// })
							// res.end(result)
							// return
						})
						.catch(err => {
							res.writeHeader(404, {
								'Content-Type': 'text/plain',
								'Access-Control-Allow-Origin': '*'
							})
							res.end(err.toString())
							return
						})

						break
					}
			}
			break
	}

}).listen(port, (err) => {
	if (err)
		console.log('==> Error: ' + err)
	else {
		//getSession()
		console.log('BUS Server is starting at port ' + port)
	}
})

//Read session from file
// function getSession() {
// 	try {
// 		var data = fs.readFileSync("session.ss", "utf-8")
// 		if (data != null) {
// 			console.log(data)
// 			userInfo = JSON.parse(data)
// 		}
// 	} catch (err) {
// 		console.log("READFILE=>" + err)
// 	}
// }

// function writeSession() {
// 	try {
// 		fs.writeFileSync("session.ss", JSON.stringify(userInfo))
// 	} catch (err) {
// 		console.log("WRITEFILE=>" + err)
// 	}
// }
//End