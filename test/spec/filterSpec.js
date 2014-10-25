describe('Select', function () {
    var inputs;
    var dis_rule1;
    var dis_rule2;
    var dis_rule3;
    var dis_rule4;
    var dis_rule5;
    beforeEach(function () {
        inputs = [
            {name: "苹果", count: 12, uint: "斤", price: 3.5, date: 12},
            {name: "草莓", count: 20, uint: "斤", price: 3.6, date: 1234},
            {name: "荔枝", count: 100, uint: "斤", price: 3.7, date: 12345
            }

        ];
        dis_rule1 = "(name=='苹果' || name=='橘子') && type=='水果'";
        dis_rule2 = "(name == '苹果' || name == 'iMac') && publish_time < '2014/10/20'";
        dis_rule3 = "date<123";
        dis_rule4 = "(name == '苹果' && publish_time < 2014/08/01) || ((name == 'iphone6' || name =='iMac') && color == 'space_gray')";
        dis_rule5 = "name == '苹果'||(name == '草莓' && count >100)||(type == '电子产品' && (weight < 100 || weight > 500))";


    });

    it("should be print hehe", function () {
        var items =Cart_items.load_cart_items();
        Rule_Filter(items,dis_rule2);
        expect(console.log).toHaveBeenCalledWith('hh');
    })
});