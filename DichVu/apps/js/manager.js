$(document).ready(function(){

	//Gửi request lên server
	$.ajax({
		url: "/getAllProduct",
		type:"GET",
		error: function(error){
			alert("Error: " + error)
		},
		success: function(xml){
			CreateTable(xml);
		}
	})

})

function CreateTable(xml){
	var products = xml.getElementsByTagsName("San_pham")
	for(var i = 0;i<products.length;i++){
		
	}
}