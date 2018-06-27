var fs = require('fs')
var xml2js = require('xml2js')
var common = require('../const')

exports.getSingleProduct = (id) =>{
    return new Promise((resolve,reject)=>{
        var product = fs.readFileSync(`./DuLieu/SanPham/${id}.xml`,"utf-8")
        var parser = new xml2js.Parser()

        parser.parseString(product,(err,result)=>{
            if(err){
                reject(common.ERROR_CANNOT_PARSE)
                return
            }

            resolve(result)
        })
    })
}

exports.generateProductListXml = (root) => {
    var data= "<DanhSach>";
    fs.readdirSync(root).forEach(files => {
        var file_dir = root + files
        data += fs.readFileSync(file_dir,"utf-8");
    });
    data += "</DanhSach>"

    return data
}