New lng/lat(/z) format
data, options, callback and not options, callback
Remove parse method - just call directly
Change default column name to `geom`
Change default geomtry type to `wkb`
Integrate geojson-precision

# dbgeo

Convert database query results to GeoJSON or TopoJSON. Inspired by [Bryan McBride's](https://github.com/bmcbride) [PHP-Database-GeoJSON](https://github.com/bmcbride/PHP-Database-GeoJSON). Works with your database of choice - ideally paired with [node-mysql](https://github.com/felixge/node-mysql) or [node-postgres](https://github.com/brianc/node-postgres). A more flexible version of [postgeo](https://github.com/jczaplew/postgeo) and [mysql2geojson](https://github.com/jczaplew/mysql2geojson).

###### Installation
````npm install dbgeo````

###### Example Usage
````javascript
var dbgeo = require('dbgeo')

// Query a database...

dbgeo.parse(data, {
  outputFormat: 'geojson'
}, function(error, result) {
  // This will log a valid GeoJSON FeatureCollection
  console.log(result)  
});

````

See ````test/test.js```` for more examples.


## API

### .parse(data, options, callback)

##### data (***required***)  
Results from a query. Should be an array of objects.

##### options
An object that can contain the following keys:

+ ````geometryType```` - Format of input geometry. Can be "wkb", "wkt", "geojson", or "ll". "Default is "wkb" (Well-Known Binary, PostGIS's default format).
+ ````geometryColumn```` - Name of column that contains geometry. If input geometry type is "ll", this is an array in the format ````['longitude', 'latitude']````. Default value is "geom".
+ ````outputFormat```` - Can be either "geojson" or "topojson". Default value is "geojson".

##### callback (***required***)
A function with two parameters: an error, and a result object.

Examples can be found in ````test/test.js````.

### .defaults{}
The default parameters for ````.parse()````. You can set these before using ````.parse()```` if you plan to use the same options continuously.

## License
CC0
