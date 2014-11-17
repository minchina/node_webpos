function RulerFilter(){
}

RulerFilter.filter=function(goods_items,rule){
    rule = RulerFilter.remove_no_use_symbal(rule);
    var parse_result = RulerFilter.parse(rule,[]);
    rule = parse_result.rule;
    var list_stack = parse_result.list;
    console.info(rule,list_stack);
    return RulerFilter.filter_process(goods_items,rule,[],[],list_stack || []);

};

RulerFilter.filter_process=function(good_items,rule,symbol_stack,result_stack,list_stack){
    RulerFilter.get_parse(rule,list_stack);
    console.log(list_stack);
    //规则中包含有|或者&
    if(rule.indexOf("|") !=-1 || rule.indexOf("&")!=-1){
        //并且不是以|&开头
        if(rule.match(/[|&]/).index !=0){
            var index = rule.match(/[|&]/);
            var unit = rule.slice(0,index.index);
            var map = RulerFilter.get_value_map(unit);
            result_stack.push(RulerFilter.get_good_by_unit_rule(good_items,map));
            rule = rule.slice(index.index);
            return RulerFilter.filter_process(good_items,rule,symbol_stack,result_stack,list_stack);
            //以|&开头，肯定不是第一次进入该函数
        }else if(rule.match(/[|&]/).index ==0){
            //将该符号压入结果栈
            var symbol = rule.slice(0,1);
            //如果栈外优先级高于栈内优先级，则将栈外元素压入符号栈
            if(icp(symbol)>isp(RulerFilter.get_top_of_symbol(symbol_stack))){
                symbol_stack.push(symbol);
            }else{//把符号栈内的符号弹出来进行计算
                var compute_symbol = symbol_stack.pop();
                if(compute_symbol=="&"){
                    result_stack.push(RulerFilter.and_compute(result_stack.pop(),result_stack.pop()));
                }
                if(compute_symbol=="|"){
                    result_stack.push(RulerFilter.or_compute(result_stack.pop(),result_stack.pop()));
                }
            }
            rule = rule.slice(1);
            //弹出符号之后，还需要将新的符号压入
            symbol_stack.push(symbol);
            return RulerFilter.filter_process(good_items,rule,symbol_stack,result_stack,list_stack);
        }
    }
    //当规则中不包含|&的时候,可以理解为只剩下一个rule unit了
    if(rule.indexOf("|") ==-1 || rule.indexOf("&")==-1){
        //符号栈中有符号，说明不是单个unit
        if(symbol_stack.length!=0){
            var map =  RulerFilter.get_value_map(rule);
            result_stack.push(RulerFilter.get_good_by_unit_rule(good_items,map));
            //先将最后一个unit计算出来,然后将栈顶符号弹出来，和结果栈中结合计算
            var symbol = symbol_stack.pop();//这里还需要判断符号栈里面的符号，是|还是&，然后再计算。
            if(symbol=="&"){
                result_stack.push(RulerFilter.and_compute(result_stack.pop(),result_stack.pop()));
            }
            if(symbol=="|"){
                result_stack.push(RulerFilter.or_compute(result_stack.pop(),result_stack.pop()));
            }
        }else{//单个单元或者是已经计算到最后一个了
            unit = rule;
            map = RulerFilter.get_value_map(unit);
            return RulerFilter.get_good_by_unit_rule(good_items,map);
        }
    }
    console.log(1);
    return result_stack[0];
};


RulerFilter.parse=function(s,list){
    var fri=0;
    var end=0;
    if((fri=s.lastIndexOf("("))!=-1)
    {
        for(var i=fri;i<s.length;i++)
        {
            if(s.charAt(i)==')')
            {
                end=i;
                var  str=s.substring(fri+1,end);
                var  turnstr=s.substring(0, fri)+"$"+list.length+s.substring(end+1, s.length);
                list.push(str);
                return RulerFilter.parse(turnstr,list);
            }
        }
    }
    return {rule:s,list:list};
};

RulerFilter.get_parse = function(s,list_stack){
    s = parseInt(s.slice(1));
    return list_stack[s];

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

RulerFilter.and_compute = function(list1,list2){
    return _.intersection(list1,list2);
};

RulerFilter.or_compute = function(list1,list2){
    return _.union(list1,list2)
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