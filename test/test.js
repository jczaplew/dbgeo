var pg = require('pg')
var credentials = require('./credentials')
var dbgeo = require('../lib/dbgeo')
var series = require('async/series')
var geojsonhint = require('geojsonhint')
var client = new pg.Client('postgres://' + credentials.user + '@' + credentials.host + ':' + credentials.port + '/' + credentials.database)

// Connect to postgres
client.connect(function(error, success) {
  if (error) {
    console.log('Could not connect to postgres')
  }
})

series([
  function(callback) {
    console.time('test1')
    /* Select two points, returning the geometry as a GeoJSON object in the field 'geometry' */
    client.query('SELECT name, ST_AsGeoJSON(geom, 6) AS geometry FROM places LIMIT 2', function(error, result) {
      dbgeo.parse(result.rows, {
        geometryType: 'geojson',
        geometryColumn: 'geometry'
      }, function(error, result) {
        console.timeEnd('test1')
        if (error) {
          callback({test: 1, error: error })
        } else {
          var errors = geojsonhint.hint(result)
          if (errors.length) {
            callback({test: 1, error: errors})
          } else {
            callback(null)
          }

          //console.log(JSON.stringify(result));
        }
      })
    })
  },
  function(callback) {
    console.time('test2')
    /* Select two polygons, returning the geometry as a GeoJSON object in the field 'geom', then
       converting the result to TopoJSON */
    client.query('SELECT name, ST_AsGeoJSON(geom, 6) AS geom FROM countries LIMIT 2', function(error, result) {
      dbgeo.parse(result.rows, {
        geometryType: 'geojson',
        outputFormat: 'topojson'
      }, function(error, result) {
        console.timeEnd('test2')
        if (error) {
          callback({test: 2, error: error })
        } else {
          callback(null)
          //console.log(JSON.stringify(result));
        }
      })
    })
  },
  function(callback) {
    console.time('test3')
    /* Select two polygons, returning the geometry as WKT in the field 'wkt' */
    client.query('SELECT name, ST_AsText(geom) AS wkt FROM countries LIMIT 2', function(error, result) {
      dbgeo.parse(result.rows, {
        geometryColumn: 'wkt',
        geometryType: 'wkt',
        outputFormat: 'geojson',
        precision: 4
      }, function(error, result) {
        console.timeEnd('test3')
        if (error) {
          callback({test: 3, error: error })
        } else {
          var errors = geojsonhint.hint(result)
          if (errors.length) {
            console.log(errors)
          }
          callback(null)

         // console.log(JSON.stringify(result));
        }
      })
    })
  },
  function(callback) {
    console.time('test4')
    /* Select two points, returning a latitude and longitude for each */
    client.query('SELECT name, longitude::float, latitude::float FROM places LIMIT 2', function(error, result) {
      dbgeo.parse(result.rows, {
        'geometryColumn': ['longitude', 'latitude'],
        'geometryType': 'll',
        'precision': 6
      }, function(error, result) {
        console.timeEnd('test4')
        if (error) {
          callback({test: 4, error: error })
        } else {
          var errors = geojsonhint.hint(result)
          if (errors.length) {
            console.log(errors)
          }
          callback(null)

         // console.log(JSON.stringify(result));
        }
      })
    })
  },
  function(callback) {
    console.time('test5')
    /* Select two points and WKB geometry */
    client.query('SELECT name, geom FROM places LIMIT 2', function(error, result) {
      dbgeo.parse(result.rows, {
        precision: 6
      }, function(error, result) {
        console.timeEnd('test5')
        if (error) {
          callback({test: 5, error: error })
        } else {
          var errors = geojsonhint.hint(result)
          if (errors.length) {
            callback({test: 5, error: errors})
          } else {
            callback(null)
          }
         // console.log(JSON.stringify(result));
        }
      })
    })
  },
  function(callback) {
    console.time('test6')
    /* Select a null geometry */
    client.query('SELECT 1 AS name, null AS geom', function(error, result) {
      dbgeo.parse(result.rows, null, function(error, result) {
        console.timeEnd('test6')
        if (error) {
          callback({test: 6, error: error })
        } else {
          var errors = geojsonhint.hint(result)
          if (errors.length) {
            callback({test: 6, error: errors})
          } else {
            callback(null)
          }
        }
      })
      client.end();
    })
  }
], function(error) {
  if (error) {
    console.log(error.test, error.error)
    process.exit(1)
  }
  process.exit(0)
})
