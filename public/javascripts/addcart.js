//var good = require("../../models/good");

function addtocart(good_barcode){
    $.post('/addcart',{good_barcode:good_barcode,type:"add"},function(data){
        $('#cart').text(data.total);

    })
}

$('.item-add').on('click',function(){
    var good_barcode = $(this).closest('.good_body').find('.item-barcode').text();
    var item_count = $(this).closest('.good_body').find('.item-count');
    item_count.text(parseInt(item_count.text())+1);
    $.post('/addcart',{good_barcode:good_barcode,type:"add"},function(data){
        $('#cart').text(data.total);
    })
});


$('.item-minus').on('click',function(){
    var good_barcode = $(this).closest('.good_body').find('.item-barcode').text();
    var item_count = $(this).closest('.good_body').find('.item-count');
    if(parseInt(item_count.text())==0){
        return ;
    }
    item_count.text(parseInt(item_count.text())-1);
    $.post('/addcart',{good_barcode:good_barcode,type:"minus"},function(data){
        $('#cart').text(data.total);
    });

});