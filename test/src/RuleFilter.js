function Rule_Filter(gooditems, rule) {
    rule = transform_double_to_single(rule);
    Filter_Process(gooditems, rule);
}


function Filter_Process(gooditems, rule) {//主逻辑
    console.log(gooditems, rule);
    var symbol_stack = [];
    var result_stack = [];
    var flag=0;
//    var unit = {name: "",
//        value: "",
//        symbol: ""
//
//    };
    var unit = "";
    var this_rule = "";
    var symbol_object = null;
    while (rule.length != 0) {
        var firstString = rule.slice(0, 1);
        //如果第一个字符匹配到了（）&|，就将其压入符号栈,首先判断优先级,如果栈外优先级高于栈顶
        if (firstString.match(/[\(\)&|]/)) {
            //如果栈外优先级高于栈内,则将符号压入栈内
            if (icp(firstString) > isp(get_top_of_symbol(symbol_stack))) {
                symbol_stack.push(firstString);//将符号压入符号栈
                rule = rule.slice(1);
                console.log(symbol_stack);
            }//如果栈外优先级低于栈内，则直接计算
            else if (icp(firstString) < isp(get_top_of_symbol(symbol_stack))) {
                console.log(firstString);
                break;
            }//栈内优先级等于栈外优先级，说明匹配到了括号
            else{
                //将栈顶符号弹出
                symbol_stack.pop();

            }
        }
        else {//当没有匹配到()|&的时候
            flag++;
            symbol_object = rule.match(/[(.*?))|(.*?)(|(.*?)&|(.*?)|]/);//将|()&之前的字符串提取出来
            unit = rule.slice(0, symbol_object.index);
            var map = getValueMap(unit);
            console.log(map);
            //将得到的结果压入结果栈
            result_stack.push(getGoodByUnit(gooditems, map));
            rule = minus_string_from_rule(rule, unit);
            console.log(result_stack);
//            if(flag==2){
//                break;
//            }
        }
    }

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
