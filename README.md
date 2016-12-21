# Technical test for backend

This test app consists of a census API that retrieves data from MongoDB.

## Considerations

- Fork this repository and do everything in Github.
- Use latest NodeJS ([Hapijs](https://hapijs.com) is our default, but Express or others is acceptable)
- Use Javascript linter ([Hapijs's Lab](https://github.com/hapijs/lab) is our default, but any other is acceptable)
- Try to cover your code with unit tests by 100 % ([Hapijs's Lab](https://github.com/hapijs/lab) is our default, but any other is acceptable)
- Use Docker to run the whole app (docker-compose to run a local MongoDB and your app)
- Update the [How to run this app](#how-to-run-this-app) instructions on this README.

## Database

A **local MongoDB database** will contain data with this data-model:
````
{
	"ts": 1429521853000,
	"city": "Madrid",
	"population": [
		{"age": 20, "count": 1000},
		{"age": 24, "count": 1343},
		{"age": 37, "count": 100},
		{"age": 50, "count": 2000}
	]
}
`````

## API

The API will provide different endpoints for each case:

### Insert population data

This endpoint will allow to insert a document with new data (according to the [data-model](#database))

### Population by city

This endpoint will return the population by ascending age of the city specified in the URL.

Using only the most-recent record of each city.

### Population by all ages

This endpoint will return for each ascending age:

- The SUM value of `count` of all cities.
- The MEAN value of `count` of all cities.
- The MAX value of `count` of all cities.
- The MIN value of `count` of all cities.

Using only the most-recent record of each city.

````
[
    {
        "age": 20,
        "count": 1000,
        "city": "Madrid",
        "ts": 1429521853000
    },
    {
        "age": 23,
        "count": 1260,
        "city": "Sevilla",
        "ts": 1429522853000
    }
]
````

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


### Population by city and age of last record

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
    }
]
```

## How to run this app

> Update this section with the instructions of installing and running your app (have in mind the unknown environment in which it can run)