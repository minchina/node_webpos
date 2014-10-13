var mongodb = require('./db');
var _ = require('underscore');
var ObjectId = require('mongodb').ObjectID;



function Select (name,starttime,endtime,buy,discount){
    this.name = name;
    this.day = {starttime:starttime,endtime:endtime};
    this.datetime = {buy:buy,discount:discount}
}

module.exports = Select;

