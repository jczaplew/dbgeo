# Changelog

## 1.0.0
+ Coordinate pairs are now specified as `longitude, latitude` instead of `latitude, longitude`
+ `.parse(...)` now has three parameters instead of two - `data`, `options`, and `callback`. `data` is identical to `params.data`, just in a different place, and `options` is now optional
+ New default options:


  | option          | old           | new     |
  | --------------- |:-------------:| -------|
  | geometryType    | geojson       | wkb     |
  | geometryColumn  | geometry      | geom    |
  | outputFormat    | geojson       | geojson |


+ Integratation of [geojson-precision](https://github.com/jczaplew/geojson-precision). Can be used by specifying a `precision` in `options`

+ Readablilty, style, and performance enhancements
