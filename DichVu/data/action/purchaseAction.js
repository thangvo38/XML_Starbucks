var fs = require('fs')
var xml2js = require('xml2js')
var common = require('../const')
var fileService = require('./fileService')
var shortid = require('shortid')

exports.call = (body, root) => {
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

        var billId = shortid.generate();

        var jsonTemplate = JSON.parse(common.TEMPLATE_BILL.replace(/\s/g, ""))

        //Đưa attribute của Phiếu bán hàng vào
        jsonTemplate["$"]["MaPhieu"] = billId
        jsonTemplate["$"]["Ngay"] = data.date
        jsonTemplate["$"]["HoTen"] = data.cusName
        jsonTemplate["$"]["DienThoai"] = data.cusPhone
        jsonTemplate["$"]["DiaChi"] = data.cusAddress

        //Tìm họ tên nhân viên
        jsonTemplate["$"]["HoTenNhanVien"] = data.userInfo["name"]

        //Tính lại đơn giá và tổng tiền
        //Lấy lại đơn giá mới nhất
        var p_arr = []

        console.log(JSON.stringify(jsonTemplate))
        for (var i = 0; i < data.id.length; i++) {
            var p = fileService.getSingleProduct(data.id[i])
            p_arr.push(p)
        }

        var totalCost = 0
        Promise.all(p_arr).then(result => {
            //Lấy Phiếu bán tổng của nhân viên
                fileService.getBillByUsername(root, data.userInfo["id"])
                    .then(billByUser => {

                        //Thêm Danh sách sản phẩm vào phiếu bán
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
                                    jsonTemplate["Danh_Sach_San_Pham"]["San_Pham"].push(product)

                                    break
                                }
                            }
                        }

                        //Gán tổng tiền
                        jsonTemplate["$"]["TongTien"] = totalCost

                        //Gán Phiếu bán vào danh sách
                        
                        //Kiểm tra Danh sách có rỗng hay chưa    
                        if(billByUser["Danh_Sach_Phieu_Ban_Hang"] == ""){
                            console.log("Null ne")
                            billByUser["Danh_Sach_Phieu_Ban_Hang"] = {}
                            billByUser["Danh_Sach_Phieu_Ban_Hang"]["Phieu_Ban_Hang"] = []
                        }


                        billByUser["Danh_Sach_Phieu_Ban_Hang"]["Phieu_Ban_Hang"].push(jsonTemplate)

                        //Parse ra XML
                        var builder = new xml2js.Builder({
                            headless: true
                        });

                        var billXml = builder.buildObject(billByUser);

                        var dir = root + `//PhieuBanHang//${data.userInfo["id"]}_PhieuBanHang.xml`
                        fs.writeFile(dir, billXml.toString(), 'utf-8', err => {
                            if (err) {
                                reject(common.ERROR_CANNOT_WRITE_FILE)
                                return
                            }

                            var singleBill = builder.buildObject(jsonTemplate)

                            resolve(singleBill.toString())
                            return
                        })
                    })

            })
            .catch(err => {
                reject(err)
                return
            })
    })

}