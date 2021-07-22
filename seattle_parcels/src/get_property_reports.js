import fs from "fs";
import axios from "axios";
import jsdom from "jsdom";
import { loadData, camelize, storeData } from "./utils.js";
const { JSDOM } = jsdom;

const inputFilename = "./data/nadmiral_parcel_info.geojson";
const outputFilename = "./data/nadmiral_parcel_all.geojson";
const outDir = "./data/parcels";

const propReportUrl =
  "https://blue.kingcounty.com/Assessor/eRealProperty/Dashboard.aspx?ParcelNbr=";

async function saveProperty(pin, filename) {
  const url = `${propReportUrl}${pin}`;
  const response = await axios.get(url);
  if (response && response.data) {
    if (response.data.includes("Due to the large number of clients ")) {
      console.log("ERROR: Quota met");
      return false;
    } else {
      fs.writeFileSync(filename, response.data);
      return true;
    }
  }
  return false;
}

function tableToKeyValue(tableSelector, document) {
  const table = document.querySelector(tableSelector);
  const data = {};
  if (table) {
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const key = camelize(row.children[0].textContent.trim());
      const value = row.children[1].textContent.trim();
      data[key] = value;
    });
  } else {
    console.log("\t NO TABLE FOUND", tableSelector);
  }
  return data;
}

function extractData(filename) {
  const data = fs.readFileSync(filename);
  const dom = new JSDOM(data, {});
  const { document } = dom.window;

  const parcelInfo = tableToKeyValue(
    "#cphContent_DetailsViewDashboardHeader",
    document
  );
  const buildingInfo = tableToKeyValue(
    "#cphContent_DetailsViewPropTypeR, #cphContent_DetailsViewPropTypeC, #cphContent_DetailsViewPropTypeK",
    document
  );
  const out = {
    ...parcelInfo,
    ...buildingInfo,
  };
  return out;
}

async function main() {
  const input = loadData(inputFilename);
  const featureLen = input.features.length;
  for (let i = 0; i < featureLen; i++) {
    const feature = input.features[i];
    const pin = feature.properties["PIN"];
    const outFilename = `${outDir}/${pin}.html`;

    if (fs.existsSync(outFilename)) {
      console.log("have ", pin);
    } else {
      console.log("get ", pin);
      const success = await saveProperty(pin, outFilename);
      if (!success) {
        break;
      }
    }
    const newData = extractData(outFilename);
    feature.properties = { ...feature.properties, ...newData };
  }

  storeData(input, outputFilename);
}

main();
