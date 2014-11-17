describe('unit rule should filter correct goods', function () {
    var good_items;

    beforeEach(function () {
        good_items = get_good_items();

    });
    it("use name=='苹果' should filter 苹果",function(){
        var rule = "name=='苹果'";
        //expect(console.log).toHaveBeenCalledWith('hh');
        expect(RulerFilter.filter(good_items,rule).length).toBe(2);
        expect(RulerFilter.filter(good_items,rule)[0].name).toBe("苹果");
        expect(RulerFilter.filter(good_items,rule)[1].name).toBe("苹果");
    });

    it("use count<100 should filter 4 good",function(){
        var rule = "count<100";
        expect(RulerFilter.filter(good_items,rule).length).toBe(4);
        expect(RulerFilter.filter(good_items,rule)[0]).toBe(good_items[0]);
        expect(RulerFilter.filter(good_items,rule)[1]).toBe(good_items[1]);
        expect(RulerFilter.filter(good_items,rule)[2]).toBe(good_items[2]);
        expect(RulerFilter.filter(good_items,rule)[3]).toBe(good_items[4]);
    });
    it("use price>3.6 should filter 3 good",function(){
        var rule = "price>3.6";
        expect(RulerFilter.filter(good_items,rule).length).toBe(4);
        expect(RulerFilter.filter(good_items,rule)[0]).toBe(good_items[3]);
        expect(RulerFilter.filter(good_items,rule)[1]).toBe(good_items[4]);
        expect(RulerFilter.filter(good_items,rule)[2]).toBe(good_items[5]);
    });
    it("name='苹果' && count ==20 should filter good_items first",function(){
        var rule = "name='苹果' && count ==20";
        var result = RulerFilter.filter(good_items,rule);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(good_items[1]);
    });

    it("name='苹果'|| type=='电子产品' should filter array which have 4 elements",function(){
        var rule = "name='苹果'|| type=='电子产品'";
        var result = RulerFilter.filter(good_items,rule);
        expect(result.length).toBe(4);
    });

    it("name=='苹果' && count ==20 || type =='电子产品' should filter 3 goods ",function(){
        var rule = "name='苹果' && count ==20 || type =='电子产品'";
        var result = RulerFilter.filter(good_items,rule);
        expect(result.length).toBe(3);
    });
    it("name=='苹果 && count==20 && type=='水果'",function(){
        var rule = "name=='苹果 && count==20 && type=='水果'";
        var result = RulerFilter.filter(good_items,rule);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(good_items[1]);
    });

    it("name=='苹果 || name=草莓 || type=='电子产品'",function(){
        var rule = "name=='苹果 || name=草莓 || type=='电子产品'";
        var result = RulerFilter.filter(good_items,rule);
        expect(result.length).toBe(5);
        expect(result[0]).toBe(good_items[4]);
    });

    it("type=='水果' && name='荔枝' || type=='电子产品'||type=='零食'",function(){
        var rule = "type=='水果' && name='荔枝' || type=='电子产品'||type=='零食'";
        var result = RulerFilter.filter(good_items,rule);
        expect(result.length).toBe(4);
    })

});