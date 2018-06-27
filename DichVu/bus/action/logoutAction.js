var http = require('http')
var sessionAction = require('./sessionAction')

exports.call = (body,userInfo) =>{

    var data = JSON.parse(body)
    if(data.session == "$"){
        return userInfo
    }
    
    var info = sessionAction.check(data.session,userInfo)
    if(info === null){
        return null
    }

    console.log("BEFORE:" + JSON.stringify(userInfo))
    userInfo = userInfo.filter(item=>
        item.session != info.session
    )

    console.log("AFTER:" + JSON.stringify(userInfo))
    
    return userInfo

}