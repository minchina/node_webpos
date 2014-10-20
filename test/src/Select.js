
var flagGlobal="";
function Select(goodItems, ruleDetail) {
    console.info(goodItems);
    localStorage["items"] = JSON.stringify(goodItems);

    var reuslt = isKuoHao(ruleDetail);
    dealrules(goodItems, reuslt,"or");
}


function dealrules(goodItems, ruleDetail,sign) {
    console.info(getValueMap(getThisRule(ruleDetail)));
    console.info(getValueMap(getThisRule(getLeftRule(ruleDetail))));
    console.info(getValueMap(getThisRule(getLeftRule(getLeftRule(ruleDetail)))));
    console.info(getValueMap(getThisRule(getLeftRule(getLeftRule(getLeftRule(ruleDetail))))));
    console.info(getValueMap(getThisRule(getLeftRule(getLeftRule(getLeftRule(getLeftRule(ruleDetail)))))));
}

function ruleProcess (goodItems,ruleDetail){
    if(ruleDetail.search(/[^|&]/g)){
        ruleDetail = removesign(ruleDetail);
//        console.info(ruleDetail);
    }
//    return getGoodByRule(goodItems,getValueMap(getThisRule(getIndexFlag(ruleDetail),ruleDetail)));

}

function getIndexFlag(ruleDetail){
    if(ruleDetail.search(/[(.*?)&&|(.*?)||]/g)==-1){
        return -1;
    }
    return ruleDetail.search(/[(.*?)&&|(.*?)||]/g);
}
function getThisRule(ruleDetail){
    var indexflag = getIndexFlag(removesign(ruleDetail));
    if(indexflag==0){
        return ruleDetail.slice(2);
    }
    if(indexflag==-1){
        return ruleDetail;
    }
    return ruleDetail.slice(0, indexflag);
}

function getLeftRule(ruleDetail){
    return  removesign(ruleDetail.slice(getIndexFlag(ruleDetail)));
}

function removesign (leftrule){
    var isFlag = leftrule.search(/[||{1}&&]/g);
    if(isFlag==0){
        return leftrule.slice(2);
    }
    return leftrule;

}




//function nextsign (leferules){
//    var flag = leferules.search(/[||{1}&&]/g);
//    if(!flag){
//        flagGlobal= "or";
//    }
//    flagGlobal = "and";
//}

//将一条规则组合成一个数组
function getValueMap(thisrule) {
//    console.info(thisrule);
    var key = "";
    var value = "";
    var index = thisrule.search(/[==><]/g);
    var sign = thisrule.match(/[=><]/g);
//    console.info(sign);
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

//第一步，去掉括号
function isKuoHao(rules) {
    return rules.replace(/[() ]/g, '')
}

//得到商品通过规则
function getGoodByRule(goodItems, thisrule) {
    console.info(thisrule);
    var property = thisrule.name;
    var value = formatValue(thisrule.value.replace(/[']/g,''));
    var sign = thisrule.sign[0];

//    console.info(property,typeof value,sign);
    var good= _.find(goodItems, function (item) {
        if(sign=="="){
//            console.info(1);
            return item[property] == value;
        }else if(sign==">"){
//            console.info(2);
            return item[property] > value;
        }else {
//            console.info(3);
            return item[property] < value;
        }
    });
    saveGood(good);
    return good;
}

function formatValue(value){
//    console.info(value);
    if(!value.search(/[0-9]/g)){
        return parseInt(value);
    }
    return value;
}

function saveGood (good){
    localStorage.setItem('item',good);
}


