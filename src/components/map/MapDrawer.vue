<template>
  <v-navigation-drawer
    width="400"
    id="drawer"
    class="drawer"
    permanent
    hide-overlay
  >
    <div class="primary">
      <div class="pb-8 pt-4">
        <div class="py-5 px-2">
          <v-btn x-large text color="accent" exact :to="{ name: 'home' }">
            <v-icon>mdi-chevron-left</v-icon>
            back to home page</v-btn
          >
        </div>
        <div class="py-4 px-8">
          <h1 class="display-1">
            Find
            <span>
              spots
            </span>
          </h1>
        </div>
      </div>

      <v-divider></v-divider>

      <div class="pa-8">
        <h3 class="mb-5">
          Start
          <span>
            Searching
          </span>
        </h3>
        <div class="description">
          <h4>Search by address</h4>
          <p>Type your current address or area you want to find spots</p>
        </div>
        <MapPanel />
      </div>

      <v-divider></v-divider>

      <div class="pa-8 d-flex align-center">
        <h3
          class="pa-3 white--text cursor-pointer"
          @click="showFilters = !showFilters"
        >
          Sets your
          <span>
            Filters
            <v-icon dark="">mdi-chevron-down</v-icon>
          </span>
        </h3>
      </div>

      <div v-expand="showFilters">
        <div class="pa-8">
          <PanelFilters />
          <h3
            class="pa-3 white--text cursor-pointer"
            @click="showFilters = false"
          >
            Close
            <span>
              Filters
              <v-icon dark="">mdi-chevron-up</v-icon>
            </span>
          </h3>
        </div>
      </div>
    </div>
    <div class="tertiary d-flex flex-column flex-grow-1 pa-8">
      <h3 class="mb-1">Filtered <span>Results</span></h3>
      <p class="grey--text text--lighten-2">
        Found {{ resultsCount }} spot(s) matching your conditions.
      </p>
    </div>
  </v-navigation-drawer>
</template>

<script>
import MapPanel from "./MapPanel";
import PanelFilters from "@/components/map/PanelFilters";
export default {
  components: { MapPanel, PanelFilters },
  data() {
    return { showFilters: false };
  },
  computed: {
    resultsCount() {
      return this.$store.getters["map/getPlaces"].length;
    },
    radius() {
      return this.$store.getters["filters/getRadius"];
    },
    userLocation() {
      return this.$store.getters["filters/getCenter"];
    }
  },
  methods: {}
};
</script>

<style lang="scss">
#drawer {
  position: relative;
  min-width: 400px !important;
  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
}
</style>
