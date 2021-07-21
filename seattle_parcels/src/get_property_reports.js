import fs from "fs";
import axios from "axios";
import { loadData, storeData, sleep } from "./utils.js";

const inputFilename = "./data/nadmiral_parcel_info.geojson";
const outDir = "./data/parcels";

const propReportUrl =
  "https://blue.kingcounty.com/Assessor/eRealProperty/Dashboard.aspx?ParcelNbr=";

async function saveProperty(pin, filename) {
  const url = `${propReportUrl}${pin}`;
}

async function main() {
  const input = loadData(inputFilename);
  for (let i = 0; i < 1; i++) {
    const feature = input.features[i];
    const pin = feature.properties["PIN"];
    const outFilename = `${outDir}/${pin}.json`;

    if (fs.existsSync(outFilename)) {
      console.log("have ", pin);
    } else {
      await saveProperty(pin, outFilename);
    }
  }
}

main();
