function Select(goodItems,ruleDetail){
    console.info(goodItems,ruleDetail);
    ruleDetail = "mh,him,his";
    dealrules(ruleDetail);
}


function dealrules (ruleDetail){
    var result ;
    var regex = "hi";
    result = ruleDetail.search(regex);
    console.info(result);
}


