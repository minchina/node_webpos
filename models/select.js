var mongodb = require('./db');
var _ = require('underscore');
var ObjectId = require('mongodb').ObjectID;
var Discount =require('./discount');
var Good =require('./good');



function Select (name,starttime,endtime,buy,discount){
    this.name = name;
    this.day = {starttime:starttime,endtime:endtime};
    this.datetime = {buy:buy,discount:discount}
}

module.exports = Select;


Select.prototype.save=function(callback){
    console.log("11===");
    Discount.get(null,function(err,datas){
        if(err){
            return console.log(err);
        }
        var namearray = [];
        var dayarray = [];
        _.each(datas,function(data){
           namearray.push(data.name);
           dayarray.push(data.day);
        });
//        console.log(namearray,dayarray);
        Good.get_by_condition(namearray,dayarray,function(err,goods){
            if(err){
                return callback(err);
            }
            console.log(goods);
            console.log("success========");
        })
    })
};

