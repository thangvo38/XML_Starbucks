exports.check = (session,userInfo)=>{
    //Kiểm tra session
    for(var i =0;i<userInfo.length;i++){
        if(session == userInfo[i].session){
            return userInfo[i]
        }
    }
    return null
}