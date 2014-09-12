var mongodb = require('./db');
var _ = require('underscore');

function Good(good){
    this.barcode = good.barcode;
    this.name = good.name;
    this.type = good.type;
    this.unit = good.unit;
    this.price = good.price;
    this.count = good.count;
    this.savecount = good.savecount;
}

module.exports = Good;


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