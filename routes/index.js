var Good = require('../models/good');
var _ = require('underscore');
var Attr = require('../models/attr');
var Discount = require('../models/discount');
var moment = require('moment');
var Promotion = require('../models/promotion');
var Select = require('../models/select');
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
                return console.log(err);
            }
            if(!req.session.promotion){
                req.session.promotion = promotions;
            }
            res.render('index',{title:"主页",cart_total:req.session.total});
        });
    });

    app.get('/item',function(req,res){
        Good.get_good(null,function(err,goods){
            if(!req.session.item){
                _.each(goods,function(good){
                    good.count = 0;
                });
                console.log(goods);
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
        console.log("================");
        var goods = req.session.item;
        var type = req.body.type;
        if(type=="add"){
            _.find(goods,function(good){return good._id == req.body.good_id}).count++;
            req.session.total += 1;
        }
        if(type=="minus"){
            _.find(goods,function(good){return good._id == req.body.good_id}).count--;
            req.session.total -= 1;
        }

//        _.find(goods,function(good){
//            return good._id == req.body.good_id
//        }).savecount =
//            Good.get_savecount(_.find(goods,function(good){return good._id == req.body.good_id}).count,req.body.good_name,req.session.promotion) || 0;
        req.session.item = goods;
        var save_count = _.find(goods,function(good){return good._id == req.body.good_id}).savecount;
        var total_price = Good.get_total_price(req.session.item);
        req.session.total_price = total_price;
        res.json({savecount:save_count,total:req.session.total,total_price:total_price});

    });

    app.get('/admin',function(req,res){
        var page = req.query.p ? parseInt(req.query.p):1;
        Good.getTen(null,page,function(err,goods,total){
            if(err){
                return console.log(err);
            }
            res.render('adminpage/admin',{title:"pos机后台管理系统",
                cart_total:req.session.total,
                goods:goods,
                page:page,
                isFirstPage:(page-1)==0,
                isLastPage:((page - 1) * 10 + goods.length) == total,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        });
    });

    app.get('/addgood',function(req,res){
        var attr = req.session.all_property;
        res.render('adminpage/addgood', {
            title: "pos机后台管理系统",
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            attrs:attr
        });
    });

    app.post('/addgood',function(req,res){
        var good_object = req.body;
        console.log(good_object);
        Good.save(good_object,function(err,good){
           if(err){
               req.flash('error',"添加失败！");
               return res.redirect("/addgood");
           }
            req.session.all_property=[];
            req.flash('success','添加成功！');
            res.redirect('/addgood')
        });
    });

    app.post('/deleted',function(req,res){
        Good.delete_good(req.body.goodId,function(err,good){
            if(err){
                req.flash('error',"删除失败!");
            }
            req.flash('success',"删除成功!");
            res.redirect('/addgood');
        });

    });

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
        var all_property = req.session.all_property || [];
        var newattr = new Attr({name:name,value:value});
        all_property.push(newattr);
        req.session.all_property = all_property;
        req.flash('success',"添加成功");
        res.redirect('/addgood');

    });

    app.get('/delAttr1',function(req,res){
            res.render('adminpage/deleAttrFromAdd',{title:"pos机后台管理系统",
                attrs:req.session.all_property
            })
    });

    app.get('/delAttr2',function(req,res){
        var goodId = req.query.goodId;
        Good.get_good(goodId,function(err,attr){
            if(err){
                return console.log(err);
            }
            res.render('adminpage/deleAttrFromDet',{title:"pos机后台管理系统",
                attrs:attr[0].extre_attr.reverse(),
                good_name:req.session.good_name,
                good_id : goodId

            })

        });
    });

    app.post('/delAttr1',function(req,res){
        var attrName = req.body.attr_name;
        var all_property = req.session.all_property;
        var sub =_.indexOf(all_property,_.findWhere(all_property,{name:attrName}));
        all_property.splice(sub,1);
        req.session.property = all_property;
        res.redirect('/addgood');
        req.flash('success',"成功删除属性");
    });

    app.post('/delAttr2',function(req,res){
        var attr_name = req.body.attr_name;
        var good_id = req.body.good_id;
        Good.deleted_Attr_by_id(good_id,attr_name,function(err){
            if(err){
                return console.log(err);
            }
            req.flash('success',"删除成功");
            res.json({good_id:good_id})
        })
    });

    app.post('/addgoodadpage',function(req,res){
        var goodId = req.body.good_id;
        var goodNum  = req.body.good_count;
        Good.update(goodId,parseInt(goodNum),function(err){
            if(err){
                return console.log(err);
            }
            res.json({result:"success"});
        })
    });

    app.get('/gooddetail',function(req,res){
        console.log(req.session.all_property);
        var goodId = req.query.goodId;
        Good.get_good(goodId,function(err,good){
            if(err){
                return console.log(err);
            }
            req.session.good_name = good[0].name;
            res.render('adminpage/goodDetail',{title:"pos机后台管理",
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                good:good[0]
            });
        });

    });

    app.post('/gooddetail',function(req,res){
        var goodId = req.query.goodId;
        var goodObject = req.body;
        console.log(goodId,goodObject);
        Good.get_good(goodId,function(err,good){
            if(err){
                return console.log(err);
            }
            if(good){
                Good.update_property(goodId,goodObject,function(err){
                    if(err){
                        return console.log(err);
                    }
                    req.flash("success","更新成功");
                    res.redirect('./?goodId='+goodId);
                });
            }
        });
    });

    app.post('/editGoodNum',function(req,res){
        var goodName = req.body.goodName;
        var goodCount = parseInt(req.body.goodCount);
        Good.update(goodName,goodCount,function(err){
            if(err){
                return console.log(err);
            }
            req.flash('success',"修改成功");
            res.redirect('/admin');

        });
    });

    app.get('/addPropertyInDet',function(req,res){
        console.log(req.session.all_property);
        var goodId = req.query.goodId;
        var goodName = req.session.good_name;
        res.render('adminpage/addPropertyInDet',{
            title:"pos机后台管理系统",
            success:req.flash('success').toString(),
            error:req.flash('error').toString(),
            good_id:goodId,
            good_name:goodName
        });
    });

    app.post('/addPropertyInDet',function(req,res){
        var goodId = req.query.goodId;
        var propertyName = req.body.name;
        var propertyValue = req.body.value;
        var newProperty = new Attr({name:propertyName,value:propertyValue});
        var all_property = req.session.all_property || [];
        all_property.push(newProperty);
        req.session.all_property = all_property;
        req.flash('success',"添加成功");
        var url = '/gooddetail'+'?goodId='+goodId;
        res.redirect(url);
    });

    app.get('/addpromotion',function(req,res){
        res.render('promotionpage/addpromotion',{success:req.flash('success').toString(),
                error:req.flash('error').toString()
        });
    });

    app.get('/addrule',function(req,res){
        res.render('promotionpage/addrule',{success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    app.post('/addrule',function(req,res){
        var ruleDetail = req.body.ruleDetail.replace(/[\s"']/g,'');
        //得到需要优惠商品的截至时间time_condition
        var indexofcompare= ruleDetail.indexOf('day');
        var time_condition = moment(ruleDetail.slice(indexofcompare+4),"MM/DD/YYYY").valueOf();
        //得到时间前后限制maxmin < > =
        var maxmin = ruleDetail.slice(indexofcompare+3,indexofcompare+4);
        //得到需要优惠商品的名字
        var nameInfo = ruleDetail.split("&&")[0];
        nameInfo=nameInfo.split("||");
        var namearray = [];
        _.each(nameInfo,function(body){
            namearray.push({name:body.slice(6),day:time_condition});
        });
        //得到打折期限等具体优惠信息
        var starttime = moment(req.body.starttime,"MM/DD/YYYY").valueOf();
        var endtime = moment(req.body.endtime,"MM/DD/YYYY").valueOf();
        var buy = parseInt(req.body.buy);
        var discount = parseInt(req.body.discount);
        //新建select对象,将good和规则联系起来
        var newrule = new Select(null,starttime,endtime,buy,discount);
        newrule.save();
//        Discount.saveDiscountArray(namearray,function(err){
//            if(err){
//                return console.log(err)
//            }
//            req.flash('success',"保存成功!");
//            res.redirect('/addpromotion');
//        })

    })
};