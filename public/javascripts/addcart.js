function addtocart(good_barcode){
    $.post('/addcart',{good_barcode:good_barcode,type:"add"},function(data){
        $('#cart').text(data.total);
        console.log(data.total);
    })
}

$("#confirm").on('click',function(){
    $.get('/confirm',function(){

    })
});

$('.item-add').on('click',function(){
    var THIS = this;
    var good_barcode = $(this).closest('.good_body').find('.item-barcode').text();
    var item_count = $(this).closest('.good_body').find('.item-count');
    item_count.text(parseInt(item_count.text())+1);
    var price = $(this).closest('.good_body').find('.item-price').text();
    $.post('/addcart',{good_barcode:good_barcode,type:"add"},function(data){
        $('#cart').text(data.total);
        $('#total_price').text(data.total_price.toFixed(2)+'元');
        $(THIS).closest('.good_body').find('.item-single-price').text(get_single_price(parseInt(price),parseInt(item_count.text()),data.savecount));
    });
});


$('.item-minus').on('click',function(){
    var THIS = this;
    var good_barcode = $(this).closest('.good_body').find('.item-barcode').text();
    var item_count = $(this).closest('.good_body').find('.item-count');
    if(parseInt(item_count.text())==0){
        return ;
    }
    item_count.text(parseInt(item_count.text())-1);
    var price = $(this).closest('.good_body').find('.item-price').text();
    $.post('/addcart',{good_barcode:good_barcode,type:"minus"},function(data){
        $('#cart').text(data.total);
        $('#total_price').text(data.total_price.toFixed(2)+'元');
        $(THIS).closest('.good_body').find('.item-single-price').text(get_single_price(parseInt(price),parseInt(item_count.text()),data.savecount));

    });

});


function get_single_price(price,count,savecount){
    var text = savecount==0? "":'(原价'+(price*count).toFixed(2)+'元)';
    return (price*(count-savecount)).toFixed(2)+'元'+text;
}