var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var cityStatsSchema = new Schema({
  ts: { type:Number,required: true},
  city: { type: String, required: true},
  population:{ type : Array , "default" : [] }
});

function arrayLimit(val) {
  return val.length >= 1;
}
// the schema is useless so far
// we need to create a model using it
var cityStats = mongoose.model('cityStats', cityStatsSchema);

// make this available to our users in our Node applications
module.exports = cityStats;

// var cityStatsSchema = new Schema({
//   ts: { type:Number,required: true},
//   city: { type: String, required: true},
//   population: {
//   	type:[{ age: Number,
//   	 count: Number }],
//    validate: [arrayLimit, 'should be at least 1']
//   } 
// });