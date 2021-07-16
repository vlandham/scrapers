// ensures fetch is available as a global
// require("cross-fetch/polyfill");
// require("isomorphic-form-data");

// const axios = require('axios')

// const { request } = require('@esri/arcgis-rest-request');
// const webMercatorUtils = require("@arcgis/core/geometry/support/webMercatorUtils")
// const webMercatorUtils = require("arcgis-js-api/geometry/support/webMercatorUtils")
// import webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils"
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";
import * as projection from "@arcgis/core/geometry/projection.js";
import Geometry from "@arcgis/core/geometry/Geometry.js";
import * as turf from "@turf/turf";

const pvInfoUrl =
  "https://gismaps.kingcounty.gov/parcelviewer2/pvinfoquery.ashx?pin=4083802785";

const restUrl =
  "https://gismaps.kingcounty.gov/ArcGIS/rest/services/Address/KingCo_AddressPoints/MapServer/0";

// request(restUrl)
//     .then(response => {
//         console.log(response) // WebMap JSON
//     });
// const point = {"xmin":-13618632.454633132,"ymin":6050583.175736373,"xmax":-13618326.706519948,"ymax":6050888.923849557,"spatialReference":{"wkid":102100}}
const point = {
  xmin: -13618632.454633132,
  ymin: 6050583.175736373,
  xmax: -13618326.706519948,
  ymax: 6050888.923849557,
  spatialReference: { wkid: 102100 },
};
console.log(Geometry.fromJSON(point).spatialReference);

// console.log(webMercatorUtils)
console.log(webMercatorUtils.geographicToWebMercator(point));

const bbox = { xmin: -13628311.543, ymin: 6040805.946 };

const extent = [-13628311.543, 6035902.665, -13622009.134, 6040805.946];
const wExtent = [-122.418003, 47.57175, -122.36859, 47.601322];

const cellSide = 1000;
const options = { units: "miles" };
const grid = turf.squareGrid(extent, cellSide, options);
console.log(grid.features.length);
console.log(grid.features[0].geometry.coordinates);
