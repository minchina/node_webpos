var Good = require('../models/good');
var _ = require('underscore');
/*
 * GET home page.
 */
module.exports=function(app){
    app.get('/',function(req,res){
       if(!req.session.total){
           req.session.total =0;
       }
        Good.get_promotions(function(err,promotions){
            if(err){
                return callback(err);
            }
            if(!req.session.promotion){
                req.session.promotion = promotions;
            }
            res.render('index',{title:"主页",cart_total:req.session.total});
        });
    });

    app.get('/item',function(req,res){
        Good.get_all_goods(function(err,goods){
            if(!req.session.item){
                req.session.item=goods;
            }
            if(err){
                return goods;
            }
            res.render('item',{title:"商品列表",cart_total:req.session.total,goods:goods});
        });
    });

    app.get('/cart',function(req,res){
        var goods = Good.get_no_null_messages(req.session.item);
        res.render('cart',{title:"购物车",
            cart_total:req.session.total,
            total_price:req.session.total_price || 0,
            goods:goods})
    });



    app.get('/payment',function(req,res){
        var goods = Good.get_no_null_messages(req.session.item);

        res.render('payment',{title:"购物车",
            gift_goods:Good.get_gift(req.session.item),
            save_price:Good.get_gift_price(req.session.item),
            cart_total:req.session.total,
            total_price:req.session.total_price || 0,
            goods:goods})
    });

    app.get('/confirm',function(req,res){
        req.session.item=null;
        req.session.total=0;
        req.session.total_price=0;
        res.redirect('/item');
    });

    app.post('/addcart',function(req,res){
        var goods = req.session.item;
        var type = req.body.type;
        if(type=="add"){
            _.find(goods,function(good){return good.barcode == req.body.good_barcode}).count++;
            req.session.total += 1;
        }
        if(type=="minus"){
            _.find(goods,function(good){return good.barcode == req.body.good_barcode}).count--;
            req.session.total -= 1;
        }
        _.find(goods,function(good){
            return good.barcode == req.body.good_barcode
        }).savecount =
            Good.get_savecount(_.find(goods,function(good){return good.barcode == req.body.good_barcode}).count,req.body.good_barcode,req.session.promotion) || 0;
        req.session.item = goods;
        var save_count = _.find(goods,function(good){return good.barcode == req.body.good_barcode}).savecount;
        var total_price = Good.get_total_price(req.session.item);
        req.session.total_price = total_price;
        res.json({savecount:save_count,total:req.session.total,total_price:total_price});

    })
};