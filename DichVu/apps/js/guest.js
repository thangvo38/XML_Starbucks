
var data = []; // 0-cafe ; 1-tea ; 2-frap ; 3-creme
function GetData()
{
    var http = new XMLHttpRequest()
    http.open("GET","http://localhost:3002/getdata", true)

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)
        {
            console.log("Response received")
            var xml = (new DOMParser()).parseFromString(http.response,'text/html')
            var temp = xml.getElementsByTagName("San_Pham");
            var cafe = [];tea = [];frap=[];creme=[];
            for(var i = 0;i<temp.length;i++)
            { 
                switch (temp[i].getElementsByTagName("Loai_SP")[0].getAttribute("Ma_Loai"))
                {
                    case "CAFE":
                    cafe.push(temp[i]);
                    break;
                    case "TEA":
                    tea.push(temp[i]);
                    break;
                    case "FRAPBLENDED":
                    frap.push(temp[i]);
                    break;
                    case "FRAPCREAM":
                    creme.push(temp[i]);
                    break;
                }
            }
            data.push(cafe);
            data.push(tea);
            data.push(frap);
            data.push(creme);
            loadAll(data);
        }
        else
        if (http.status == 404)
        {
            console.log("Can't read file from server")
        }
    }

    http.send()
}

function showData(Data,num)
{
    var pic_dir = "img/products/";
    var id;
    var count = 1
    var row = document.createElement("div");
    row.setAttribute("class","row");
    var container_all = document.createElement("div")
    for(var i = 0 ;i<Data[num].length;i++)
    {  
        if (count > 4)
        {
            container_all.appendChild(row);
            count = 1;
            row = document.createElement("div");
            row.setAttribute("class","row") 
        }

        id = Data[num][i].getAttribute("Ma_so");

        var img = document.createElement("img");
        img.setAttribute("class","center-block")
        img.src = pic_dir+ id + ".jpg"
        var img_container = document.createElement("div")
        img_container.setAttribute("class","product-upper")
        img_container.appendChild(img);

        var a = document.createElement("a");
        a.setAttribute("id","L"+id);
        a.setAttribute("type","button");
        a.setAttribute("data-target" , "#productInfo");
        a.onclick = function(){
            var p_id = this.getAttribute("id").slice(1,this.getAttribute("id").length);
            for(var i = 0; i<Data[num].length;i++)
            {
                if(Data[num][i].getAttribute("Ma_so")==p_id)
                {
                    p_id = i;
                    break;
                }
            }
            var p_image = document.getElementById("product_image");      
            p_image.setAttribute("src",pic_dir+Data[num][parseInt(p_id)].getAttribute("Ma_so")+".jpg")
            var p_name = document.getElementById("product_name");
            p_name.innerHTML=Data[num][parseInt(p_id)].getAttribute("Ten")
            var p_price = document.getElementById("product_price");
            p_price.innerHTML = Data[num][parseInt(p_id)].getAttribute("Gia_ban") + " VND";
            var p_type = document.getElementById("product_type");
            p_type.innerHTML = Data[num][parseInt(p_id)].getElementsByTagName("Loai_SP")[0].getAttribute("Ten_Loai")
            var p_info = document.getElementById("product_info");
            p_info.innerHTML = Data[num][parseInt(p_id)].getAttribute("Mo_ta")
        }
        a.setAttribute("data-toggle" , "modal");
        a.setAttribute("data-placement" , "auto top");
        a.setAttribute("data-original-title",Data[num][i].getAttribute("Mo_ta"));
        a.setAttribute("class","text-center");
        a.innerHTML = Data[num][i].getAttribute("Ten");
        var a_container = document.createElement("div")
        a_container.setAttribute("class","nameInList text-center")
        a_container.appendChild(a);

        var ins = document.createElement("ins");
        
        ins.innerHTML = Data[num][i].getAttribute("Gia_ban") + " VND"
        var ins_container = document.createElement("div")
        ins_container.setAttribute("class","product-carousel-price text-center")
        ins_container.appendChild(ins);

        var container = document.createElement("div");
        container.setAttribute("class","col-md-3 single-shop-product")
        container.appendChild(img_container)
        container.appendChild(a_container)
        container.appendChild(ins_container)

        // container_all.appendChild(container)
        
        if (count <= 4)
        {
            row.appendChild(container);
        }
        count++;
    }
    container_all.appendChild(row);
    return container_all;
}

function loadAll(Data)
{
    var coffeeShow = document.getElementById("coffee_show")
    coffeeShow.innerHTML = "";
    coffeeShow.appendChild(showData(Data,0))

    var teaShow = document.getElementById("tea_show")
    teaShow.innerHTML = "";
    teaShow.appendChild(showData(Data,1))

    var frapShow = document.getElementById("frapblended_show")
    frapShow.innerHTML = "";
    frapShow.appendChild(showData(Data,2))

    var creamShow = document.getElementById("frapcream_show")
    creamShow.innerHTML = "";
    creamShow.appendChild(showData(Data,3))
}
