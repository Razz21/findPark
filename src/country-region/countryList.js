const data = require("./regions.json");

const getRegions = country => {
  return data.find(i => {
    return i.countryName.toLowerCase() === country.toLowerCase();
  });
};

const getContries = () => {
  return data.map(i => i.countryName);
};

// // save countries to separate file
// const fs= require('fs')
// const countries = getContries()
// const file = fs.createWriteStream('countries.json')
// file.on('error', function(err) { console.log(err) });
// file.write(JSON.stringify(countries))
// file.end()

export { getContries, getRegions };
