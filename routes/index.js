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
        var page = req.query.p ? parseInt(req.query.p):1;
        Good.getTen(null,page,function(err,goods,total){
            if(err){
                return callback(err);
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

        Attr.get_attr(function(err,attr){
            if(err){
                return callback(err);
            }
            res.render('adminpage/addgood', {
                title: "pos机后台管理系统",
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                attrs:attr
            });
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
        Attr.get_attr(function(err,attr){
           if(err){
               return callback(err);
           }
            var newGood = new Good(goodName,goodCount,goodPrice,goodUnit);
            newGood.extre_attr = attr;
            newGood.save(function(err,user){
                if(err){
                    req.flash('error',"添加失败！");
                    return res.redirect("/addgood");
                }
                Attr.delete_all_attr(function(err,data){
                    if(err){
                        return callback(err);
                    }
                    req.flash('success','添加成功！');
                    res.redirect('/addgood')

                });

            })
        });

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

    app.get('/delAttr1',function(req,res){
        Attr.get_attr(function(err,attr){
           if(err){
               return callback(err);
           }
            res.render('adminpage/deleAttrFromAdd',{title:"pos机后台管理系统",
                attrs:attr
            })

        });
    });

    app.get('/delAttr2',function(req,res){
        var good_name = req.query.good_name;
        Good.get_good_by_name(good_name,function(err,attr){
            if(err){
                return callback(err);
            }
            res.render('adminpage/deleAttrFromDet',{title:"pos机后台管理系统",
                attrs:attr[0].extre_attr.reverse(),
                good_name:good_name
            })

        });
    });
    app.post('/delAttr1',function(req,res){
        var attrName = req.body.attr_name;
        Attr.delete_attr(attrName,function(err,attr){
            if(err){
                return callback(err);
            }
            res.redirect('/addgood');
            req.flash('success',"成功删除属性");

        })
    });

    app.post('/delAttr2',function(req,res){
        var attr_name = req.body.attr_name;
        var good_name = req.body.good_name;
        Good.deleted_Attr_by_name(good_name,attr_name,function(err,data){
            if(err){
                return callback(err);
            }
            req.flash('success',"删除成功");
            res.json({good_name:good_name})
        })
    });

    app.post('/addgoodadpage',function(req,res){
        var goodName = req.body.good_name;
        var goodNum  = req.body.good_count;
        Good.update(goodName,goodNum,function(err,data){
            if(err){
                return callback(err);
            }
            res.json({result:"success"});
        })
    });

    app.get('/gooddetail',function(req,res){
        var goodName = req.query.good_name;
        console.log("======================="+goodName);
        Good.get_good_by_name(goodName,function(err,good){
            if(err){
                return callback(err);
            }
            Attr.get_attr(function(err,attr){
                if(err){
                    return callback(err);
                }
                res.render('adminpage/goodDetail',{title:"pos机后台管理",
                    success:req.flash('success').toString(),
                    error:req.flash('error').toString(),
                    good:good[0],
                    new_attr:attr

            });

            })
        });

    });

    app.post('/gooddetail',function(req,res){
        var goodName = req.body.good_name;
        var goodCount = req.body.good_count;
        var goodUnit = req.body.good_unit;
        var goodPrice =req.body.good_price;

        Good.get_good_by_name(goodName,function(err,good){
            if(err){
                return callback(err);
            }
            //说明该商品存在
            if(good){

                Good.get_good_by_name(goodName,function(err,goodattr){
                    if(err){
                        return callback(err);
                    }
                    var good_pro = goodattr[0].extre_attr;
                    var exter=[];
                    _.each(good_pro,function(attr){
                        exter.push({name:attr.name,value:req.body[attr.name]});
                    });
                    var updategood = new Good(goodName,goodCount,goodPrice,goodUnit);
                    updategood.extre_attr = exter;
                    Attr.get_attr(function(err,attrs){
                        if(err){
                            return callback(err);
                        }
                        _.each(attrs,function(attr){
                            updategood.extre_attr.push({name:attr.name,value:attr.value});
                        });
                        Good.delete_good(goodName,function(err,data){
                            if(err){
                                return callback(err);
                            }
                            updategood.save(function(err,good){
                                if(err){
                                    return callback(err);
                                }
                                Attr.delete_all_attr(function(err,nodata){
                                    if(err){
                                        return callback(err);
                                    }
                                    req.flash("success","更新成功");
                                    res.redirect.apply('./?good_name='+goodName);
                                });

                            });
                        })

                    });

                })


            }
        })

    });

    app.post('/editGoodNum',function(req,res){
        var goodName = req.body.goodName;
        var goodCount = parseInt(req.body.goodCount);
        Good.update(goodName,goodCount,function(err,data){
            if(err){
                return callback(err);
            }
            req.flash('success',"修改成功");
            res.redirect('/admin');

        });
    })
};