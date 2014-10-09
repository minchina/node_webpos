var mongodb = require('./db');
var _ = require('underscore');


function Promotion (name,day,datetime){
    this.name = name;
    this.day = day ||[];
    this.datetime =  datetime || []
}

module.exports = Promotion;