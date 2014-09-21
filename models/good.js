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

Good.get_savecount = function(count,barcode,barcodes){
    if(_.find(barcodes,function(message){return message.barcode == barcode})){
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