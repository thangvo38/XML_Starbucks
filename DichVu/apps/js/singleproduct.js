
var data = []; // 0-cafe ; 1-tea ; 2-frap ; 3-creme

function getURL()
{  
    var url =  window.location.href.split("viewProduct?id=");
    if(url!=null)
        GetData(url)
    else
        console.log("Cannot load page.")
}

function GetData(id)
{
    var http = new XMLHttpRequest()
    http.open("GET","http://localhost:3002/viewProduct?id="+id, true)


    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)
        {
            console.log("Response received")
            var xml = (new DOMParser()).parseFromString(http.response,'text/html')
            var data = xml.getElementsByTagName("San_Pham");
            showData(data);
        }
        else
        if (http.status == 404)
        {
            console.log("Can't read file from server")
        }
    }

    http.send()
}

function showData(Data)
{
    var pic_dir = "img/products/";
    var img = document.getElementById("product_image");
    img.setAttribute("src",pic_dir+Data.getAttribute("Ma_so")+".jpg")
    var name = document.getElementById("product_name");
    name.innerHTML=Data.getAttribute("Ten")
    var price = document.getElementById("product_price");
    price.innerHTML = Data.getAttribute("Gia_ban") + " VND";
    var type = document.getElementById("product_type");
    type.innerHTML = Data.getElementsByTagName("Loai_SP").getAttribute("Ten_Loai")
    var info = document.getElementById("product_info");
    info.innerHTML = Data.getAttribute("Mo_ta")
}
