var http = require('http')
var common = require('../const')
var sessionAction = require('./sessionAction')

exports.call = (body, userInfo) => {
    return new Promise((resolve, reject) => {
        var data = JSON.parse(body)

        // data = {
        //     session: ,
        //     id: [],
        //     quantity: [],
        //     cusName : ,
        //     cusPhone : ,
        //     date: 
        // }

        //Kiểm tra session
        console.log("BUS: kiem tra session")
        console.log(JSON.stringify(userInfo))
        console.log(JSON.stringify(data))
        var findInfo = sessionAction.check(data.session, userInfo)
        if (findInfo === null) {
            reject(common.ERROR_NO_SESSION);
            return
        }

        
        data.userInfo = findInfo
        console.log("BUS: data.userInfo = " + data.userInfo)

        //Gọi lên DAL để chỉnh sửa
        var options = {
            host: 'localhost',
            port: 3002,
            path: "/purchase",
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

            response.on('end', function () {
                if(response.statusCode != 200){
                    console.log(common.ERROR_CANNOT_READ_FILE)
                    reject(common.ERROR_CANNOT_READ_FILE)
                    return
                }
                console.log("Success")
                resolve(dalBody)
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
        
    })
}