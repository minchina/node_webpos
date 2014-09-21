$(".remove_good").on('click',function(){
    var THIS =this;

   var good_name = $(this).closest(".good_body").find(".good_name").text();
    $.post('/deleted',{good_name:good_name},function(data){
        $(THIS).closest(".good_body").remove();
    })
});

$(".addGood").on('click',function(){
    var item = $("#countGood");
    var count = parseInt(item.val())+1;
    item.val(count);


});

$(".minusGood").on('click',function(){
    var item = $("#countGood");
    if(parseInt(item.val())<=0){
        return 0;
    }
    var count = parseInt(item.val())-1;
    item.val(count);


});