var mongodb = require('./db');
var _ = require('underscore');
var ObjectId = require('mongodb').ObjectID;

function Discount(day){
    this.name = {};
    this.day = day;
}

module.exports = Discount;

Discount.prototype.save=function(callback){
    var select_good = this;
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('select_good',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(select_good,{safe:true},function(err,select_good){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,select_good[0]);
            });
        });
    });
};

Discount.saveDiscountArray=function(arrObj,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('select_good',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(arrObj,{safe:true},function(err,arrObj){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,arrObj);
            })
        })
    })

};