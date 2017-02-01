var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cityStatsSchema = new Schema({
  ts: { type:Number,required: true},
  city: { type: String, required: true},
  population:{ type : Array , "default" : [] }
},{
    versionKey: false 
});

function arrayLimit(val) {
  return val.length >= 1;
}

var cityStats = mongoose.model('cityStats', cityStatsSchema);
module.exports = cityStats;

