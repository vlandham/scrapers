# Parcel Scrape

## Useful Links

- https://turfjs.org/docs/#pointGrid
- https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-support-webMercatorUtils.html
- https://developers.arcgis.com/javascript/latest/sample-code/widgets-coordinateconversion/
- https://support.esri.com/en/technical-article/000013950
- https://gis.stackexchange.com/questions/54534/how-can-i-convert-esrimeters-to-lat-lng

example info query:

```
https://gismaps.kingcounty.gov/ArcGIS/rest/services/Address/KingCo_AddressPoints/MapServer/0/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-13618632.454633132%2C%22ymin%22%3A6050583.175736373%2C%22xmax%22%3A-13618326.706519948%2C%22ymax%22%3A6050888.923849557%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryEnvelope&inSR=102100&outFields=ADDR_FULL%2COBJECTID&outSR=4326
```
