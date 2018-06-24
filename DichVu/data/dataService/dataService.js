var xml2js = require('xml2js')

exports.updateProduct = (id,price,status) =>{
	var product = fs.readFileSync(`../../DuLieu/SanPham/${id}.xml`,"utf-8")
	
}