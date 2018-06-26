var xml2js = require('xml2js')
var fs = require('fs')
var common = require('../const')

exports.call = (id,price,status,root) =>{
	return new Promise((resolve,reject)=>{
		var dir = root + `//SanPham//${id}.xml`
		console.log(dir)
		fs.readFile(dir,"utf-8",(err,data)=>{
			if(err){
				reject(common.ERROR_CANNOT_READ_FILE)
				return
			}

			var parser = new xml2js.Parser({explicitArray : true})

			parser.parseString(data,(err,result)=>{
				if(err){
					reject(common.ERROR_CANNOT_PARSE)
					return
				}

				
				var productJson = result["San_Pham"]["$"]
				productJson.Ma_so = id;
				productJson.Gia_ban = price;
				productJson.Tam_ngung = status;
				
				result["San_Pham"]["$"] = productJson

				var builder = new xml2js.Builder({headless:true}); 
				var productXml = builder.buildObject(result);

				fs.writeFile(dir,productXml.toString(),'utf-8',err=>{
					if(err){
						reject(common.ERROR_CANNOT_WRITE_FILE)
						return
					}

					resolve(common.SUCCESS_EDIT_FILE)
					return
				})
			})
		})
	});
}