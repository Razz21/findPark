<template>
  <div class="d-flex flex-column map-panel">
    <!-- ======================== panel ========================= -->
    <div tile class="map-panel__toolbar">
      <div class="py-3" style="width:100%">
        <v-autocomplete
          :disabled="loadingPlacesStatus === 1"
          v-model="userLocation"
          auto-select-first
          :items="items"
          :loading="isLoading"
          loader-height="4"
          :search-input.sync="search"
          hide-no-data
          item-text="display_name"
          label="Type in here..."
          return-object
          no-filter
          single-line
          hide-details
          hide-selected
          prepend-inner-icon="mdi-magnify"
          @click:clear="clearTextField"
          @keyup="searchEvent"
          color="accent"
          dark
          :menu-props="{ dark: true }"
        >
          <template v-slot:progress>
            <v-progress-circular
              indeterminate
              color="accent"
            ></v-progress-circular>
          </template>

          <template v-slot:item="{ item, parent }">
            <v-list-item-content class="">
              <v-list-item-title
                class="text-wrap"
                v-html="item.display_name"
              ></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </div>
    </div>

    <!-- ======================== panel ========================= -->
  </div>
</template>

<script>
import { dynamicSortMultiple } from "@/utils";
import { Photon, geocodeCoords } from "@/api/nominatim";
import { EventBus } from "@/bus";

import { TagsFilter } from "@/mixins/filters/TagsFilter";
import { TextFilter } from "@/mixins/filters/TextFilter";
import { HoursFilter } from "@/mixins/filters/HoursFilter";
import u from "@/api/map_utils";
export default {
  mixins: [TextFilter, TagsFilter, HoursFilter],
  data() {
    return {
      isLoading: false,
      timer: null,
      console: console
    };
  },
  computed: {
    search: {
      set(val) {
        this.$store.commit("filters/setSearch", val);
      },
      get() {
        return this.$store.getters["filters/getSearch"];
      }
    },
    userLocation: {
      set(val) {
        this.$store.commit("filters/setCenter", val);
      },
      get() {
        return this.$store.getters["filters/getCenter"];
      }
    },
    items: {
      set(val) {
        this.$store.commit("filters/setItems", val);
      },
      get() {
        return this.$store.getters["filters/getItems"];
      }
    },
    geolocPosition() {
      return this.$store.getters["map/getGeolocation"];
    },
    loadingPlacesStatus() {
      return this.$store.getters["map/getPlacesLoadstatus"];
    }
  },
  methods: {
    sortResults() {
      if (this.searchResult) {
        this.searchResult.sort(dynamicSortMultiple(this.sortBy));
        this.$nextTick(() => {
          var content = document.querySelector(".map-results .content");
          if (content) {
            content.scrollTop = 0;
            content.scrollLeft = 0;
          }
        });
      }
    },
    toggleGeolocation() {
      // geolocation enabled and location found
      if (this.geolocPosition) {
        geocodeCoords(this.geolocPosition).then(res => {
          this.userLocation = res;
          this.items = [res];
        });
      }
      // trigger geolocation request
      else {
        this.$emit("toggleGeoloc");
      }
    },
    autocompleteSearch(val) {
      this.isLoading = true;
      const photon = new Photon({ language: "en" });
      photon
        .search(val)
        .then(res => {
          this.items = res.data.features.map(entry => {
            let {
              city,
              housenumber,
              name,
              postcode,
              street
            } = entry.properties;
            housenumber = housenumber ? ` ${housenumber}` : "";
            postcode = postcode ? `${postcode}, ` : "";
            city = city ? city : "";
            street = street ? street : name ? name : this.search;
            const display_name = street + housenumber + ", " + postcode + city;

            const coordinates = u.toLatLng(entry.geometry.coordinates);
            return { display_name, coordinates };
          });
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
        });
    },
    clearTextField() {
      this.search = null;
      this.userLocation = undefined;
      this.items = [];
    },
    searchEvent(evt) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      const val = evt.target.value;
      // Items have already been loaded
      // if (this.items.length > 0) return;
      if (!val || val.length < 3) return;
      // Items have already been requested
      if (this.isLoading) return;
      this.timer = setTimeout(() => {
        this.autocompleteSearch(val);
      }, 1000);
    },
    toggleSearch() {
      this.$store.dispatch("map/loadPlaces");
    }
  },
  watch: {
    loadingPlacesStatus(val) {
      EventBus.$emit("loadingSidebar", val === 1, "loading");
    },
    geolocPosition(val) {
      geocodeCoords(val).then(res => {
        this.userLocation = res;
        this.items = [res];
      });
      return val;
    },
    userLocation: "toggleSearch"
  }
};
</script>

<style lang="scss">
.map-panel {
  z-index: 1;
  max-width: 100%;
  position: relative;
  // overflow: hidden;

  &__toolbar {
    width: 100%;
    transition: all 0.5s;
    padding: 6px;
    align-items: center;
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
.v-autocomplete__content .v-list {
  background-color: $primary !important;
}
</style>
