var mongodb = require('./db');
var _ = require('underscore');
// var mongoose = require('mongoose');
// var ObjectId = mongoose.Types.ObjectId;
//other method
var ObjectId = require('mongodb').ObjectID;

function Good(name,count,price,unit,barcode,type){
    this.barcode =barcode || null;
    this.name = name ;
    this.type = type || null;
    this.unit = unit;
    this.price = price || 0;
    this.count = count || 0;
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

Good.save=function(new_good,callback){
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
Good.update_property = function(good_id,goodobject,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({_id:new ObjectId(good_id)},goodobject,function(err){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                callback(null);
            })
        })
    })
};

Good.update=function(good_id,good_num,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({_id:new ObjectId(good_id)},{$set:{count:good_num}},function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })

        })
    })
};

Good.delete_good=function(goodId,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('goods',function(err,collection){
            if(err){    
                mongodb.close();
                return callback(err);
            }
            collection.remove({_id:ObjectId(goodId)},function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            });

        });
    });

};

Good.getTen=function(name,page,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(name){
                query.name=name;
            }
            collection.count(query,function(err,total){
                collection.find(query,{
                    skip:(page-1)*10,
                    limit:10
                }).sort({
                    _id:-1
                }).toArray(function(err,docs){
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    callback(null,docs,total);
                });
            });
        });
    });
};

Good.get_good = function(goodId,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if(goodId){
                query._id = ObjectId(goodId);
            }
            collection.find(query).sort({
                _id:1
            }).toArray(function(err,goods){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,goods);
            });
        })
    })
};

Good.bulkQuery = function(queryObject, callback){
    var idArray = [];
    for(var i=0;i<queryObject.length;i++){
        idArray.push({_id:ObjectId(queryObject[i])})
    }
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {"$or":idArray};
            if(idArray.length == 0){
                query = {};
            }
            collection.find(query).sort({
                _id:1
            }).toArray(function(err,goods){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                if(idArray.length == 0){
                    goods = [];
                }
                callback(null,goods);
            });
        })
    })
};



Good.deleted_Attr_by_id = function(good_id,attr_name,callback){
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
            collection.update({_id:new ObjectId(good_id)},{$pull:{extre_attr:{name:attr_name}}},function(err){
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