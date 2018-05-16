$(document).ready(function(){
	//Gửi request lên server
	SendDataRequest()

	//Lấy thông tin khi bấm nút chỉnh sửa
	$("#submitBtn").click(function(){
		console.log("Clicked")
		var http = new XMLHttpRequest()
		var params = [$("#formID").html(),$("#formPrice").val(),$("#formStatus").is(':checked') ? true:false]
		console.log(params[2])
		// var query = `id=${params[0]}&price=${params[1]}&status=${params[2]}`
		http.open("POST","http://localhost:3001/change")
		http.setRequestHeader("id", params[0])
		http.setRequestHeader("price", params[1])
		http.setRequestHeader("status", params[2])

		http.onreadystatechange = function () {
	        if (http.readyState == 4 && http.status == 200)
	        {
	            alert("Product Updated!")
	            location.reload()
	        }
	        else
	        	if(http.status == 404)
		            alert("Error: Can't load data")
    	}

		http.send()

		
	})
})

function SendDataRequest(){
	var http = new XMLHttpRequest()
    http.open("GET", "http://localhost:3001/getdata", true)
    console.log(document.cookie)
	http.setRequestHeader("token", document.cookie)
    
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)
        {
            console.log("Response received")
            var xml = (new DOMParser()).parseFromString(http.response,'text/xml')
            // console.log(xml)
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
	// console.log(products.length)
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
			// console.log(i)
			for(var j =0;j<5;j++){
				var td = document.createElement("td")
				td.innerHTML = attr[j]
				tr.appendChild(td)
			}

			var td = document.createElement("td")
			var btn = document.createElement("button")
			btn.setAttribute("class","btn btn-info")
			btn.setAttribute("id",attr[0])
			btn.setAttribute("onclick","clickEdit(this.id)")
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

function clickEdit(id){
	var nodes = document.getElementById(id).getElementsByTagName("td")
	console.log(nodes[1].innerHTML)
	console.log(nodes[2].innerHTML)
	console.log(nodes[4].innerHTML)
	$("#formName").html(nodes[1].innerHTML)
	$("#formID").html(nodes[0].innerHTML)
	$("#formPrice").val(nodes[2].innerHTML)
	$("#formStatus").attr("checked",(nodes[4].innerHTML == "Open")? false:true)
}