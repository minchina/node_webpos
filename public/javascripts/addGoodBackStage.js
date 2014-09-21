/**
 * Created by cuitmnc on 14-9-21.
 */

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