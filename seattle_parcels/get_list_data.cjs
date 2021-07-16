// ensures fetch is available as a global
require("cross-fetch/polyfill");
require("isomorphic-form-data");
const { request } = require("@esri/arcgis-rest-request");

const restUrl =
  "https://gismaps.kingcounty.gov/ArcGIS/rest/services/Address/KingCo_AddressPoints/MapServer/0";

request(restUrl).then((response) => {
  console.log(response); // WebMap JSON
});
