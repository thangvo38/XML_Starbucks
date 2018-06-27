var fs = require('fs')
var xml2js = require('xml2js')
var common = require('../const')
var fileService = require('./fileService')
var shortid = require('shortid')

exports.call = (body,root) => {
    return new Promise((resolve, reject) => {
        console.log("Start DAL/purchaseAction")
        var data = JSON.parse(body)
        // data = {
        //     userInfo: {},
        //     id: [],
        //     quantity: [],
        //     cusName : ,
        //     cusPhone : ,
        //     cusAddress:,
        //     date: 
        // }

        // var hrTime = process.hrtime();
        // var billId = hrTime[0] * 1000000000 + hrTime[1];

        var billId = data.date.replace(/-/g,"") + shortid.generate();
        console.log(billId)

        var jsonTemplate = JSON.parse(common.TEMPLATE_BILL.replace(/\s/g, ""))
    
        //Đưa attribute của Phiếu bán hàng vào
        jsonTemplate["Phieu_Ban_Hang"]["$"]["MaPhieu"] = billId
        jsonTemplate["Phieu_Ban_Hang"]["$"]["Ngay"] = data.date
        jsonTemplate["Phieu_Ban_Hang"]["$"]["HoTen"] = data.cusName
        jsonTemplate["Phieu_Ban_Hang"]["$"]["DienThoai"] = data.cusPhone
        jsonTemplate["Phieu_Ban_Hang"]["$"]["DiaChi"] = data.cusAddress

        //Tìm họ tên nhân viên
        jsonTemplate["Phieu_Ban_Hang"]["$"]["HoTenNhanVien"] = data.userInfo["name"]

        //Tính lại đơn giá và tổng tiền
        //Lấy lại đơn giá mới nhất
        var p_arr = []

        for (var i = 0; i < data.id.length; i++) {
            var p = fileService.getSingleProduct(data.id[i])
            p_arr.push(p)
        }

        var totalCost = 0
        Promise.all(p_arr).then(result => {
            
            for (var i = 0; i < result.length; i++) {

                for (var j = 0; j < data.quantity.length; j++) {
                    if (result[i]["San_Pham"]["$"]["Ma_so"] == data.id[j]) {
                        //result[i]["San_Pham"]["$"]["So_luong"] = data.quantity[j]

                        var product = {
                            "$": {
                                Ma_so: result[i]["San_Pham"]["$"]["Ma_so"],
                                Ten: result[i]["San_Pham"]["$"]["Ten"],
                                So_luong: data.quantity[j],
                                Gia_ban: result[i]["San_Pham"]["$"]["Gia_ban"]
                            }
                        }

                        //Tính tổng tiền
                        totalCost += data.quantity[j] * result[i]["San_Pham"]["$"]["Gia_ban"]

                        //Thêm sản phẩm vào Json
                        jsonTemplate["Phieu_Ban_Hang"]["Danh_Sach_San_Pham"]["San_Pham"].push(product)

                        break
                    }
                }
            }

            //Gán tổng tiền
            jsonTemplate["Phieu_Ban_Hang"]["$"]["TongTien"] = totalCost

            //Parse ra XML
            var builder = new xml2js.Builder({
                headless: true
            });

            var billXml = builder.buildObject(jsonTemplate);

            var dir = root + `//PhieuBanHang//${billId}.xml`
            fs.writeFile(dir, billXml.toString(), 'utf-8', err => {
                if (err) {
                    reject(common.ERROR_CANNOT_WRITE_FILE)
                    return
                }

                resolve(billXml.toString())
                return
            })
        })
        .catch(err=>{
            reject(err)
            return
        })
    })

}


