import axios from "@/plugins/axios";
import NodeGeocoder from "node-geocoder";

export class Nominatim {
  constructor(kwargs = {}) {
    this.host = kwargs.host || "https://nominatim.openstreetmap.org/";
    this.format = kwargs.format || "geojson";
    this.limit = Number(kwargs.limit) || 3;
    this.language =
      kwargs.language ||
      window.navigator.userLanguage ||
      window.navigator.language ||
      "gb";
    this.addressdetails = Number(kwargs.addressdetails) || 1;
    this.params = [
      "street",
      "city",
      "county",
      "state",
      "country",
      "postalcode"
    ];
  }
  // valid api query params
  search(data) {
    if (data.constructor !== Object || Object.keys(data) == 0) {
      throw new Error("invalid arguments.");
    }
    const prefix = "search?";
    let query = "";
    let vals;
    if ("q" in data) {
      /*
      free-form query string
      */
      vals = { q: data["q"] };
    } else {
      /*
      structured query string (can not be combined with `q=<query>` parameter)
      */
      // filter object to valid params
      vals = Object.assign(
        {},
        ...this.params.map(key => data[key] && { [key]: data[key] })
      );
    }
    // encode query string
    query = new URLSearchParams(vals).toString();

    const config = `format=${this.format}&limit=${this.limit}&accept-language=${this.language}`;
    if (query) {
      return axios.get(this.host + prefix + config + "&" + query);
    } else {
      throw new Error("Invalid data for query: ", data);
    }
  }
  reverse(long, lat, { zoom = 18 } = {}) {
    if (!(Number(lat) && Number(long))) {
      throw new Error("Latitude and Longitude must be numbers!");
    }
    const prefix = "reverse?";
    const config = `format=${this.format}&zoom=${zoom}&accept-language=${this.language}`;
    const query = `lat=${lat}&lon=${long}`;
    return axios.get(this.host + prefix + config + "&" + query);
  }
}

export class Photon {
  constructor(kwargs = {}) {
    this.host = kwargs.host || "https://photon.komoot.de/api/?q=";
    this.limit = Number(kwargs.limit) || 5;
    this.language =
      kwargs.language ||
      window.navigator.userLanguage ||
      window.navigator.language ||
      "en";
  }

  search(data) {
    let query;
    if (data instanceof Array) {
      data = data.join();
    }
    if (data instanceof String || typeof data == "string") {
      query = encodeURI(data.split(/\s/g).join());

      const config = `&limit=${this.limit}&lang=${this.language}`;
      // hard coded country
      const country = "polska,";
      const url = this.host + country + query + config;
      return axios.get(url);
    }
    throw new Error("String or Array only allowed");
  }
}
export class RouteOSRM {
  constructor(kwargs = {}) {
    this.host = kwargs.host || "https://router.project-osrm.org/";
    this.version = "v1/";
    this.profile = (kwargs.profile || "driving") + "/"; //car, bike, foot, driving
  }
  search(coords, options = {}, service) {
    service = (service || "route") + "/"; //route, nearest, table, match, trip, tile
    let opts = "";
    if (Object.keys(options).length) {
      const queryopts = new URLSearchParams(options).toString();
      opts = "?" + queryopts;
    }
    coords = coords.join(";"); //{longitude},{latitude};
    const queryString = coords + opts;
    const url = this.host + service + this.version + this.profile + queryString;
    // console.log(url);
    return axios.get(url);
  }
  nearest(coords, options = {}) {
    const service = "nearest";
    return this.search([coords], options, service);
  }
  route(coords, options = {}) {
    const service = "route";
    return this.search(coords, options, service);
  }
}

export function geocodeCoords(coordinates) {
  const options = {
    provider: "openstreetmap",
    language: window.navigator.userLanguage || window.navigator.language || "gb"
  };
  const geocoder = NodeGeocoder(options);
  let display_name = "Point from map";
  return geocoder
    .reverse({ lat: coordinates[0], lon: coordinates[1] })
    .then(res => {
      let { city, neighbourhood, streetName, streetNumber, zipcode } = res[0];
      if (!!neighbourhood || !!streetName) {
        display_name =
          (streetName || neighbourhood) +
          " " +
          (streetNumber || "") +
          ", " +
          (zipcode || "") +
          " " +
          (city || "");
      }
      return { display_name, coordinates };
    })
    .catch(err => {
      return { display_name, coordinates };
    });
}
