$(document).ready(function(){
	//Gửi request lên server
	SendDataRequest()

	//Lấy thông tin khi bấm nút chỉnh sửa
	$(".editBtn").click(function(){
		$(this).parent().siblings().each(function(){

		})
	})
})

function SendDataRequest(){
	var http = new XMLHttpRequest()
    http.open("GET", "http://localhost:3002/getData", true)
        
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)
        {
            console.log("Response received")
            var xml = (new DOMParser()).parseFromString(http.response,'text/xml')
            console.log(xml)
            CreateTable(xml)
        }
        else
        	if(http.status == 404)
	            alert("Error: Can't load data")
    }

    http.send()
}

function CreateTable(xml){
	var products = xml.getElementsByTagName("San_Pham")
	console.log(products.length)
	for(var i = 0;i<products.length;i++){
		var catg = products[i].getElementsByTagName("Loai_SP")[0]
		var div = null 
		
		switch(catg.getAttribute("Ma_Loai")){
			case "CAFE":
				div = document.getElementById("coffee").getElementsByTagName("tbody")[0]
				break
			case "FRAPBLENDED":
				div = document.getElementById("frapblended").getElementsByTagName("tbody")[0]
				break
			case "FRAPCREAM":
				div = document.getElementById("frapcream").getElementsByTagName("tbody")[0]
				break
			case "TEA":
				div = document.getElementById("tea").getElementsByTagName("tbody")[0]
				break
			default:
				break
		}

		if(div != null){
			var tr = document.createElement("tr")
			var attr = [products[i].getAttribute("Ma_so"),
			products[i].getAttribute("Ten"),
			products[i].getAttribute("Gia_ban"),
			products[i].getAttribute("Mo_ta"),
			products[i].getAttribute("Tam_ngung")=="false" ? "Open" : "Closed"]
			tr.setAttribute("id",attr[0])
			console.log(i)
			for(var j =0;j<5;j++){
				var td = document.createElement("td")
				td.innerHTML = attr[j]
				tr.appendChild(td)
			}

			var td = document.createElement("td")
			var btn = document.createElement("button")
			btn.setAttribute("class","btn btn-info editBtn")
			btn.setAttribute("data-toggle","modal")
			btn.setAttribute("data-toggle","modal")
			btn.setAttribute("data-target","#myModal")

			var span = document.createElement("span")
			span.setAttribute("class","glyphicon glyphicon-pencil")
			btn.appendChild(span)
			btn.innerHTML = "Edit"

			td.appendChild(btn)
			tr.appendChild(td)

			div.appendChild(tr)

		}
	}
}