# Technical test for backend

This test app is an API that returns population census data from MongoDB. It has different endpoints of input and output and runs using Docker.

## Considerations

- Fork this repository and do everything in Github.
- Use latest NodeJS ([Hapijs](https://hapijs.com) is our default, but Express or others is acceptable)
- Follow REST principles as much as possible.
- Use Javascript linter ([Hapijs's Lab](https://github.com/hapijs/lab) is our default, but any other is acceptable)
- Try to cover your code with unit tests by ~80 % ([Hapijs's Lab](https://github.com/hapijs/lab) is our default, but any other is acceptable)
- Use Docker to run the whole app (docker-compose is optional to run a local MongoDB and your app altogether)
- Update the [How to run this app](#how-to-run-this-app) instructions on this README.

## Database

A **local MongoDB database** will contain data with this data-model:
```
{
	"ts": 1429521853000,
	"city": "Madrid",
	"population": [
		{"age": 20, "count": 1000},
		{"age": 24, "count": 1343},
		{"age": 37, "count": 100},
		{"age": 50, "count": 2000}
	]
},
{
	"ts": 1482339388000,
	"city": "Valencia",
	"population": [
		{"age": 10, "count": 340},
		{"age": 29, "count": 1753},
		{"age": 46, "count": 800},
		{"age": 82, "count": 15}
	]
}
```

All queries on each endpoint should be made using the **“aggregation” framework of MongoDB**.

## API

The API will provide different endpoints for each case:

### Insert population data

This endpoint will allow to insert a document with new data (according to the [data model](#database)). It should validate the input data against the data model.

### Population by city (its last record) and age

This endpoint will return the most-updated record of each city.

```
[
    {
        "city": "Madrid",
        "ts": 1429521853000
        "population": [
            {"age": 20, "count": 1000},
            {"age": 24, "count": 1343},
            {"age": 37, "count": 100},
            {"age": 50, "count": 2000}
        ]
    },

        "city": "Galicia",
        "ts": 1482339749000
        "population": [
            {"age": 17, "count": 1000},
            {"age": 56, "count": 1343},
            {"age": 78, "count": 100}
        ]
    }
]
```

### Population by city

This endpoint will return the population (`count`) by ascending age (`age`) of the city specified in the URL. It will use the latest document of each city for each age (if latest document doesn't have that age, it will use an older one):

```
{
    "city": "Madrid",
    "populationRecords": [
        {"age": 20, "count": 1000, "ts": 1429521853000}, // This one is from the latest MongoDB document (2015)
        {"age": 24, "count": 1343, "ts": 1429521853000}, // (2015)
        {"age": 25, "count": 630, "ts": 1292950449000}, // This one is from an older record! (2010)
        {"age": 37, "count": 100, "ts": 1429521853000}, // (2015)
        {"age": 50, "count": 2000, "ts": 1429521853000}, // (2015)
        {"age": 75, "count": 45, "ts": 1292950449000}, // (2010)
        {"age": 99, "count": 2, "ts": 1292950449000} // (2010)
    ]
}
```

### Population by all ages

For each ascending age and using only the most-recent record of each city, this endpoint will return:

- The SUM value of `count` of all cities.
- The MEAN value of `count` of all cities.
- The MAX value of `count` of all cities.
- The MIN value of `count` of all cities.

```
[
    {
        "age": 20,
        "sum": 13023, // The total of people with this age across all cities.
        "mean": 535, // Mean total of population with this age across all cities.
        "max": 760, // Max peak of population with this age (this corresponds to one city, but it's not necessary to show which)
        "min": 25 // Min number of population with this age (this corresponds to one city, but it's not necessary to show which)
    },
    {
        "age": 24,
        "sum": 15644,
        "mean": 735,
        "max": 860,
        "min": 50
    }
]
```

### Population by cities (of all time)

This endpoint will return the Historical census statistics of each city. So, for each city:

- The SUM of `count` of all of its ages (the accumulated total of people in the History of this city)
- The MEAN of `count` of all of its ages (the mean population in the History of this city)
- The MAX of `count` of all of its ages (the peak of population in the History of this city)
- The MIN of `count` of all of its ages (the minimun peak of population in the History of this city)

```
[
    {
        "city": "Madrid",
        "historicalPopulation": {
            "sum": 12633, // Sum of all populations across-time for this city
            "mean": 5700, // Mean historical population across-time for this city
            "max": 9000, // Max historical population across-time for this city
            "min": 4443 // Min historical population across-time for this city
        }
    },
    {
        "city": "Barcelona",
        "historicalPopulation": {
            "sum": 10980,
            "mean": 7900,
            "max": 10000,
            "min": 3500
        }
    }
]
```

## How to run this app

With docker : docker-compose up
```
SetUpMongoDB uncomment in Dockerfile and run first time
mongoSetUp:
  build: ./mongoSetUp
  links:
    - mongo
```
Without docker: start MongoDB -> npm i -> npm start
```
Set up MongoDB : mongoimport --host=mongo --port=27017 --db testForBackend --collection citystats --type json --file mongoSetUp.json --jsonArray
```
Run tests : npm test
##Routes: 
- Insert population data (POST) /stat
- Population by city (its last record) and age (GET) /stats
- Population by city (GET) /stat/:city  - (where :city -> cityname)
- Population by all ages (GET) /statbyages
- Population by cities (of all time) (GET) /statbytime