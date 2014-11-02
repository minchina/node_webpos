describe('Select', function () {
    var inputs;

    beforeEach(function () {
        inputs = [
            {name: "苹果", type:"水果",count: 12, uint: "斤", price: 3.5, date: 2014/9/9},
            {name: "苹果", type:"水果",count: 20, uint: "斤", price: 3.5, date: 2014/8/31},
            {name: "草莓", type:"水果",count: 20, uint: "斤", price: 3.6, date: 2014/9/9},
            {name: "荔枝", type:"水果",count: 100, uint: "斤", price: 3.7, date: 2014/10/11},
            {name: "IMAC", type:"电子产品",count:50,unit:"台",price:8000,date:2014/11/11 },
            {name: "iphone6",type:"电子产品",count:100,unit:"台",price:6000,date:2014/9/10}

        ];


    });
    it("use name=='苹果' should filter 苹果",function(){
        var good_items = inputs;
        console.log(good_items);
        expect(console.log).toHaveBeenCalledWith('hh');
    });
});