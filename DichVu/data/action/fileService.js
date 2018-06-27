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