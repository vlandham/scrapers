import fs from "fs";

import * as turf from "@turf/turf";

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
};

// const extent = [-13628311.543, 6035902.665, -13622009.134, 6040805.946];

const wExtent = [-122.418003, 47.57175, -122.36859, 47.601322];

const cellSide = 0.5;
const options = { units: "miles" };
const grid = turf.squareGrid(wExtent, cellSide, options);

console.log(grid.features.length);

storeData(grid, "./data/grid.json");
