var rootNode
var currentPage = 1
var productPerPage = {}
var lastPage

function readXml(dir) {
    console.log(dir)
    var http = new XMLHttpRequest()
    http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log("OK")
            rootNode = http.responseXML
            getProductPerPage(rootNode.getElementsByTagName("Laptop"))
            writeList()
        }
    }

    http.open("GET",dir,true)
    http.send()
    
    console.log("Send")
}

function getProductPerPage(list){
    var i = 0
    lastPage = 1
    while(i < list.length){
        productPerPage[lastPage] = (productPerPage[lastPage] != null) ? productPerPage[lastPage] + 1 : 1
        if( (i!=0 && (i+1)%12 == 0) || i == list.length-1 )
            lastPage++
        i++        
    }
}

$(document).ready(function(){
    $(".pagination").find("a").each(function(){
        $(this).click(function(){
            var attr = $(this).attr("aria-label")
            var check = true
            switch(attr)
            {
                case "Previous":
                    if(currentPage > 1)
                        currentPage-=1
                    else check = false
                break
                case "Next":
                    if(currentPage < lastPage)
                        currentPage+=1
                    else check = false
                break
                default:
                    currentPage = parseInt($(this).html())
                break
            }

            if(check){
                var div = document.getElementById('listContainer');
                while (div.firstChild)
                    div.removeChild(div.firstChild);
                
                writeList()
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        })
    })
})

function writeList(){
    console.log("writing")
    var products = rootNode.getElementsByTagName("Laptop")
    var result = ``
    var startPos = 12*currentPage - 12
    var len = startPos + productPerPage[currentPage]
    
    for(var i = startPos;i<len;i++)
    {
        var ele = {
            id : products[i].getAttribute("MaSP"),
            name : products[i].getAttribute("Ten"),
            price : products[i].getAttribute("GiaBan")
        }

        var str = `<div class="col-md-3 col-sm-6">
                        <div class="single-shop-product" style="height:350px">
                            <div class="product-upper">
                                <img style="width:262.5px;height:145.91px" src="../img/products/${ele.id}.jpg" alt="">
                            </div>
                            <div style="width:250px;word-wrap: break-word">
                                <h2><a href="single-product.html">${ele.name}</a></h2>
                            </div>
                            <div class="product-carousel-price">
                                <ins>${dotNum(ele.price)} VNĐ</ins>
                            </div>  
                            
                            <div class="product-option-shop">
                                <a class="add_to_cart_button" data-quantity="1" data-product_sku="" data-product_id="70" rel="nofollow" href="/canvas/shop/?add-to-cart=70">Add to cart</a>
                            </div>                       
                        </div>
                    </div>`

        result+=str
    }
    document.getElementById("listContainer").innerHTML = result
    console.log("done")
    
}

function dotNum(num){
    for(var i = num.length-3;i>0;i-=3)
        num = num.slice(0,i) + "." + num.slice(i)
    return num
}
