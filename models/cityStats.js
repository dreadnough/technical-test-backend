var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cityStatsSchema = new Schema({
  ts: { type:Number,required: true},
  city: { type: String, required: true},
  population:{ type : Array , required :true }  
},{
    versionKey: false 
});

var cityStats = mongoose.model('cityStats', cityStatsSchema);
module.exports = cityStats;

