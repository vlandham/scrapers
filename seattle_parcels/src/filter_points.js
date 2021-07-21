import * as turf from "@turf/turf";
import { loadData, storeData } from "./utils.js";

function main() {
  const filterPolygon = loadData("./data/north_admiral.geojson");
  const points = loadData("./data/points.geojson");
  const filtered = turf.pointsWithinPolygon(points, filterPolygon);
  storeData(filtered, "./data/points_filtered.geojson");
}

main();
