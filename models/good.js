var mongodb = require('./db');
var _ = require('underscore');

function Good(name,count,price,unit,barcode,type,savecount){
    this.barcode =barcode || null;
    this.name = name ;
    this.type = type || null;
    this.unit = unit;
    this.price = price || 0;
    this.count = count || 0;
    this.savecount = savecount || 0;
    this.extre_attr = null;
    this.date = Date.now();
}

module.exports = Good;



Good.prototype.save=function(callback){

    var new_good = this;
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(new_good,{safe:true},function(err,new_good){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,new_good[0]);
            });

        });
    });

};

Good.update=function(good_name,good_num,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({"name":good_name},{$set:{count:good_num}},function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })

        })
    })
};



Good.delete_good=function(good_name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({"name":good_name},function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            });

        });
    });

};



Good.get_all_goods = function(callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取goods集合
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({}).sort({
                time:-1
            }).toArray(function(err,goods){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,goods);
            });
        });
    });
};
Good.get_good_by_name = function(good_name,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取goods集合
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({name:good_name}).sort({
                _id:1
            }).toArray(function(err,goods){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,goods);
            });
        });
    });
};



Good.deleted_Attr_by_name = function(good_name,attr_name,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取goods集合
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({name:good_name},{$pull:{extre_attr:{name:attr_name}}},function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

Good.get_promotions = function(callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取promotions集合
        db.collection('promotions',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({}).sort({
                time:-1
            }).toArray(function(err,promotions){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,promotions);
            });
        });
    });
};

Good.get_savecount = function(count,name,barcodes){
    console.log(name);
    console.log(barcodes);
    if(_.find(barcodes,function(message){return message.name == name})){
        console.log(Math.floor(count/3));
        return Math.floor(count/3);
    }
};

Good.get_no_null_messages=function(messages){
    return _.filter(messages,function(obj){return obj.count != 0});

};

Good.get_gift=function(buy_goods){
    return _.filter(buy_goods,function(good){return good.savecount !=0});

};

Good.get_gift_price =function(goods){
    var price =0;
    _.each(goods,function(good){price+=good.price*(good.savecount)});
    return price;
};

Good.get_total_price = function(goods){
    var price =0;
    _.each(goods,function(good){price+=good.price*(good.count-good.savecount)});
    return price;
};