function Select(goodItems, ruleDetail) {
    console.info(goodItems, ruleDetail);

    var reuslt = isKuoHao(ruleDetail);
    dealrules(goodItems, reuslt);
}


function dealrules(goodItems, ruleDetail) {
    console.info(goodItems, ruleDetail);
    var indexflag= ruleDetail.search(/[||{1}&&]/g);
    var thisrule = ruleDetail.slice(0,indexflag);
    console.info(thisrule);
    var leftrule = ruleDetail.slice(indexflag);
    console.info(leftrule);
    var reuslt = getValueMap(thisrule);

    getGoodByRule(goodItems,reuslt,reuslt.value);



}


function getValueMap(thisrule){
    var key="";
    var value = "";
    var index = thisrule.search(/[==><]/g);
    var sign = thisrule.match(/[=><]/g);
    if(sign[0]=="="){
        console.info("==");
        index=index+1;
        key = thisrule.slice(0,index-1);
        value = thisrule.slice(index+1);
    }
    if(sign[0]=="<"){
        console.info("<");
    }
    if(sign[0]==">"){
        console.info(">");
    }
    return {name:key,value:value,sign:sign}
}
//去掉括号

function isKuoHao(rules) {
    return rules.replace(/[() ]/g, '')
}

function getGoodByRule(goodItems,thisrule,testvalue){
    console.info(goodItems);
    console.info(testvalue);
    var property  = thisrule.name;
    var value = thisrule.value.valueOf();

    console.info(property,value);
    console.info(goodItems,thisrule);
    var good = _.find(goodItems,function(item){
        return item[property] ="苹果";
    });
    console.info(good);

}


