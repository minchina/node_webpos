function Select(goodItems, ruleDetail) {
    console.info(goodItems, ruleDetail);

    var reuslt = isKuoHao(ruleDetail);
    dealrules(goodItems, reuslt);
}


function dealrules(goodItems, ruleDetail) {
    var indexflag = ruleDetail.search(/[||{1}&&]/g);
    var thisrule = ruleDetail.slice(0, indexflag);
    var leftrule = ruleDetail.slice(indexflag);
    getGoodByRule(goodItems, getValueMap(thisrule));
    console.info("============");
    var next_sign = nextsign(leftrule);
    if(next_sign=="or"){
        leftrule = removesign(leftrule);
        getGoodByRule(goodItems, leftrule);
    }


}

function getThisValue(){

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


function getValueMap(thisrule) {
    var key = "";
    var value = "";
    var index = thisrule.search(/[==><]/g);
    var sign = thisrule.match(/[=><]/g);
    if (sign[0] == "=") {
        console.info("==");
        index = index + 1;
        key = thisrule.slice(0, index - 1);
        value = thisrule.slice(index + 1);
    }
    if (sign[0] == "<") {
        console.info("<");
    }
    if (sign[0] == ">") {
        console.info(">");
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


