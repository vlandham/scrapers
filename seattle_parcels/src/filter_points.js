import * as turf from "@turf/turf";
import parseArgs from "minimist";
import { loadData, storeData } from "./utils.js";

const argv = parseArgs(process.argv.slice(2));

const inputFilename = argv.input ? argv.input : "./data/points.geojson";
const maskFilename = argv.mask ? argv.mask : "./data/nadmiral_2.geojson";
const outputFilename = argv.output
  ? argv.output
  : "./data/points_filtered.geojson";

function polygonsWithinPolygon(polygons, maskFeatures) {
  const maskPolygon = maskFeatures.features[0];
  const filteredFeatures = polygons.features.filter((feature) => {
    const multi = feature.geometry.type === "MultiPolygon";
    if (multi) {
      const bbox = turf.envelope(turf.featureCollection([feature]));
      return turf.booleanContains(maskPolygon, bbox);
    } else {
      return turf.booleanContains(maskPolygon, feature);
    }
  });

  return turf.featureCollection(filteredFeatures);
}

function main(inputFilename, maskFilename, outputFilename) {
  console.log(
    "in:",
    inputFilename,
    "mask:",
    maskFilename,
    "out:",
    outputFilename
  );
  const filterPolygon = loadData(maskFilename);
  const points = loadData(inputFilename);
  const allPoints = points.features.every((f) => f.geometry.type === "Point");
  const filtered = allPoints
    ? turf.pointsWithinPolygon(points, filterPolygon)
    : polygonsWithinPolygon(points, filterPolygon);
  storeData(filtered, outputFilename);
}

main(inputFilename, maskFilename, outputFilename);
