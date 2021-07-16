// import "cross-fetch/polyfill";
// import "isomorphic-form-data";
const fs = require("fs");
require("cross-fetch/polyfill");
require("isomorphic-form-data");
const { request } = require("@esri/arcgis-rest-request");
// import { request } from "@esri/arcgis-rest-request";

const loadData = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (err) {
    console.error(err);
    return false;
  }
};

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
const restUrl =
  "https://gismaps.kingcounty.gov/ArcGIS/rest/services/Address/KingCo_AddressPoints/MapServer/0/query";

const options = {
  f: "json",
  returnGeometry: true,
  spatialRel: "esriSpatialRelIntersects",
  //   geometry: {
  //     xmin: -13618632.454633132,
  //     ymin: 6050583.175736373,
  //     xmax: -13618326.706519948,
  //     ymax: 6050888.923849557,
  //     spatialReference: { wkid: 102100 },
  //   },
  // geometry: {
  //   xmin: -13628311.543,
  //   ymin: 6035902.665,
  //   xmax: -13622009.134,
  //   ymax: 6040805.946,
  //   spatialReference: { wkid: 102100 },
  // },
  geometryType: "esriGeometryEnvelope",
  inSR: 4326,
  outFields: ["ADDR_FULL", "OBJECTID", "LAT", "LON"],
  outSR: 4326,
};

// const cords = [
//   [
//     [-13628192.293318363, 6036018.515816203],
//     [-13628192.293318363, 6036537.58019038],
//     [-13627326.020513117, 6036537.58019038],
//     [-13627326.020513117, 6036018.515816203],
//     [-13628192.293318363, 6036018.515816203],
//   ],
// ];

function getGeoms() {
  grid = loadData("data/grid.json");
  console.log(grid.features.length);
  const geoms = grid.features.map((feature) => {
    const lastPos = feature.geometry.coordinates[0].length - 1;
    const xValues = feature.geometry.coordinates[0].map((c) => c[0]);
    const yValues = feature.geometry.coordinates[0].map((c) => c[1]);
    const xmin = Math.min(...xValues);
    const xmax = Math.max(...xValues);
    const ymin = Math.min(...yValues);
    const ymax = Math.max(...yValues);
    // const geom = {
    //   xmin: feature.geometry.coordinates[0][0][0],
    //   ymin: feature.geometry.coordinates[0][0][1],
    //   xmax: feature.geometry.coordinates[0][lastPos][0],
    //   ymax: feature.geometry.coordinates[0][lastPos][1],
    //   spatialReference: { wkid: 4326 },
    // };
    const geom = {
      xmin: xmin,
      ymin: ymin,
      xmax: xmax,
      ymax: ymax,
      spatialReference: { wkid: 4326 },
    };

    return geom;
  });
  return geoms;
}

async function main() {
  geoms = getGeoms();
  console.log(geoms.length);
  const allFeatures = {};
  for (let i = 0; i < geoms.length; i++) {
    const geom = geoms[i];
    console.log("geom", geom);
    const newOptions = { ...options, geometry: geom };
    await request(restUrl, { params: newOptions }).then((response) => {
      console.log("found features", response.features.length);
      response.features.forEach((feature) => {
        const featureId = feature.attributes["OBJECTID"];
        if (!allFeatures[featureId]) {
          allFeatures[featureId] = feature;
        }
      });
    });
    await sleep(1000);
  }
  storeData(Object.values(allFeatures), "data/point_info.json");
}

main();
