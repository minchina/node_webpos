function Select(goodItems, ruleDetail) {
    console.info(goodItems, ruleDetail);

    var reuslt = isKuoHao(ruleDetail);
    dealrules(goodItems, reuslt);
}


function dealrules(goodItems, ruleDetail) {
    var result = ruleProcess(ruleDetail);
    console.info(result);

//    result = ruleProcess(getLeftRule(getIndexFlag(ruleDetail),ruleDetail));
//    console.info(result);



//    result = ruleProcess(ruleDetail);
//    console.info(result);
//    var indexflag = getIndexFlag(ruleDetail);
//    var leftrule = getLeftRule(indexflag,ruleDetail);
//    var select_good = getGoodByRule(goodItems,ruleProcess(ruleDetail) );
//    console.info(select_good);
//
//    for(var i=0;i<5;i++){
//        var next_sign = nextsign(leftrule);
//        if(next_sign=="or"){
//            select_good= getGoodByRule(goodItems,ruleProcess(leftrule));
//            console.info(select_good);
//        }
//        if(next_sign=="and"){
//            console.info("come in and");
//        }
//    }

}


function ruleProcess (ruleDetail){
    if(ruleDetail.search(/[^|&]/g)){
        ruleDetail = removesign(ruleDetail);
        console.info(ruleDetail);
    }
    return getValueMap(getThisRule(getIndexFlag(ruleDetail),ruleDetail))

}



function getIndexFlag(ruleDetail){
    return ruleDetail.search(/[(.*?)&&|(.*?)||]/g);
}
function getThisRule(indexflag,ruleDetail){
    return ruleDetail.slice(0, indexflag);
}


function getLeftRule(indexflag,ruleDetail){
    return  ruleDetail.slice(indexflag);
}

function removesign (leftrule){
    return leftrule.slice(2);
}

function nextsign (leferules){
    var flag = leferules.search(/[||{1}&&]/g);
    if(!flag){
        return "or";
    }
    return "and";
}

//将一条规则组合成一个数组
function getValueMap(thisrule) {
    console.info(thisrule);
    var key = "";
    var value = "";
    var index = thisrule.search(/[==><]/g);
    var sign = thisrule.match(/[=><]/g);
    console.info(sign);
    if (sign[0] == "=") {
        console.info("==");
        index = index + 1;
        key = thisrule.slice(0, index - 1);
        value = thisrule.slice(index + 1);
    }
    if (sign[0] == "<" || sign[0] == ">") {
        key = thisrule.slice(0, index);
        value = thisrule.slice(index+1);
    }
    return {name: key, value: value, sign: sign}
}
//去掉括号

function isKuoHao(rules) {
    return rules.replace(/[() ]/g, '')
}

function getGoodByRule(goodItems, thisrule) {
    var property = thisrule.name;
    var value = thisrule.value.replace(/[']/g,'');
    var good= _.find(goodItems, function (item) {
        return item[property] == value;
    });
    saveGood(good);
    return good;

}

function saveGood (good){
    localStorage.setItem('item',good);
}


