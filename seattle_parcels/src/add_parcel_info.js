import axios from "axios";
import { loadData, storeData, sleep } from "./utils.js";

const filename = "./data/points_filtered.geojson";

const infoUrl =
  "https://gismaps.kingcounty.gov/parcelviewer2/pvinfoquery.ashx?pin=";

async function getInfo(pin) {
  const url = `${infoUrl}${pin}`;
  const response = await axios.get(url);
  // console.log(response);
  const data = response.data;
  if (!data || !data.items || data.items.length === 0) {
    return {};
  }

  return data.items[0];
}

async function main() {
  const points = loadData(filename);
  console.log(points.features.length);

  for (let i = 0; i < points.features.length; i++) {
    const point = points.features[i];
    // console.log(point.properties["PIN"]);
    const info = await getInfo(point.properties["PIN"]);
    // console.log(info);
    point.properties = { ...point.properties, ...info };

    await sleep(100);
  }
  storeData(points, "./data/nadmiral_parcel_info.geojson");
}

main();
