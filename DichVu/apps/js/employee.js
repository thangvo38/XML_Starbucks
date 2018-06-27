
var data = []; // 0-cafe ; 1-tea ; 2-frap ; 3-creme
var num = 1;
var total = 0;
var sp = []
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
            var productname = document.getElementById("product_choose");
            for(var i = 0 ;i<data[0].length;i++)
            {
                while (1)
                {
                    if (data[0][i].getAttribute("Tam_ngung") == "true")
                    {
                        i++;
                        if (i >= data[0].length)
                        {
                            endOfArray = true;
                            break;
                        }
                    }   
                    else{
                        break;
                    }
                }
                var option = document.createElement("option")
                option.value = data[0][i].getAttribute("Ten")
                option.innerHTML = data[0][i].getAttribute("Ten")
                productname.appendChild(option)
            }
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
    var endOfArray = false;
    for(var i = 0 ;i<Data[num].length;i++)
    {  
        while (1)
        {
            if (Data[num][i].getAttribute("Tam_ngung") == "true")
            {
                i++;
                if (i >= Data[num].length)
                {
                    endOfArray = true;
                    break;
                }
            }   
            else{
                break;
            }
        }

        if(endOfArray)
            break;
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
        a.setAttribute("data-toggle" , "tooltip");
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


$('#product_type').change(function(){
    var selectedText = $(this).find("option:selected").val(); 
    var productname = document.getElementById("product_choose");
    productname.innerHTML = "";
    switch (selectedText)
    {
        case "Coffee":
            for(var i = 0 ;i<data[0].length;i++)
            {
                while (1)
                {
                    if (data[0][i].getAttribute("Tam_ngung") == "true")
                    {
                        i++;
                        if (i >= data[0].length)
                        {
                            endOfArray = true;
                            break;
                        }
                    }   
                    else{
                        break;
                    }
                }
                var option = document.createElement("option")
                option.value = data[0][i].getAttribute("Ten")
                option.innerHTML = data[0][i].getAttribute("Ten")
                productname.appendChild(option)
            }
        break;
        
        case "Tea":
            for(var i = 0 ;i<data[1].length;i++)
            {
                while (1)
                {
                    if (data[1][i].getAttribute("Tam_ngung") == "true")
                    {
                        i++;
                        if (i >= data[1].length)
                        {
                            endOfArray = true;
                            break;
                        }
                    }   
                    else{
                        break;
                    }
                }
                var option = document.createElement("option")
                option.value = data[1][i].getAttribute("Ten")
                option.innerHTML = data[1][i].getAttribute("Ten")
                productname.appendChild(option)
            }
        break;

        case "FrapBlended":
            for(var i = 0 ;i<data[2].length;i++)
            {                
                while (1)
                {
                    if (data[2][i].getAttribute("Tam_ngung") == "true")
                    {
                        i++;
                        if (i >= data[2].length)
                        {
                            endOfArray = true;
                            break;
                        }
                    }   
                    else{
                        break;
                    }
                }
                var option = document.createElement("option")
                option.value = data[2][i].getAttribute("Ten")
                option.innerHTML = data[2][i].getAttribute("Ten")
                productname.appendChild(option)
            }
        break;

        case "FrapCream":
            for(var i = 0 ;i<data[3].length;i++)
            {
                while (1)
                {
                    if (data[3][i].getAttribute("Tam_ngung") == "true")
                    {
                        i++;
                        if (i >= data[3].length)
                        {
                            endOfArray = true;
                            break;
                        }
                    }   
                    else{
                        break;
                    }
                }
                var option = document.createElement("option")
                option.value = data[3][i].getAttribute("Ten")
                option.innerHTML = data[3][i].getAttribute("Ten")
                productname.appendChild(option)
            }
        break;
    }
});

$('#product_click').click(function(){
    var quantity = document.getElementById("product_quantity").value;
    if (parseInt(quantity) <= 0 || quantity == "")
        return;
    else{
        var cus_order = document.getElementById("customer_order")
        var type = document.getElementById("product_type").value;
        var name = document.getElementById("product_choose").value;
        var product;
        switch(type)
        {
            case "Coffee":
                for(var i = 0 ;i<data[0].length;i++)
                {
                    if(data[0][i].getAttribute("Ten") == name){
                        product = data[0][i]
                        break;
                    }
                }
            break;
            
            case "Tea":
                for(var i = 0 ;i<data[1].length;i++)
                {
                    if(data[1][i].getAttribute("Ten") == name){
                        product = data[1][i]
                        break;
                    }
                }
            break;

            case "FrapBlended":
                for(var i = 0 ;i<data[2].length;i++)
                {
                    if(data[2][i].getAttribute("Ten") == name){
                        product = data[2][i]
                        break;
                    }
                }
            break;

            case "FrapCream":
                for(var i = 0 ;i<data[3].length;i++)
                {
                    if(data[3][i].getAttribute("Ten") == name){
                        product = data[3][i]
                        break;
                    }
                }
            break;
        }
        var isAvailable = false;
        for(var i = 0;i<sp.length;i++)
        {
            if(sp[i].getAttribute("Ten") == product.getAttribute("Ten"))
            {
                isAvailable = true;
                sp[i].setAttribute("So_luong",parseInt(sp[i].getAttribute("So_luong")) + parseInt(quantity));
                total += parseInt(product.getAttribute("Gia_ban"))*parseInt(quantity);
                var product_row = cus_order.getElementsByTagName("tr")[i];
                product_row.getElementsByTagName("td")[3].innerHTML = parseInt(product_row.getElementsByTagName("td")[3].innerHTML) + parseInt(quantity) 
                product_row.getElementsByTagName("td")[4].innerHTML = parseInt(product.getAttribute("Gia_ban"))* parseInt(product_row.getElementsByTagName("td")[3].innerHTML)
                document.getElementsByClassName("proQuantity")[i].value = parseInt(product_row.getElementsByTagName("td")[3].innerHTML)
                break;
            }
        }
        if (!isAvailable){
            var pro_no = document.createElement("td");
            pro_no.innerHTML = num;
            var pro_name = document.createElement("td");
            pro_name.innerHTML = product.getAttribute("Ten");
            var pro_price = document.createElement("td");
            pro_price.innerHTML = product.getAttribute("Gia_ban")
            var pro_quantity = document.createElement("td");
            pro_quantity.innerHTML = quantity;
            var pro_total = document.createElement("td");
            pro_total.innerHTML = (parseInt(product.getAttribute("Gia_ban"))*parseInt(quantity));
            total += parseInt(product.getAttribute("Gia_ban"))*parseInt(quantity);
            var pro_delBtn = document.createElement("td");
            var delBtn = document.createElement("button")
            delBtn.setAttribute("id","D"+product.getAttribute("Ma_so"))
            delBtn.setAttribute("style","font-size:10px;height: 25px;")
            delBtn.setAttribute("class","delButton btn btn-danger center-block ")
            delBtn.setAttribute("type","button")
            delBtn.innerHTML = "<b>X</b>";  
            pro_delBtn.appendChild(delBtn)
            var row = document.createElement("tr");
            row.innerHTML = `<input class="proId" type="hidden" name="proId" value="${product.getAttribute("Ma_so")}" />`+
            `<input class="proQuantity" type="hidden" name="proQuantity" value="${quantity}" />`
            row.appendChild(pro_no)
            row.appendChild(pro_name)
            row.appendChild(pro_price)
            row.appendChild(pro_quantity)
            row.appendChild(pro_total)
            row.appendChild(pro_delBtn)
            cus_order.appendChild(row);
            var San_Pham = document.createElement("San_Pham");
            San_Pham.setAttribute("Gia_ban",product.getAttribute("Gia_ban"))
            San_Pham.setAttribute("So_luong",quantity)
            San_Pham.setAttribute("Ten",product.getAttribute("Ten"))
            San_Pham.setAttribute("Ma_so",product.getAttribute("Ma_so"))
            sp.push(San_Pham);
            num++;
        }
        var intotal = document.getElementById("customer_order_total");
        intotal.innerHTML=total;

        
    }
})

$('#Buy_button').click(function(){
    if(total == 0)
        return;
    else{
        var ids = []
        $("input.proId").each(function(){
            ids.push($(this).val())
        })

        var quans = []
        $("input.proQuantity").each(function(){
            quans.push($(this).val())
        })

        var data = {
            session: getCookie(document.cookie,"session"),
            id: ids,
            quantity: quans,
            cusName : $('#cusName').val(),
            cusPhone : $('#cusPhone').val(),
            cusAddress: $('#cusAddress').val(),
            date: getCurrentDay()
        }

        $.ajax({
            type:"POST",
			url: "http://localhost:3001/purchase",
			data: JSON.stringify(data),
            error: function(error){
            	alert("Unexpected Error")
            },
            success: function(data){
                var text = "";

                var billSp = data.getElementsByTagName("San_Pham");
                for(var i =0;i<billSp.length;i++)
                {
                    text+= (i+1) + ". " + sp[i].getAttribute("Ten") + " - ";
                    text+= sp[i].getAttribute("So_luong") + "pcs - " + (parseInt(sp[i].getAttribute("So_luong"))*parseInt(sp[i].getAttribute("Gia_ban"))) +" VND"
                    text+= "\n"
                }
                text += "--------------------------------------------------------------------------------\n"
                text += "In total: " + data.getElementsByTagName("root")[0].getAttribute("TongTien") + " VND";
                swal("Order Information:",text)
                .then( () => {
                    location.reload()
                })
            }
		})

    }
})

function getCurrentDay()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

//Get Cookie
function getCookie(cookie,cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return '';
}

$(document).on('click', '.delButton', function () {
    var id = this.id.slice(1,this.id.length);
    for(var i = 0;i<window.sp.length;i++)
    {
        if (window.sp[i].getAttribute("Ma_so") == id)
        {
            window.sp.splice(i,1);
            reUpdateTable();
            break;
        }
    }
});

function reUpdateTable()
{
    var cus_total =  document.getElementById("customer_order_total");
    var cus_order = document.getElementById("customer_order");
    total = 0;
    cus_order.innerHTML = "";
    for(var i = 0;i<sp.length;i++)
    {
        var pro_no = document.createElement("td");
        pro_no.innerHTML = i+1;
        var pro_name = document.createElement("td");
        pro_name.innerHTML = sp[i].getAttribute("Ten");
        var pro_price = document.createElement("td");
        pro_price.innerHTML = sp[i].getAttribute("Gia_ban")
        var pro_quantity = document.createElement("td");
        pro_quantity.innerHTML = sp[i].getAttribute("So_luong");
        var pro_total = document.createElement("td");
        pro_total.innerHTML = (parseInt(sp[i].getAttribute("Gia_ban"))*parseInt(sp[i].getAttribute("So_luong")));
        total += (parseInt(sp[i].getAttribute("Gia_ban"))*parseInt(sp[i].getAttribute("So_luong")));
        var pro_delBtn = document.createElement("td");
        var delBtn = document.createElement("button")
        delBtn.setAttribute("id","D"+sp[i].getAttribute("Ma_so"))
        delBtn.setAttribute("style","font-size:10px;height: 25px;")
        delBtn.setAttribute("class","delButton btn btn-danger center-block ")
        delBtn.setAttribute("type","button")
        delBtn.innerHTML = "<b>X</b>";  
        pro_delBtn.appendChild(delBtn)
        var row = document.createElement("tr");
        row.innerHTML = `<input class="proId" type="hidden" name="proId" value="${sp[i].getAttribute("Ma_so")}" />`+
        `<input class="proQuantity" type="hidden" name="proQuantity" value="${sp[i].getAttribute("So_luong")}" />`
        row.appendChild(pro_no)
        row.appendChild(pro_name)
        row.appendChild(pro_price)
        row.appendChild(pro_quantity)
        row.appendChild(pro_total)
        row.appendChild(pro_delBtn)
        cus_order.appendChild(row);
    }
    cus_total.innerHTML=total;
}