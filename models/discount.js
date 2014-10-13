var mongodb = require('./db');
var _ = require('underscore');
// var mongoose = require('mongoose');
// var ObjectId = mongoose.Types.ObjectId;
//other method
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

Discount.get_discount_good=function(name,day,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('goods',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({"$or": [{"name":{"$in":["stephen","stephen1"]}}, {"age":36}]})
            collection.find({"$":[,]})
        })
    })

};