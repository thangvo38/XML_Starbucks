var http = require('http')
var common = require('../const')
var sessionAction = require('./sessionAction')
exports.call = (body, userInfo) => {
    return new Promise((resolve, reject) => {
        console.log(body)
        var data = JSON.parse(body)

        if(data.session == "$"){
            resolve(body)
            return
        }

        var options = {
            host: 'localhost',
            port: 3002,
            path: "/login",
            method: "POST",
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        }

        var dalBody = ''
        var httpReq = http.request(options, function (response) {

            //Lấy kết quả trả về (Nếu thành công: body=JSON info {name,session} do BUS cấp)
            response.on('data', function (chuck) {
                dalBody += chuck
            })

          


            //Trường hợp tài khoản hợp lệ
            response.on('end', function () {

                //Trường hợp tài khoản không hợp lệ
                if(response.statusCode != 200){
                    reject(common.ERROR_INVALID_LOGIN)
                    return
                }

                console.log("Chay thanh cong")
                console.log(dalBody)
                var info = JSON.parse(dalBody)
                console.log("UserInfo: " + JSON.stringify(userInfo) )
                //Kiểm tra tài khoản đã đang đăng nhập ở browser khác hay chưa, nếu có thì chặn tiến trình này lại
                if (sessionAction.check(info.session, userInfo) != null) {
                    reject(common.ERROR_DUPLICATED_SESSION)
                    return
                }

                resolve(JSON.stringify(info))
                return
            })
        })

        //Trường hợp không kết nối được đến server
        httpReq.on('error', function () {
            reject(common.ERROR_CANNOT_CONNECT)
            return
        })

        httpReq.write(body)
        httpReq.end()

        return

    })

}