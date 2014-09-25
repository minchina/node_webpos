var mongodb = require('./db');
var _ = require('underscore');

function Attr(attr){
    this.name = attr.name;
    this.value = attr.value;

}

module.exports = Attr;


//Attr.get = function(attr_name,callback){
//  mongodb.open(function(err,db){
//      if(err){
//          return callback(err);
//      }
//      db.collection('attr',function(err,collection){
//         if(err){
//             mongodb.close();
//             return callback(err);
//         }
//          collection.findOne({name:attr_name},function(err,doc){
//              if(doc){
//                  var attr = new Attr(doc);
//                  callback(null,attr);
//              }else{
//                  return callback(err,null);
//              }
//          });
//      });
//  });
//};

Attr.get = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection('attr', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};


Attr.get_attr = function(callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取goods集合
        db.collection('attr',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({}).sort({
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