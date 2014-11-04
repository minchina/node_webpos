describe('some small model should work well', function () {

    it("parse function should instead Brackets by $",function(){
        var rule = "(name=='苹果')";
        var result = RulerFilter.parse(rule,[]);
        expect(result.rule).toBe("$0");
        expect(result.list[0]).toBe("name=='苹果'");
    })
});