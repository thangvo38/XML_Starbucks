// asdas
var Data;

jQuery(document).ready(function($){
    
    // jQuery sticky Menu
    
	$(".mainmenu-area").sticky({topSpacing:0});
    
    
    $('.product-carousel').owlCarousel({
        loop:true,
        nav:true,
        margin:20,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:2,
            },
            1000:{
                items:4,
            }
        }
    });  
    
    $('.related-products-carousel').owlCarousel({
        loop:true,
        nav:true,
        margin:10,
        responsiveClass:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:3
            }
        }
    });  
    
    $('.brand-list').owlCarousel({
        loop:true,
        nav:true,
        margin:20,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:3,
            },
            1000:{
                items:4,
            }
        }
    });    
    
    
    // Bootstrap Mobile Menu fix
    $(".navbar-nav li a").click(function(){
        $(".navbar-collapse").removeClass('in');
    });    
    
    // jQuery Scroll effect
    $('.navbar-nav li a, .scroll-to-up').bind('click', function(event) {
        var $anchor = $(this);
        var headerH = $('.header-area').outerHeight();
        $('html, body').stop().animate({
            scrollTop : $($anchor.attr('href')).offset().top - headerH + "px"
        }, 1200, 'easeInOutExpo');

        event.preventDefault();
    });    
    
    // Bootstrap ScrollPSY
    // $('body').scrollspy({ 
    //     target: '.navbar-collapse',
    //     offset: 95
    // })      

    $(".search-input").each(function(){
        $(this).width($(this).parent().width())
    })

    $(".search-button").each(function(){
        $(this).width($(".search-input"))
    })

    $('[data-toggle="tooltip"]').tooltip();

    $("#coffee").submit(function(){
        for(var i = 1;i<=20;i++)
        {
            if (i<10){  
                var str = `     
                <div class="col-md-3 col-sm-6">
                    <div class="single-shop-product">
                        <div class="product-upper">
                            <img src="../img/products/CAFE/${ele.id}.jpg" alt="">
                        </div>
                        <div class="nameInList">
                            <a href="single-product.html" data-toggle="tooltip" data-placement="auto top" title='${ele.name}'>${ele.name}</a>
                        </div>
                        <div class="product-carousel-price">
                            <ins>${dotNum(ele.price)}</ins>
                        </div>
                    </div>
                </div>`
                
            }
            else{
              
            }
        }
    })


    $(".dropdown").mouseleave(function(){
        $(this).find(".dropdown-toggle").dropdown("toggle")
    })

//Log out
    $("#logOut").click(function(){
        console.log("Clicked")

        $.ajax({
            url: '/',
            type:"POST",
            headers: {
                "action": "logout"
            },
            error: function(error){
                alert("ERROR: " + error)
            },
            success: function(data){
                document.cookie = 'session='
                location.reload()
            }
        })
    })
    
});