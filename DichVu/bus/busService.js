var http = require('http')
var fs = require('fs')
var xml2js = require('xml2js')
var port = 3001

http.createServer((req,res)=>{
	console.log(`${req.method} ${req.url}`);

}).listen(port, (err) => {
    if(err)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})