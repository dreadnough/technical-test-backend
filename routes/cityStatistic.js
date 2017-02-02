var express = require('express');
var router = express.Router();
var cityStats = require('../models/cityStats');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});


//Insert population data
router.post('/stat', function (req, res) {    
    if (Array.isArray(req.body.population) && req.body.population.length!==0) {        
        for (var i in req.body.population) {            
            if(typeof req.body.population[i].count==='undefined'|| typeof req.body.population[i].age==='undefined'){               
                res.send({"errors":{"population":'population should have property age and count', "name": "ValidationError"},
                "message": "cityStats validation failed", "name": "ValidationError"});
                return;
            }  
        }        
        var city = new cityStats({
            city: req.body.city,
            ts: req.body.ts,
            population: req.body.population
        });
        city.save(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    } else {
        res.send({"errors":{"population":'population should be array', "name": "ValidationError"},"message": "cityStats validation failed",
    "name": "ValidationError"});
    }

});

//Population by city (its last record) and age
router.get('/stats', function (req, res) {
    cityStats.aggregate([
        { $sort: { ts: 1 } },
        {
            $group: {
                _id: '$city',
                ts: { "$last": '$ts' },
                city: { $last: '$city' },
                population: { $last: '$population' }
            }
        },
        {
            $project: {
                _id: 0,
                city: '$city',
                ts: '$ts',
                population: '$population'
            }
        }

    ], function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

//Population by city
router.get('/stat/:city', function (req, res) {
    var city = req.params.city; // validation here
    cityStats.aggregate([
        { $match: { city: city } },
        { $sort: { ts: -1 } },
        { $unwind: '$population' },
        {
            $project: {
                _id: 0,
                city: '$city',
                populationRecords: {
                    age: '$population.age',
                    count: '$population.count',
                    ts: '$ts'
                }
            }
        },
        {
            $group: {
                _id: { city: '$city', age: '$populationRecords.age' },
                populationRecords: { $first: '$populationRecords' }
            }
        },
        { $sort: { 'populationRecords.age': 1 } },
        {
            $group: {
                _id: '$_id.city',
                populationRecords: { $push: '$populationRecords' }
            }
        },
        {
            $project: {
                _id: 0,
                city: '$_id',
                populationRecords: '$populationRecords'
            }
        }

    ], function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

//Population by all ages
router.get('/statbyages', function (req, res) {
    cityStats.aggregate([
        { $unwind: '$population' },
        {
            $project: {
                _id: 0,
                city: '$city',
                age: '$population.age',
                count: '$population.count',
                ts: '$ts'
            }
        },
        { $sort: { city: 1, age: 1, ts: -1 } },
        {
            $group: {
                _id: { city: '$city', age: '$age' },
                ts: { $first: '$ts' },
                count: { $first: '$count' }
            }
        },
        {
            $project: {
                _id: 0,
                city: '$_id.city',
                age: '$_id.age',
                ts: '$ts',
                count: '$count'
            }
        },
        {
            $group: {
                _id: '$age',
                max: { $max: '$count' },
                min: { $min: '$count' },
                sum: { $sum: '$count' },
                mean: { $avg: '$count' }
            }
        },
        {
            $project: {
                _id: 0,
                age: '$_id',
                max: '$max',
                min: '$min',
                sum: '$sum',
                mean: '$mean'
            }
        },
        { $sort: { age: 1 } }

    ], function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});


//Population by cities (of all time)
router.get('/statbytime', function (req, res) {
    cityStats.aggregate([
        { $unwind: '$population' },
        {
            $project: {
                _id: 0,
                city: '$city',
                count: '$population.count'
            }
        },
        {
            $group: {
                _id: '$city',
                sum: { $sum: '$count' },
                mean: { $avg: '$count' },
                max: { $max: '$count' },
                min: { $min: '$count' }
            }
        },
        {
            $project: {
                _id: 0,
                city: '$_id',
                historicalPopulation: {
                    sum: '$sum',
                    mean: '$mean',
                    max: '$max',
                    min: '$min'
                }
            }
        }
    ], function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

module.exports = router;


