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
    var good_count = parseInt($(this).val());
    var good_name = $(this).closest('.good_body').find('.good_name').text();
    $.post('/editGoodNum',{goodName:good_name,goodCount:good_count},function(data){

    })
});

$(".delAttrDet").on('click',function(){
    var attr_name = $(this).closest('.good_body').find('.attr_name').text();
    var good_name = $(this).closest('.good_body').find('.hidden').text();
    if(!confirm("确认要删除该属性吗？")){
        return false;
    }
    $.post('/delAttr2',{attr_name:attr_name,good_name:good_name},function(data){
        window.location.assign('/gooddetail/?good_name='+data.good_name);


    })
});

$(".delAttrAdd").on('click',function(){
    var THIS = this;
    var attrName = $(this).closest(".good_body").find(".attr_name").text();
    $.post('/delAttr1',{attr_name:attrName},function(data){
        window.location.assign('/addgood');
    })
});

$(".remove_good").on('click',function(){
    var THIS =this;
   var good_name = $(this).closest(".good_body").find(".good_name").text();
    if(!confirm("确认删除"+good_name+"吗")){
        return 0;
    }
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

$(".addgoodadmin").on('click',function(){
    var THIS=this;
    var goodName = $(this).closest('.good_body').find('.good_name').text();
    var goodNum = $(this).closest('.good_body').find('.shopNum').text();
    goodNum = parseInt(goodNum)+1;
    $.post('/addgoodadpage',{good_name:goodName,good_count:goodNum},function(data){
        $(THIS).closest('.good_body').find('.shopNum').text(goodNum);
    })
});

$(".minusgoodadmin").on('click',function(){
    var THIS=this;
    var goodName = $(this).closest('.good_body').find('.good_name').text();
    var goodNum = $(this).closest('.good_body').find('.shopNum').text();
    if(parseInt(goodNum)==0){
        return false;
    }
    goodNum = parseInt(goodNum)-1;
    $.post('/addgoodadpage',{good_name:goodName,good_count:goodNum},function(data){
        $(THIS).closest('.good_body').find('.shopNum').text(goodNum);
    })
});