<template>
  <div class="font-weight-light small-scroll panel-filters ">
    <div class="filter">
      <div class="description">
        <h4>Filter by Distance (km)</h4>
        <p>Select distance from selected location to find spots</p>
      </div>
      <v-slider
        key="distance"
        v-model="rangeFilter"
        :tick-labels="distances"
        :max="3"
        step="1"
        ticks="always"
        color="accent"
      >
      </v-slider>
    </div>
    <v-divider></v-divider>
    <div class="filter">
      <div class="description">
        <h4>Filter by Tags</h4>
        <p>Specify features for space you need</p>
      </div>
      <v-chip-group
        v-model="tagsFilter"
        multiple
        column
        active-class="active-chip"
        class="d-flex"
      >
        <v-chip
          class="align-content-space-between tag-chip"
          v-for="tag in tags"
          :key="tag"
          label
          :value="tag"
        >
          <v-avatar left>
            <v-icon right>{{ getTagIcon(tag) }}</v-icon>
          </v-avatar>
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </div>
    <v-divider></v-divider>
    <div class="filter">
      <div class="description">
        <h4>Filter by working hours</h4>
        <p>Specify hours you need</p>
      </div>
      <v-checkbox
        dark
        color="accent"
        v-model="hoursFilter"
        class="mt-0"
        label="Currently open"
      ></v-checkbox>
    </div>
  </div>
</template>

<script>
import { getTagIcon } from "@/utils";
export default {
  data() {
    return {
      getTagIcon: getTagIcon
    };
  },
  computed: {
    tags() {
      return this.$store.getters["map/getTags"];
    },
    distances() {
      return this.$store.getters["filters/getDistances"];
    },
    tagsFilter: {
      set(filter) {
        this.$store.commit("filters/setTags", filter);
      },
      get() {
        return this.$store.getters["filters/getTags"];
      }
    },
    rangeFilter: {
      set(val) {
        this.$store.commit("filters/setRange", val);
      },
      get() {
        return this.$store.getters["filters/getRange"];
      }
    },
    hoursFilter: {
      set(val) {
        this.$store.commit("filters/setHours", val);
      },
      get() {
        return this.$store.getters["filters/getHours"];
      }
    }
  },
  methods: {
    filterResults() {
      this.$store.dispatch("filters/filterPlaces");
    }
  },
  watch: {
    tagsFilter: "filterResults",
    rangeFilter: "filterResults",
    hoursFilter: "filterResults"
  }
};
</script>

<style lang="scss">
.tag-chip {
  margin: 3px !important;
  flex: 1 0 calc(50% - 6px);
}
.active-chip {
  color: $white-color !important;
  background-color: $accent !important;
}
.panel-filters {
  padding-bottom: 1rem;
  .v-slider__tick-label {
    color: $white-color;
  }
  .filter {
    margin: 1.5rem 0;
  }
  .description {
    opacity: 0.4;
    margin-bottom: 1rem;
    > h3 {
      text-transform: uppercase;
      font-weight: 600;
    }
  }
}
</style>
