# dbgeo

Convert database query results to GeoJSON or TopoJSON. Inspired by [Bryan McBride's](https://github.com/bmcbride) [PHP-Database-GeoJSON](https://github.com/bmcbride/PHP-Database-GeoJSON). Works with your database of choice - ideally paired with [node-mysql](https://github.com/felixge/node-mysql), [node-postgres](https://github.com/brianc/node-postgres), or [mongodb](https://github.com/mongodb/node-mongodb-native). It is a more flexible version of [postgeo](https://github.com/jczaplew/postgeo) and [mysql2geojson](https://github.com/jczaplew/mysql2geojson) (*both deprecated*).

###### Installation
````
npm install dbgeo
````

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
An array of objects, usually results from a database query.

##### options (*optional*)
Configuration object that can contain the following keys:

| argument |  description  | values  |  default value  |
|----------|---------------|---------|-----------------|
| `geometryType`  |  Format of input geometry | wkb, wkt, geojson, ll  | wkb  |
| `geometryColumn`|  Name of column that contains geometry. If input geometry type is "ll", this is an array in the format ````['longitude', 'latitude']```` | *Any string*  | geom  |
| `outputFormat`  | Desired output format  | geojson, topojson  | geojson  |
| `precision`     | Trim the coordinate precision of the output to a given number of digits using [geojson-precision](https://github.com/jczaplew/geojson-precision) | *Any integer* | `null` (will not trim precision) |
| `quantization` | Value for quantization process, typically specified as powers of ten, see [topojson.quantize](https://github.com/topojson/topojson-client/blob/master/README.md#quantize) | *Any integer greater than one* | `null` (no quantization) |


##### callback (***required***)
A function with two parameters: an error, and a result object.

Examples can be found in ````test/test.js````.

### .defaults{}
The default options for ````.parse()````. You can set these before using ````.parse()```` if you plan to use the same options continuously.

## License
CC0
