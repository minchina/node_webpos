describe('some small model should work well', function () {


    it("parse function should instead Brackets by $",function(){
        var rule = "(name=='苹果')";
        rule = RulerFilter.remove_no_use_symbal(rule);
        var result = RulerFilter.parse(rule,[]);
        expect(result.rule).toBe("$0");
        expect(result.list[0]).toBe("name=苹果");
    });
    it("parse function should work well in brackets have brackets",function(){
        var rule = "(name=='苹果') || ((type=='电子产品' || name =='可比克') && date<2014/10/10)";
        rule = RulerFilter.remove_no_use_symbal(rule);
        var result = RulerFilter.parse(rule,[]);
        expect(result.rule).toBe("$2|$1");
    })
});