var http = require('http')
var fs = require('fs')

exports.call = (res,cookie,root) => {

    var req_url = ''
    var options = {
        host: "localhost",
        port: 3001,
        path: "/getrole",
        method: "POST",
        headers: {
            "session": cookie
        }
    }

    var body = ''
    var httpReq = http.get(options, function (response) {

        //Lấy kết quả trả về (Nếu thành công: body=GUEST hoặc ADMIN hoặc STAFF)
        response.on('data', function (chuck) {
            body += chuck
        })

        //Trường hợp tài khoản không hợp lệ
        response.on('error', function () {
            console.log("Can't return ROLE")
            res.writeHead(404, 'Not found')
            res.end("ERROR")
            return
        })

        //Trường hợp tài khoản hợp lệ
        response.on('end', function () {
            console.log("ROLE= " + body)
            switch (body) {
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
            fs.readFile(root + req_url, (err, data) => {
                if (err) {
                    // Xử lý phần tìm không thấy resource ở Server
                    console.log('==> Error: ' + err)
                    console.log('==> Error 404: file not found ' + res.url)

                    // Set Header của res thành 404 - Not found (thông báo lỗi hiển thị cho Client --> coi trong phần console của Browser nếu có lỗi)
                    res.writeHead(404, 'Not found')
                    res.end()
                    return
                } else {
                    res.setHeader('Content-type', 'text/html')
                    // res.setHeader('Access-Control-Allow-Origin' , '*');
                    res.end(data)
                    return
                }
                return
            })
        })
    })

    //Trường hợp không kết nối được đến server
    httpReq.on('error', function () {
        console.log("Can't connect to BUS Server")
        res.writeHead(404, 'Not found')
        res.end("404 NOT FOUND")
        return
    })


}