var mongodb = require('./db');
var _ = require('underscore');

function Attr(){

}

module.exports = Attr;



Attr.prototype.save=function(callback){

    var new_attr = this;
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('attr',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(new_attr,{safe:true},function(err,new_attr){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,new_attr[0]);
            });

        });
    });

};