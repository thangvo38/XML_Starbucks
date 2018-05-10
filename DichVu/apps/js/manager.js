$(document).ready(function(){
	//Gửi request lên server
	SendDataRequest()

	//Lấy thông tin khi bấm nút chỉnh sửa
	$("#editBtn").click(function(){
		$(this).parent().siblings().each(function(){
			
		})
	})
})

function SendDataRequest(){
	var http = new XMLHttpRequest()
    http.open("POST", "http://localhost:3002/getAllProduct", true)
    http.setRequestHeader("Content-type", "text/plain")
        
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)
        {
            console.log("Response received")
            var xml = (new DOMParser()).parseFromString(http.response,'text/xml')
            CreateTable(xml)
        }
        else
            alert("Error: Can't load data")
    }

    http.send()
}

function CreateTable(xml){
	var products = xml.getElementsByTagsName("San_pham")
	for(var i = 0;i<products.length;i++){
		var catg = products[i].getElementsByTagsName("Loai_SP")
		var div = null 
		
		switch(catg.getAttribute("Ma_Loai")){
			case "CAFE":
				div = document.getElementById("coffee").getElementsByTagsName("table")[0]
				break
			case "FRAPBLENDED":
				div = document.getElementById("frapblended").getElementsByTagsName("table")[0]
				break
			case "FRAPCREAM":
				div = document.getElementById("frapcream").getElementsByTagsName("table")[0]
				break
			case "TEA":
				div = document.getElementById("tea").getElementsByTagsName("table")[0]
				break
			default:
				break
		}

		if(div != null){
			var product = `<tr id="${products[i].getAttribute("Ma_so")}">
		<td>${products[i].getAttribute("Ma_so")}</td>
		<td>${products[i].getAttribute("Ten")}</td>
		<td>${products[i].getAttribute("Gia_ban")}</td>
		<td>${products[i].getAttribute("Mo_ta")}</td>
		<td>${products[i].getAttribute("Tam_ngung")==false ? "" : "Tạm ngưng"}</td>
		<td><button id="editBtn" type="button" class="btn btn-info" data-toggle="modal" data-target="#myModal">
          <span class="glyphicon glyphicon-pencil"></span> Chỉnh sửa 
        </button></td>
		</tr>`
			div.innerHTML += products
		}
	}
}