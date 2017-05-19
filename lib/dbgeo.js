(function() {
  var topojson = require('topojson')
  var wkx = require('wkx')
  var gp = require('geojson-precision')

  var dbgeo = {}

  dbgeo.defaults = {
    outputFormat: 'geojson',
    geometryColumn: 'geom',
    geometryType: 'wkb',
    precision: null,
    quantization: null
  }

  dbgeo.parse = function(data, params, callback) {
    // Validate and parse inputs
    if (!data) {
      return callback('You must provide a value for "data"')
    }

    if (!callback) {
      throw new Error('You must provide a callback function')
    }

    params = params || {}

    params.geometryColumn = (params && params.geometryColumn) ?  params.geometryColumn : this.defaults.geometryColumn
    params.geometryType = (params && params.geometryType) ? params.geometryType : this.defaults.geometryType
    params.outputFormat = (params && params.outputFormat) ? params.outputFormat : this.defaults.outputFormat
    params.precision = (params && params.precision) ? params.precision : this.defaults.precision
    params.quantization = (params && params.quantization) ? params.quantization : this.defaults.quantization

    if (['geojson', 'topojson'].indexOf(params.outputFormat) < 0) {
      return callback('Invalid outputFormat value. Please use either "geojson" or "topojson"')
    }

    if (['wkt', 'geojson', 'll', 'wkb'].indexOf(params.geometryType) < 0) {
      return callback('Invalid geometry type. Please use "wkt", "wkb", "geojson", or "ll"')
    }

    if (params.geometryType === 'll' && (!Array.isArray(params.geometryColumn) || params.geometryColumn.length !== 2)) {
      return callback('When the input data type is lng/lat, please specify the "geometryColumn" as an array with two parameters, the longitude followed by the latitude')
    }

    // Convert to GeoJSON
    var output = {
      type: 'FeatureCollection',
      features: data.map(function(row) {
        return {
          type: 'Feature',
          geometry: function (type, geom) {
            if (!geom) {
              return null
            }
            switch(type) {
              case 'wkb':
                return wkx.Geometry.parse(new Buffer(geom, 'hex')).toGeoJSON()
              case 'geojson':
                return JSON.parse(geom)
              case 'wkt':
                return wkx.Geometry.parse(geom).toGeoJSON()
              case 'll':
                return new wkx.Point(geom[0], geom[1]).toGeoJSON()
              default:
                return null
            }
          }(params.geometryType, (params.geometryType === 'll' ? [ row[params.geometryColumn[0]], row[params.geometryColumn[1]] ] : row[params.geometryColumn])),
          properties: function (geomColumn, props) {
            var properties = {}

            Object.keys(props).filter(function(d) {
              if (d !== geomColumn && geomColumn.indexOf(d) === -1) return d
            }).forEach(function(d) {
              properties[d] = props[d]
            })

            return properties
          }(params.geometryColumn, row)
        }
      })
    }

    // Trim coordinate precision, if specified
    if (params.precision) {
      output = gp(output, params.precision)
    }

    // Convert to topojson, if needed
    if (params.outputFormat === 'topojson') {
      callback(null,
        topojson.topology({
          output: output
        }, {
          'property-transform': function(feature) {
            return feature.properties
          },
          quantization: params.quantization
        })
      )
    } else {
      callback(null, output)
    }
  }

  module.exports = dbgeo
}())
