# dbgeo

Convert database query results to GeoJSON or TopoJSON. Inspired by [Bryan McBride's](https://github.com/bmcbride) [PHP-Database-GeoJSON](https://github.com/bmcbride/PHP-Database-GeoJSON). Works with your database of choice - ideally paired with [node-mysql](https://github.com/felixge/node-mysql) or [node-postgres](https://github.com/brianc/node-postgres). A more flexible version of [postgeo](https://github.com/jczaplew/postgeo) and [mysql2geojson](https://github.com/jczaplew/mysql2geojson).

###### Installation
````npm install dbgeo````

###### Example Usage
````
var dbgeo = require("dbgeo");

// Query a database...

dbgeo.parse({
  "data": data,
  "outputFormat": "geojson",
  "geometryColumn": "geom",
  "geometryType": "wkt"
},function(error, result) {
  if (error) {
    return console.log(error);
  }
  // This will log a valid GeoJSON object
  console.log(result)  
});

````

See ````test/test.js```` for more examples.


## API

### .parse({ params, callback })
````params```` is an object that contains the following keys:

+ ````data```` (***required***) - Results from a query. Should be an array of objects.
+ ````geometryType```` - Format of input geometry. Can be "wkt", "geojson", or "ll". "Default is "geojson".
+ ````geometryColumn```` - Name of column that contains geometry. If input geometry type is "ll", this is an array in the format ````["latitude", "longitude"]````. Default value is "geometry".
+ ````outputFormat```` - Can be either "geojson" or "topojson". Default value is "geojson".
+ ````callback```` (***required***) - A function with two parameters: an error, and a result object.

Examples can be found in ````test/test.js````.

### .defaults{}
The default parameters for ````.parse()````. You can set these before using ````.parse()```` if you plan to use the same options continuously.

## License
CC0
