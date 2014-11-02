function RulerFilter(){
    this.result_stack=[];
    this.symbol_stack=[];

}

RulerFilter.filter=function(goods_items,rule){
    rule = RulerFilter.remove_no_use_symbal(rule);
    return RulerFilter.filter_process(goods_items,rule);

};

RulerFilter.filter_process=function(good_items,rule){
    var unit = RulerFilter.getValueMap(rule);
    return RulerFilter.get_good_by_unit_rule(good_items,unit);
};

RulerFilter.remove_no_use_symbal = function(rule){
    rule = rule.replace(/['\s+]/g, "");
    rule = rule.replace(/[&]{2}/g, "&");
    rule = rule.replace(/[=]{2}/g, "=");
    return rule.replace(/[|]{2}/g, "|");
};

RulerFilter.getValueMap=function(unit) {//将unit封装成为对象，方便处理
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