var sessionAction = require('./sessionAction')

exports.call = (req,res,userInfo) => {
    var token = req.headers["session"]

    //Trường hợp là khách
    if (token == "$") {
        res.writeHeader(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
        })
        res.end("GUEST")
        return
    }

    //Trường hợp là nv/ql => Tìm kiếm trong sessions trước
    var info = sessionAction.check(token,userInfo)
    if (info != null) {
        var role = (info.session[0] == "0") ? "STAFF" : "ADMIN"
        res.writeHeader(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
        })
        res.end(role)
        return
    }

    //Lỗi
    res.writeHeader(404, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    })
    res.end("Request was not support!!!")
}