$(document).ready(function(){
	//Gửi request lên server
	SendDataRequest()

	//Lấy thông tin khi bấm nút chỉnh sửa
	$("#submitBtn").click(function(){
		var id = $("#formID").html()
		var price = $("#formPrice").val()
		var status = $("#formStatus").is(':checked') ? true:false

		var checkNum = Number(price)
		if(checkNum == NaN || checkNum < 0){
			swal("Invalid Price")
			return
		}

		var data = {
			session: getCookie(document.cookie,"session"),
			id: id,
			price: checkNum,
			status: status
		}
		
		$.ajax({
            type:"POST",
			url: "http://localhost:3001/changedata",
			data: JSON.stringify(data),
            error: function(error){
            	alert("Unexpected Error")
            },
            success: function(data){
				var text = "";
				text+= id + " - ";
				text+= checkNum + " - " + (status == true ? "Closed" : "Open")
				text+= "\n"
                swal("Product Info Updated",text)
                .then( () => {
                    location.reload()
                })
            }
		})
		
	})
})

function SendDataRequest(){
	var http = new XMLHttpRequest()
    http.open("GET", "http://localhost:3001/getdata", true)
    
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)
        {
            console.log("Response received")
            var xml = (new DOMParser()).parseFromString(http.response,'text/xml')
            CreateTable(xml)
        }
        else
        	if(http.status == 404)
	            alert("Error: Can't load data")
    }

    http.send(document.cookie)
}

function CreateTable(xml){
	var products = xml.getElementsByTagName("San_Pham")
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

		var pic_dir = "img/products/";
		if(div != null){
			var tr = document.createElement("tr")
			var attr = [products[i].getAttribute("Ma_so"),
			products[i].getAttribute("Ten"),
			pic_dir + products[i].getAttribute("Ma_so") + ".jpg",
			products[i].getAttribute("Gia_ban"),
			products[i].getAttribute("Mo_ta"),
			products[i].getAttribute("Tam_ngung")=="false" ? "Open" : "Closed"]
			tr.setAttribute("id",attr[0])
			for(var j =0;j<6;j++){
				var td = document.createElement("td")
				if(j!=2){
					td.innerHTML = attr[j]
				} else {
					td.innerHTML = `<img src="${attr[j]}" style="width:150px;height:150px" />`
				}
				tr.appendChild(td)
			}

			var td = document.createElement("td")
			var btn = document.createElement("button")
			btn.setAttribute("class","btn btn-info")
			btn.setAttribute("id",attr[0])
			btn.setAttribute("onclick","return clickEdit(this.id)")
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
	$("#formName").html(nodes[1].innerHTML)
	$("#formID").html(nodes[0].innerHTML)
	$("#inputID").val(nodes[0].innerHTML)
	$("#formPrice").val(Number(nodes[3].innerHTML))
	$("#formStatus").attr("checked",(nodes[5].innerHTML == "Open")? false:true)
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
//End