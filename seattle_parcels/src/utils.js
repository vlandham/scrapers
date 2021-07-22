import fs from "fs";

export const loadData = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
};

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}
