describe('Select', function () {
    var inputs;
    var dis_rule1;
    var dis_rule2;
    var dis_rule3;
    var dis_rule4;
    beforeEach(function () {
        inputs = [
            {name: "苹果", count: 12, uint: "斤", price: 3.5, date: 12},
            {name: "草莓", count: 20, uint: "斤", price: 3.6, date: 1234},
            {name: "荔枝", count: 100, uint: "斤", price: 3.7, date: 12345
            }

        ];
        dis_rule1 = "(name=='荔枝' || name=='草莓') && date==12 && count<100 && unit=='斤'" ;
        dis_rule2 = "(name=='荔枝' || name=='草莓' || name=='苹果')";
        dis_rule3 = "date<123";
        dis_rule4 = "date==12";

    });

    it("should be print hehe", function () {

        spyOn(console, 'log');

        Select(inputs, dis_rule1);
//        Select.output();
        expect(console.log).toHaveBeenCalledWith('hh');
    })
});