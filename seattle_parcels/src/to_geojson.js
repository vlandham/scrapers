import { loadData, storeData } from "./utils.js";

function main() {
  const points = loadData("../data/point_info.json");
  console.log(points);
  const geojson = { type: "FeatureCollection", features: [] };
  geojson.features = points.map((point) => {
    return {
      type: "Feature",
      properties: point.attributes,
      geometry: {
        type: "Point",
        coordinates: [point.geometry.x, point.geometry.y],
      },
    };
  });
  storeData(geojson, "../data/points.geojson");
}

main();
