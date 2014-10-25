function Select(goodItems, ruleDetail) {
    ruleDetail = ruleDetail.replace(/[() /s]/g,"");
    console.log(ruleDetail);
    dealrules(goodItems,ruleDetail,"or");

}


function dealrules(goodItems, ruleDetail,sign) {

    ruleProcess(goodItems,ruleDetail);
}

function ruleProcess (goodItems,ruleDetail){
    console.log(getGoodByRule(goodItems,ruleDetail));
}



function getIndexFlag(ruleDetail){
    if(ruleDetail.search(/[(.*?)&&|(.*?)||]/g)==-1){
        return -1;
    }
    return ruleDetail.search(/[(.*?)&&|(.*?)||]/g);
}
function getThisRule(ruleDetail){
    var indexflag = getIndexFlag(ruleDetail);
    if(indexflag==0){
        return ruleDetail.slice(2);
    }
    if(indexflag==-1){
        return ruleDetail;
    }
    return ruleDetail.slice(0, indexflag);
}

function getLeftRule(ruleDetail){
    return ruleDetail.slice(getIndexFlag(ruleDetail));
}

function removesign (leftrule){
    var isFlag = leftrule.search(/[||{1}&&]/g);
    if(isFlag==0){
        return leftrule.slice(2);
    }
    return leftrule;

}

function nextsign (leferules){
    var flagor = leferules.search(/[||{1}]/g);
    var flagand = leferules.search(/[&&{1}]/g);
    if(!flagor){
        return "or";
    }
    if(!flagand){
        return "and";
    }
}

//将一条规则组合成一个数组
function getValueMap(thisrule) {
    var key = "";
    var value = "";
    var index = thisrule.search(/[==><]/g);
    var sign = thisrule.match(/[=><]/g);
//    console.info(sign);
    if (sign[0] == "=") {
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
function getGoodByRule(goodItems, ruletotal) {
    var thisrule = getThisRule(ruletotal);

    var leftrule = removesign(getLeftRule(ruletotal));
//    if(thisrule.length==1){
//        return 1;
//    }
    thisrule = getValueMap(thisrule);
//    console.log(thisrule);
    var property = thisrule.name;
    var value = formatValue(thisrule.value.replace(/[']/g,''));
//    console.log(value);
    var sign = thisrule.sign[0];

//    console.info(property,typeof value,sign);
    var good= _.find(goodItems, function (item) {
        if(sign=="="){
            return item[property] == value;
        }else if(sign==">"){
            return item[property] > value;
        }else {
            return item[property] < value;
        }
    });
//    console.log(good);
    if(getflag()=="or" || getflag()=="no"){
        var result =getLastGood();
        result.push(good);
        saveLastGood(result);
    }
    if(getflag()=="and"){
        goodItems = getLastGood();
        saveflag(nextsign(getLeftRule(ruletotal)));
        return getGoodByRule(goodItems,leftrule);
    }
    if(thisrule.length==1){
        return 1;
    }
    saveThisGood(good);
    saveflag(nextsign(getLeftRule(ruletotal)));

    return getGoodByRule(goodItems,leftrule);
}

function formatValue(value){
    if(!value.search(/[0-9]/g)){
        return parseInt(value);
    }
    return value;
}

function saveThisGood (good){
    localStorage["thistime"]=JSON.stringify(good);
}

function saveLastGood (good){
    localStorage["lasttime"]=JSON.stringify(good);
}

function getThisGood(){
    if(!localStorage['thistime']){
        localStorage['thistime']=JSON.stringify([]);
    }
    return JSON.parse(localStorage["thistime"]);
}

function getLastGood(){
    if(!localStorage['lasttime']){
        localStorage['lasttime']=JSON.stringify([]);
    }
    return JSON.parse(localStorage["lasttime"]);
}

function saveflag(flag){
    localStorage.setItem("flag",flag);
}

function getflag(){
    if(!localStorage['flag']){
        localStorage.setItem("flag","no");
    }
    return localStorage.getItem("flag");
}

function savefinally (good){
    localStorage["finally"]=JSON.stringify(good);
}



