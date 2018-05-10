
var data; // 1-cafe ; 2-tea ; 3-frap ; 4-creme

function GetData()
{
    var http = new XMLHttpRequest()
    http.open("POST","http://localhost:3002/GetData, true")

    http.setRequestHeader("Content-type", "text/plain")

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)
        {
            console.log("Response received")
            var xml = (new DOMParser()).parseFromString(http.response,'text/html')
            var temp = xml.getElementsByTagName("SanPham");
            var cafe = [];tea = [];frap=[];creme=[];
            for(var i = 0;i<temp.length;i++)
            { 
                switch (temp.getElementsByTagName("SanPham")[i].getElementsByTagName("LoaiSP").getAttribute("Ma_Loai"))
                {
                    case "CAFE":
                    cafe.push(temp.getElementsByTagName("SanPham")[i]);
                    break;
                    case "TEA":
                    cafe.push(temp.getElementsByTagName("SanPham")[i]);
                    break;
                    case "FRAPBLENDED":
                    cafe.push(temp.getElementsByTagName("SanPham")[i]);
                    break;
                    case "FRAPCREAM":
                    cafe.push(temp.getElementsByTagName("SanPham")[i]);
                    break;
                }
            }
            data.push(cafe);
            data.push(tea);
            data.push(frap);
            data.push(creme);
            showData(data);
        }
        else
        if (http.status == 500)
        {
            console.log("Can't read file from server")
        }
    }

    http.send()
}

function showData(Data)
{
    var pic_dir = "../img/products/";
    var id;
    var coffee_container = document.getElementById("coffee_show")
    for(var i = 0 ;i<Data[0].length;i++)
    {
        id = Data[0].getElementsByTagName("SanPham")[i].getAttribute("Ma_so");
        var img = document.createElement("img");
        img.setAttribute("src",pic_dir+ id + ".jpg")
        var img_container = document.createElement("div")
        img_container.setAttribute("class","product-upper")
        img_container.appendChild(img);

        var a = document.createElement("a");
        a.setAttribute({
            "href" : "/viewProduct?id=" + id, 
            "data-toggle" : "tooltip",
            "data-placement" : "auto top",
            "data-original-title":"",
            "value": ""
        })
        var img_container = document.createElement("div")
        img_container.setAttribute("class","product-upper")
        img_container.appendChild(img);
    }

    /*<div id="listContainer" class="row col-md-8">
        <div class="col-md-3 col-sm-6">
            <div class="single-shop-product">
                <div class="product-upper">
                    <img src={{this.HinhAnh}} alt="">
                </div>
                <div class="nameInList">
                    <a href={{ linkToShop this.MaSP }} data-toggle="tooltip" data-placement="auto top" data-original-title="{{this.TenSP }}" >{{ shortenName this.TenSP}}</a>
                </div>
                <div class="product-carousel-price">
                    <ins>{{ formatCurrency this.GiaBan}} VNĐ</ins>
                </div>
            </div>
        </div>
    </div>*/
}