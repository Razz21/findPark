export const TagsFilter = {
  methods: {
    processTagsFilter(location, tags) {
      if (tags.length > 0) {
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
  }
};
