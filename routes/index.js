var Good = require('../models/good');
var _ = require('underscore');
var Attr = require('../models/attr');
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
        req.session.promotion=null;
        res.redirect('/item');
    });

    app.post('/addcart',function(req,res){
        var goods = req.session.item;
        var type = req.body.type;
        if(type=="add"){
            _.find(goods,function(good){return good.name == req.body.good_name}).count++;
            req.session.total += 1;
        }
        if(type=="minus"){
            _.find(goods,function(good){return good.name == req.body.good_name}).count--;
            req.session.total -= 1;
        }

        _.find(goods,function(good){
            return good.name == req.body.good_name
        }).savecount =
            Good.get_savecount(_.find(goods,function(good){return good.name == req.body.good_name}).count,req.body.good_name,req.session.promotion) || 0;
        req.session.item = goods;
        var save_count = _.find(goods,function(good){return good.name == req.body.good_name}).savecount;
        var total_price = Good.get_total_price(req.session.item);
        req.session.total_price = total_price;
        res.json({savecount:save_count,total:req.session.total,total_price:total_price});

    });

    app.get('/admin',function(req,res){

        Good.get_all_goods(function(err,goods){
            if(err){
                return callback(err);
            }
            res.render('adminpage/admin',{title:"pos机后台管理系统",
                cart_total:req.session.total,
                goods:goods,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        })
    });

    app.get('/addgood',function(req,res){

        Attr.get_attr(function(err,attr){
            if(err){
                return callback(err);
            }
            console.log(attr);
            res.render('adminpage/addgood', {
                title: "pos机后台管理系统",
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                attr_name:attr.name,
                attr_default_name:attr.value
            });

//
        });
    });

    app.post('/addgood',function(req,res){
        var goodName = req.body.good_name;
        var goodCount = req.body.good_count;
        var goodUnit = req.body.good_unit;
        var goodPrice =req.body.good_price;
        if (!_.where(req.session.item,{name:goodName})){
            return false;
        }
        var newGood = new Good(goodName,goodCount,goodPrice,goodUnit);
        newGood.save(function(err,user){
            if(err){
                req.flash('error',"添加失败！");
                return res.redirect("/addgood");
            }
            req.flash('success','添加成功！');
            res.redirect('/addgood')
        })
    });

    app.post('/deleted',function(req,res){
        Good.delete_good(req.body.good_name,function(err,good){
            if(err){
                req.flash('error',"删除失败!");
            }
            req.flash('success',"删除成功!");
            res.redirect('/addgood');
        });

    });
//添加商品属性页面
    app.get('/addGoodAttr',function(req,res){
        res.render('adminpage/addGoodAttr',{title:"pos机后台管理系统",
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });

    });

    app.post('/addGoodAttr',function(req,res){
        //这里需要新建立一个attr对象，用来显示新增加的属性
        var name = req.body.name;
        var value = req.body.value;
        Attr.get(name,function(err,attr){
            if(err){
                req.flash('error',"添加失败");
                return res.redirect('/addgood');
            }
            if(attr){
                req.flash('error',"属性已经存在");
                return res.redirect('/addgood');
            }
            var newattr = new Attr({name:name,value:value});
            newattr.save(function(err,attr){
                if(err){
                    req.flash('error',"添加失败");
                    return res.redirect('/addgood');
                }
                req.flash('success',"添加成功");
                res.redirect('/addgood');
            })

        });

    });

//提交商品属性


};