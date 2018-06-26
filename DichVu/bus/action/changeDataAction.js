var http = require('http')
var common = require('../const')

exports.call = (body,sessions) => {
    return new Promise((resolve, reject) => {
        var data = JSON.parse(body)

        //Kiểm tra session
        var token = data.session
        var index = sessions.indexOf(token)

        if (index == -1) {
            reject(common.ERROR_NO_SESSION);
            return
        }

        //Gọi lên DAL để chỉnh sửa
        var options = {
            host: 'localhost',
            port: 3002,
            path: "/changedata",
            method: "POST",
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        }

        var httpReq = http.request(options, function (response) {
            var dalBody = ''
            response.on('data', (chunk) => {
                dalBody += chunk;
            })

            response.on('error', function () {
                console.log(common.ERROR_CANNOT_READ_FILE)
                reject(common.ERROR_CANNOT_READ_FILE)
                return
            })

            response.on('end', function () {
                console.log("Success")
                resolve(JSON.stringify(data))
                return
            })
        })

        //Trường hợp không kết nối được đến server
        httpReq.on('error', function () {
            console.log(common.ERROR_CANNOT_CONNECT)
            reject(common.ERROR_CANNOT_CONNECT)
            return
        })

        body = JSON.stringify(data)
        httpReq.write(body)
        httpReq.end()
        
        return
    });

}