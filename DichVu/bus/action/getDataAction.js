var http = require('http')
var common = require('../const')

exports.call = () => {
    return new Promise((resolve,reject)=>{
        var options = {
            host: 'localhost',
            port: 3002,
            path: "/getdata",
            method: "GET"
        }
    
        var body = ''
        var httpReq = http.get(options, function (response) {
    
            //Lấy kết quả trả về (Nếu thành công: body=chuỗi xml danh sách sản phẩm)
            response.on('data', function (chuck) {
                body += chuck
            })
    
            //Trường hợp lấy được data
            response.on('end', function () {
                if (response.statusCode != 200) {
                    reject(common.ERROR_CANNOT_READ_FILE)
                }
                
                resolve(body)
    
            })
        })
    
        //Trường hợp không kết nối được đến server
        httpReq.on('error', function () {
            reject(common.ERROR_CANNOT_CONNECT)
            return
        })
    })
   
}