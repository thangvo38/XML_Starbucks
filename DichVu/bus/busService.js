var http = require('http')
var fs = require('fs')
var xml2js = require('xml2js')
var querystring = require('querystring');
var port = 3001

http.createServer((req,res)=>{
	console.log(`${req.method} ${req.url}`);
	if(req.method == "POST"){
		var queries = querystring.parse(req.url.split('?')[1])
		if(queries.id != null){
			var options ={
    			host: 'localhost',
    			port: 3002,
    			path: "/getProduct",
    			method: "POST",
    			headers: {"id":queries.id}
	    	}
			var body = ""
    		http.get(options,function (response) {
	            response.on('data',function(chuck){
	                body+=chuck
	            })

	            response.on('error',function(){
	            	console.log("ERROR=>Can't get data from users file")
    				res.writeHeader(404, {'Content-Type': 'text/plain'})
                    res.end("Request was not support!!!")
                    return
	            })

	            response.on('end',function(){
	                var parser = new xml2js.Parser()
	                parser.parseString(body,function(err,result){
	                	if(result != null){
	                		result['San_Pham']['$']['Gia_ban'] = queries.price
	                		result['San_Pham']['$']['Tam_ngung'] = queries.status

		    				//Chuyển từ JSON sang XML mà ko có dòng header (<?xml .... />)
	                		var builder = new xml2js.Builder({headless:true}); 
							var xml = builder.buildObject(result);
							fs.writeFileSync(`../DuLieu/SanPham/${queries.id}.xml`,xml)
							res.setHeader("Access-Control-Allow-Origin", '*')
	                		res.writeHeader(200, {'Content-Type': 'text/plain'})
				            res.end()
				            return
	                	}
	                })
	    			
	            })
	        })
		}
	}

}).listen(port, (err) => {
    if(err)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})