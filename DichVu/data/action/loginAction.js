var http = require('http')
var fs = require('fs')
var xml2js = require('xml2js')
var common = require('../const')
var sha256 = require('js-sha256')

exports.call = (body,root) => {
    return new Promise((resolve, reject) => {
        var data = JSON.parse(body)
        
        var hashCode = ''
        var dir = root + `//TaiKhoan//taikhoan.xml`
        var users = fs.readFileSync(dir, "utf-8")
        var parser = new xml2js.Parser()
        parser.parseString(users, function (err, result) {
            console.log(JSON.stringify(result))
            var name = ''

            var userList = result['DanhSachTaiKhoan']['TaiKhoan']
            for (var i = 0; i < userList.length; i++) {
                var user = userList[i]['$']
                
                if (user.id == data.username &&
                    user.password == data.password && user.QuanLi.toString() == data.manager.toString()) {
                    name = user.ten
                    var isManager = user.QuanLi.toString() == "true" ? "1" : "0"
                    console.log("Is Manager: " + isManager)
                    hashCode = isManager + sha256(user.id + user.password)
                    break
                }
            }

            if (hashCode == '') {
                reject(common.ERROR_NO_USER)
                return
            }

            var info = {
                "name": name,
                "session": hashCode,
            }
            console.log("Info: " + JSON.stringify(info))
            resolve(JSON.stringify(info))
            return
        })
    })

}