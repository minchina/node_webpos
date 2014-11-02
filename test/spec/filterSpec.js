describe('unit rule should filter correct goods', function () {
    var good_items;

    beforeEach(function () {
        good_items = [
            {name: "苹果", type:"水果",count: 12, uint: "斤", price: 3.5, date: "2014/9/9"},
            {name: "苹果", type:"水果",count: 20, uint: "斤", price: 3.5, date: "2014/8/31"},
            {name: "草莓", type:"水果",count: 20, uint: "斤", price: 3.6, date: "2014/9/9"},
            {name: "荔枝", type:"水果",count: 100, uint: "斤", price: 3.7, date: "2014/10/11"},
            {name: "IMAC", type:"电子产品",count:50,unit:"台",price:8000,date: "2014/11/11"},
            {name: "iphone6",type:"电子产品",count:100,unit:"台",price:6000,date:"2014/9/10"}

        ];

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
        expect(RulerFilter.filter(good_items,rule).length).toBe(3);
        expect(RulerFilter.filter(good_items,rule)[0]).toBe(good_items[3]);
        expect(RulerFilter.filter(good_items,rule)[1]).toBe(good_items[4]);
        expect(RulerFilter.filter(good_items,rule)[2]).toBe(good_items[5]);
    });
});