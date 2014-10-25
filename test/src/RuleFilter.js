function Rule_Filter(gooditems, rule) {
    rule = transform_double_to_single(rule);
    var result = Filter_Process(gooditems, rule)
    console.log(result);
}


function Filter_Process(gooditems, rule) {//主逻辑
    console.log(gooditems, rule);
    var symbol_stack = [];//符号栈
    var result_stack = [];//结果栈
    var symbol="";
    var unit = "";
    var symbol_object = null;
    //按照顺序计算
    while (rule.length > 0) {
        var firstString = rule.slice(0, 1);
        //如果第一个字符匹配到了（）&|，就将其压入符号栈,首先判断优先级,如果栈外优先级高于栈顶
        if (firstString.match(/[\(\)&|]/)) {
            rule = rule.slice(1);
            //如果栈外优先级低于栈内，则直接计算
            if (icp(firstString) < isp(get_top_of_symbol(symbol_stack))) {
                symbol = symbol_stack.pop();
                if (symbol == "&") {
                    result_stack.push(and_compute(result_stack.pop(), result_stack.pop()));
                }
                else if (symbol== "|") {
                    result_stack.push(or_compute(result_stack.pop(), result_stack.pop()));
                }
            }

            //如果栈外优先级高于栈内,则将符号压入栈内
            if (icp(firstString) > isp(get_top_of_symbol(symbol_stack)) && firstString !=")")  {
                symbol_stack.push(firstString);//将符号压入符号栈
            }
            //栈内优先级等于栈外优先级，说明匹配到了括号
            if(icp(firstString) == isp(get_top_of_symbol(symbol_stack))){
                //将栈顶符号弹出
                symbol_stack.pop();

            }
        }
        else {//当没有匹配到()|&的时候
            symbol_object = rule.match(/[(.*?))|(.*?)(|(.*?)&|(.*?)||(.*?)]/);//将|()&之前的字符串提取出来
            if(!symbol_object){
                unit = rule;
            }else {
                unit = rule.slice(0, symbol_object.index);
            }
            var map = getValueMap(unit);
            //将得到的结果压入结果栈
            result_stack.push(getGoodByUnit(gooditems, map));
            //减去当前已经计算的规则,当最后一条时，rule已经没有了！实际上最后一条还没有计算,计算完之后就跳出循环
            rule = minus_string_from_rule(rule, unit);
            if(!rule.length){
                symbol = symbol_stack.pop();
                if (symbol == "&") {
                    result_stack.push(and_compute(result_stack.pop(), result_stack.pop()));
                }
                if (symbol == "|") {
                    result_stack.push(or_compute(result_stack.pop(), result_stack.pop()));
                }
            }
        }
    }
    //理论上前面的计算之后，不会计算最后一个!
    //if(symbol_stack.length!=0){
    //    symbol = symbol_stack.pop();
    //    if(symbol=="&"){
    //        result_stack.push(and_compute(result_stack.pop(),result_stack.pop()));
    //    }
    //    if(symbol=="|"){
    //        result_stack.push(or_compute(result_stack.pop(),result_stack.pop()));
    //    }
    //}
    return result_stack[0];
}


function transform_double_to_single(rule) {
    rule = rule.replace(/['\s+]/g, "");
    rule = rule.replace(/[&]{2}/g, "&");
    rule = rule.replace(/[=]{2}/g, "=");
    return rule.replace(/[|]{2}/g, "|");
}

function minus_string_from_rule(rule, string) {
    return rule.replace(string, "");
}


function getValueMap(unit) {//将unit封装成为对象，方便处理
    var symbol = unit.match(/[=<>]/);
    var key_and_value = unit.split(symbol[0]);
    console.log(key_and_value);
    if (key_and_value[1].search(/\d*/)) {
        key_and_value[1] = parseInt(key_and_value[1]);
    }
    return {key: key_and_value[0], value: key_and_value[1], symbol: symbol[0]}
}

function getGoodByUnit(items, unit) {
    var find_list = [];
    _.each(items, function (item) {
        _.each(item.properties, function (property) {
            if (unit.symbol == "=" && property.property_name == unit.key && property.property_value == unit.value) {
                find_list.push(item);
            }
            else if (unit.symbol == "<" && property.property_name == unit.key && property.property_value < unit.value) {
                find_list.push(item);
            }
            else if (unit.symbol == ">" && property.property_name == unit.key && property.property_value > unit.value) {
                find_list.push(item);
            }

        })
    });
    return find_list;

}

function get_top_of_symbol(symbol_stack) {
    if (symbol_stack.length == 0) {
        return -1;
    }
    return symbol_stack[symbol_stack.length - 1];

}

function and_compute(list1, list2) {
    var computed_list = [];
    for (var i = 0; i < list1.length; i++) {
        for (var j = 0; j < list2.length; j++) {
            if (product_equals(list1[i], list2[j])) {
                computed_list.push(list2[j]);
            }
        }
    }
    return computed_list;
}

function or_compute(list1, list2) {
    var temp_list = list1;
    for (var i = 0; i < list2.length; i++) {
        if (!is_product_in_list(list1, list2[i])) {
            temp_list.push(list2[i]);
        }
    }
    return temp_list;
}

function is_product_in_list(list, product) {
    for (var i = 0; i < list.length; i++) {
        if (product_equals(list[i], product)) {
            return true;
        }
    }
    return false;
}

function product_equals(product1, product2) {
    if (product1.properties.length != product2.properties.length) {
        return false;
    }
    else {
        for (var i = 0; i < product1.properties.length; i++) {
            if (product1.properties[i].property_name != product2.properties[i].property_name
                || product1.properties[i].property_value != product2.properties[i].property_value
                ) {
                return false;
            }
        }
    }
    return true;
}


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
