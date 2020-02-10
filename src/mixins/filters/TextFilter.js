export const TextFilter = {
  methods: {
    processTextFilter(location, text) {
      if (text.length > 0) {
        /* 
        search in name, location name, address, city 
        todo <name>
        */
        const query = "[^,]*" + text.toLowerCase() + "[,$]*";
        if (
          location.name.toLowerCase().match(query) ||
          location.address.toLowerCase().match(query) ||
          location.city.toLowerCase().match(query)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }
};
