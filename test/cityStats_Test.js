process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var CityStats = require('../models/cityStats');

//Require the dev-dependencies
var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var App = require('../app');
var should = chai.should();
chai.use(chaiHttp);

var sityStat1 = {
    ts: 1992339388000,
    city: "ValenciaTest",
    population: [
        { "age": 10, "count": 340 },
        { "age": 29, "count": 1753 },
        { "age": 46, "count": 800 },
        { "age": 82, "count": 15 }
    ]
};
var sityStat2 = {
    ts: 1992339388000,
    city: "ValenciaTest",
    population: [
        { "age": 15, "count": 440 },
        { "age": 29, "count": 1753 },
        { "age": 46, "count": 800 },
        { "age": 72, "count": 85 },
        { "age": 82, "count": 15 }
    ]
};
var sityStat3 = {
    ts: 1992339388000,
    city: "MadridTest",
    population: [
        { "age": 16, "count": 840 },
        { "age": 29, "count": 1753 },
        { "age": 36, "count": 900 },
        { "age": 72, "count": 85 },
        { "age": 82, "count": 15 }
    ]
};

describe('SityStats', function () {
    before(function (done) { //Before test we empty the database and fiil it with test data
        CityStats.remove({}, function (err) {
            CityStats.create(sityStat1, sityStat2, function (err) {
                if (err) {
                    done()
                } else {
                    done();
                }
            })
        });
    });

    /*
         * Test the /POST route
         */
    describe('/POST Stat', function () {
        it('it should POST new sityStat ', function (done) {
            chai.request(App)
                .post('/stat')
                .send(sityStat3)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('ts');
                    res.body.should.have.property('city');
                    res.body.should.have.property('population');
                    done();
                });
        });
    });


        /*
        * Population by city (its last record) and age
        */
    describe('/GET stats', function () {
        it('Population by city (its last record) and age', function (done) {
            chai.request(App)
                .get('/stats')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');                    
                    res.body[0].should.have.property('city');
                    res.body[0].should.have.property('ts');
                    res.body[0].should.have.property('population');
                    res.body[0].should.not.have.property('_id');
                    done();
                });


        });
    });
        /*
        * Population by city
        */
    describe('/GET /stat/:city', function () {
        it('Population by city', function (done) {
            chai.request(App)
                .get('/stat/ValenciaTest')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('city').eql('ValenciaTest');                    
                    res.body[0].should.have.property('populationRecords');                    
                    res.body[0].should.not.have.property('_id');
                    done();
                });

        });
    });


        /*
        * //Population by all ages
        */
    describe('/GET /statbyages', function () {
        it('Population by all ages', function (done) {
            chai.request(App)
                .get('/statbyages')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');                    
                    res.body[0].should.have.property('age');                    
                    res.body[0].should.have.property('max');
                    res.body[0].should.have.property('min');                     
                    res.body[0].should.have.property('sum');
                    res.body[0].should.have.property('mean');  
                    res.body[0].should.not.have.property('_id');
                    done();
                });

        });
    });

        /*
        * Population by cities (of all time)
        */
    describe('/GET /statbytime', function () {
        it('Population by cities (of all time)', function (done) {
            chai.request(App)
                .get('/statbytime')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');                    
                    res.body[0].should.have.property('city');                    
                    res.body[0].should.have.property('historicalPopulation');                    
                    res.body[0].should.not.have.property('_id');
                    done();
                });

        });
    });

});