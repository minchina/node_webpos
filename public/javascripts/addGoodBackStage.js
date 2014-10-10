function save_check(){

    var flag = true;
    $(".form_add input").each(function(){
        if($(this).val()==""){
            flag = false;
        }
    });
    return flag;
}



function attr_check(){
    var flag = true;
    $(".form_attr input").each(function(){
        if($(this).val()==""){
            flag = false;
        }
    });
    return flag;
}


$('.item-count').change(function(){
    var goodNum = parseInt($(this).val());
    var goodId = $(this).closest('.good_body').find('.good_id').text();
    $.post('/addgoodadpage',{good_id:goodId,good_count:goodNum},function(data){

    })
});

$(".delAttrDet").on('click',function(){
    var attr_name = $(this).closest('.good_body').find('.attr_name').text();
    var good_id = $(this).closest('.good_body').find('.hidden').text();
    console.log(good_id);
    if(!confirm("确认要删除该属性吗？")){
        return false;
    }
    $.post('/delAttr2',{attr_name:attr_name,good_id:good_id},function(data){
        window.location.assign('/gooddetail/?goodId='+data.good_id);


    })
});

$(".delAttrAdd").on('click',function(){
    var attrName = $(this).closest(".good_body").find(".attr_name").text();
    $.post('/delAttr1',{attr_name:attrName},function(data){
        window.location.assign('/addgood');
    })
});

$(".remove_good").on('click',function(){
    var THIS =this;
   var good_name = $(this).closest(".good_body").find(".good_name").text();
   var good_id= $(this).closest(".good_body").find(".good_id").text();
    if(!confirm("确认删除"+good_name+"吗")){
        return 0;
    }
    $.post('/deleted',{goodId:good_id},function(data){
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
$('.addgoodadmin').click(function(){
    var THIS=this;
    var goodId = $(this).closest('.good_body').find('.good_id').text();
    var goodNum = $(this).prev().val();
    goodNum = parseInt(goodNum)+1;
    $.post('/addgoodadpage',{good_id:goodId,good_count:goodNum},function(){
        $(THIS).prev().val(goodNum);
    })
});

$(".minusgoodadmin").click(function(){
    var THIS=this;
    var goodId = $(this).closest('.good_body').find('.good_id').text();
    var goodNum = $(this).next().val();
    if(parseInt(goodNum)==0){
        return false;
    }
    goodNum = parseInt(goodNum)-1;
    $.post('/addgoodadpage',{good_id:goodId,good_count:goodNum},function(){
        $(THIS).next().val(goodNum);
    })
});