var pg = require("pg"),
    credentials = require("./credentials"),
    dbgeo = require("../lib/dbgeo");

var connString = "postgres://" + credentials.user + "@" + credentials.host + ":" + credentials.port + "/" + credentials.database,
    client = new pg.Client(connString);

// Connect to postgres
client.connect(function(error, success) {
  if (error) {
    console.log("Could not connect to postgres");
  }
});

/* Select two points, returning the geometry as a GeoJSON object in the field 'geometry' */
client.query("SELECT name, ST_AsGeoJSON(geom, 6) AS geometry FROM places LIMIT 2", function(error, result) {
  dbgeo.parse({
    "data": result.rows
  }, function(error, result) {
    if (error) {
      console.log("Test 1 --- error --- ", error);
    } else {
      console.log("Test 1 --- successful");
      //console.log(JSON.stringify(result));
    }
  });
});

/* Select two polygons, returning the geometry as a GeoJSON object in the field 'geom', then
   converting the result to TopoJSON */
client.query("SELECT name, ST_AsGeoJSON(geom, 6) AS geom FROM countries LIMIT 2", function(error, result) {
  dbgeo.parse({
    "data": result.rows,
    "geometryColumn": "geom",
    "outputFormat": "topojson"
  }, function(error, result) {
    if (error) {
      console.log("Test 2 --- error --- ", error);
    } else {
      console.log("Test 2 --- successful");
      //console.log(JSON.stringify(result));
    }
  });
});

/* Select two polygons, returning the geometry as WKT in the field 'wkt' */
client.query("SELECT name, ST_AsText(geom) AS wkt FROM countries LIMIT 2", function(error, result) {
  dbgeo.parse({
    "data": result.rows,
    "geometryColumn": "wkt",
    "geometryType": "wkt",
    "outputFormat": "geojson"
  }, function(error, result) {
    if (error) {
      console.log("Test 3 --- error --- ", error);
    } else {
      console.log("Test 3 --- successful");
     // console.log(JSON.stringify(result));
    }
  });
});

/* Select two points, returning a latitude and longitude for each */
client.query("SELECT name, latitude, longitude FROM places LIMIT 2", function(error, result) {
  dbgeo.parse({
    "data": result.rows,
    "geometryColumn": ["latitude", "longitude"],
    "geometryType": "ll"
  }, function(error, result) {
    if (error) {
      console.log("Test 4 --- error --- ", error);
    } else {
      console.log("Test 4 --- successful");
     // console.log(JSON.stringify(result));
    }
  });
  client.end();
});

