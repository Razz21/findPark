import moment from "moment";

export function groupBy(arr, property) {
  // group array by property
  return arr.reduce((memo, x) => {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

export function getTagIcon(tag) {
  switch (tag) {
    case "covered":
      return "mdi-umbrella-outline";
    case "camera":
      return "mdi-cctv";
    case "lit":
      return "mdi-lightbulb-on-outline";
    case "charging":
      return "mdi-power-plug";
    case "gated":
      return "mdi-lock-outline";
    case "guarded":
      return "mdi-shield-lock-outline";
    default:
      return "";
  }
}

export function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function random(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function range(start, end) {
  return new Array(end - start).fill().map((d, i) => i + start);
}

export function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export function dynamicSortMultiple() {
  /*
   * save the arguments object as it will be overwritten
   * note that arguments object is an array-like object
   * consisting of the names of the properties to sort by
   */
  var props = arguments;
  return function(obj1, obj2) {
    var i = 0,
      result = 0,
      numberOfProperties = props.length;
    /* try getting a different result from 0 (equal)
     * as long as we have extra properties to compare
     */
    while (result === 0 && i < numberOfProperties) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  };
}

export function processTagsFilter(location, tags) {
  if (tags.length > 0) {
    // const found = arr1.some(r=> arr2.includes(r))

    const queryTags = [];
    for (let i = 0; i < location.tags.length; i++) {
      queryTags.push(location.tags[i].toLowerCase());
    }
    for (let i = 0; i < tags.length; i++) {
      if (queryTags.includes(tags[i].toLowerCase())) {
        return true;
      }
    }
    return false;
  } else {
    return true;
  }
}
export function processTextFilter(location, text) {
  if (text.length > 0) {
    /* 
    search in name, location name, address, city 
    todo <name>
    */
    const query = "[^,]*" + text.toLowerCase() + "[,$]*";
    if (
      location.address.street.toLowerCase().match(query) ||
      location.address.city.toLowerCase().match(query) ||
      location.address.zip.toLowerCase().match(query)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

export function processHoursFilter(location, filter) {
  if (filter) {
    if (location.hours && location.hours.length) {
      const day = new Date().getDay();
      const item = location.hours[day];

      if (item.fullTime) {
        return true;
      } else {
        const current = moment(moment().format("HH:mm"), "HH:mm");
        const close = moment(item.close, "HH:mm");
        return close.diff(current, "minutes") > 0;
      }
    }
    return false;
  } else {
    return true;
  }
}
