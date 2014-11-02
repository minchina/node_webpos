function RulerFilter(){
    this.result_stack=[];
    this.symbol_stack=[];

}

RulerFilter.filter=function(goods_items,rule){
    rule = RulerFilter.remove_no_use_symbal(rule);
    return RulerFilter.filter_process(goods_items,rule,[],[]);

};

RulerFilter.filter_process=function(good_items,rule,symbol_stack,result_stack){
    //规则中包含有|或者&
    if(rule.indexOf("|") !=-1 || rule.indexOf("&")!=-1){
        //并且不是以|&开头
        if(rule.match(/[|&]/).index !=0){
            console.log(3);
            var index = rule.match(/[|&]/);
            var unit = rule.slice(0,index.index);
            var map = RulerFilter.get_value_map(unit);
            result_stack.push(RulerFilter.get_good_by_unit_rule(good_items,map));
            rule = rule.slice(index.index);
            return RulerFilter.filter_process(good_items,rule,symbol_stack,result_stack);
            //以|&开头，肯定不是第一次进入该函数
        }else if(rule.match(/[|&]/).index ==0){
            console.log(4);
            //将该符号压入结果栈
            symbol_stack.push(rule.slice(0,1));
            rule = rule.slice(1);
            return RulerFilter.filter_process(good_items,rule,symbol_stack,result_stack);
        }
    }
    //当规则中不包含|&的时候
    if(rule.indexOf("|") ==-1 || rule.indexOf("&")==-1){
        //符号栈中有符号，说明不是单个unit
        if(symbol_stack.length!=0){
            console.log(22,rule);
            var map =  RulerFilter.get_value_map(rule);
            result_stack.push(RulerFilter.get_good_by_unit_rule(good_items,map));
            //先将最后一个unit计算出来,然后将栈顶符号弹出来，和结果栈中结合计算
            /////////////////////////////////// 做到这里了////////////////////////////
        }else{//单个单元
            console.log(result_stack);
            unit = rule;
            map = RulerFilter.get_value_map(unit);
            return RulerFilter.get_good_by_unit_rule(good_items,map);
        }
    }
    console.log(1);
    return result_stack[0];
};

RulerFilter.remove_no_use_symbal = function(rule){
    rule = rule.replace(/['\s+]/g, "");
    rule = rule.replace(/[&]{2}/g, "&");
    rule = rule.replace(/[=]{2}/g, "=");
    return rule.replace(/[|]{2}/g, "|");
};

RulerFilter.get_value_map=function(unit) {//将unit封装成为对象，方便处理
    var symbol = unit.match(/[=<>]/);
    var key_and_value = unit.split(symbol[0]);
    return {key: key_and_value[0], value: key_and_value[1], symbol: symbol[0]}
};

RulerFilter.get_good_by_unit_rule=function(gooditems,unit){
    var symbol = unit.symbol;
    var key = unit.key;
    var value = unit.value;
    return _.filter(gooditems,function(item){
        if(symbol=="="){
            return item[key] == value;
        }else if(symbol=="<"){
            return item[key] < value;
        }else if(symbol==">"){
            return item[key] > value;
        }
    });
};

RulerFilter.and_compute = function(){

};


RulerFilter.get_top_of_symbol=function(symbol_stack) {
    if (symbol_stack.length == 0) {
        return -1;
    }
    return symbol_stack[symbol_stack.length - 1];

};

function icp(symbol) {
    switch (symbol) {
        case ')' :
            return 1;
            break;
        case '|' :
            return 2;
            break;
        case '&' :
            return 4;
            break;
        case '(' :
            return 8;
            break;
        default :
            return 0;
    }
}

function isp(symbol) {
    switch (symbol) {
        case '(' :
            return 1;
            break;
        case '|' :
            return 3;
            break;
        case '&' :
            return 5;
            break;
        case ')' :
            return 8;
            break;
        default :
            return 0;
    }
}