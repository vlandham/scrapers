import fs from "fs";
import axios from "axios";
import jsdom from "jsdom";
import { loadData, camelize, storeData } from "./utils.js";

const inputFilename = "./data/nadmiral_parcel_all.geojson";
const outputDir = "./data/parcel_images";

const { JSDOM } = jsdom;

async function saveImage(url, filename) {
  const response = await axios.get(url, { responseType: "stream" });
  const w = response.data.pipe(fs.createWriteStream(filename));
  w.on("finish", () => {
    console.log("Successfully downloaded file!");
  });
  // if (response && response.data) {
  //   if (response.data.includes("Due to the large number of clients ")) {
  //     console.log("ERROR: Quota met");
  //     return false;
  //   } else {
  //     const w = response.data.pipe(fs.createWriteStream(filename));
  //     w.on("finish", () => {
  //       console.log("Successfully downloaded file!");
  //     });
  //     // fs.writeFileSync(filename, response.data);
  //     return true;
  //   }
  // }
  // return false;
  return true;
}

function getImageUrl(htmlFilename) {
  const page = fs.readFileSync(htmlFilename);
  const dom = new JSDOM(page, {});
  const { document } = dom.window;
  const image = document.getElementById(
    "cphContent_FormViewPictCurr_CurrentImage"
  );
  let url = null;
  if (image) {
    url = `https://blue.kingcounty.com/Assessor/eRealProperty/${image.src}`;
  } else {
    console.log("no image found in ", htmlFilename);
  }
  console.log(url);
  return url;
}

async function main(inputFilename, outputDir) {
  const input = loadData(inputFilename);
  const featureLen = input.features.length;
  for (let i = 0; i < 500; i++) {
    const feature = input.features[i];
    const pin = feature.properties["PIN"];
    const inputFilename = `data/parcels/${pin}.html`;
    const outFilename = `${outputDir}/${pin}.jpg`;
    if (fs.existsSync(inputFilename)) {
      if (!fs.existsSync(outFilename)) {
        const url = getImageUrl(inputFilename);
        if (url) {
          const saved = await saveImage(url, outFilename);
          if (!saved) {
            console.log("quota reached");
            break;
          }
        }
      } else {
        // console.log("Skipping:", pin);
      }
    } else {
      console.log("NO HTML for:", pin);
    }
  }
}

main(inputFilename, outputDir);
