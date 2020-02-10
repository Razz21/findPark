<template>
  <div class="map" style="display:flex; min-height:300px">
    <l-map
      ref="map"
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      :min-zoom="min_zoom"
      :options="{ zoomControl: true }"
      @click="onMapClick"
    >
      <l-feature-group>
        <l-popup ref="popup" class="d-flex align-center">
          <v-btn @click="selectLocation" x-small outlined>Select</v-btn>
        </l-popup>
      </l-feature-group>

      <l-tile-layer
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      ></l-tile-layer>

      <l-feature-group ref="features">
        <l-circle-marker
          v-for="(feature, idx) in filteredFeatures"
          :key="idx"
          :lat-lng="u.toLatLng(feature.geometry.coordinates)"
        >
          <l-popup :options="{ maxWidth: 150 }">
            <div class="caption">{{ feature.properties.display_name }}</div>
            <v-btn x-small outlined @click="useCustomLocation(feature)"
              >Select</v-btn
            >
          </l-popup>
        </l-circle-marker>
      </l-feature-group>

      <l-feature-group ref="currentLayer">
        <l-popup>
          <v-btn x-small outlined @click="removeCurrent">remove</v-btn>
          <div>Your current location</div>
        </l-popup>
      </l-feature-group>
    </l-map>
  </div>
</template>

<script>
// todo display locations named in list
import {
  LMap,
  LTileLayer,
  LMarker,
  LFeatureGroup,
  LPopup,
  LControl,
  LControlScale,
  LCircleMarker,
  LIcon
} from "vue2-leaflet";
import { marker, divIcon } from "leaflet";

import ContextMenu from "@/components/map/ContextMenu";
import { MapMixin } from "@/mixins/Leaflet";
import u from "@/api/map_utils";

export default {
  mixins: [MapMixin],
  components: {
    ContextMenu,
    LMap,
    LTileLayer,
    LFeatureGroup,
    LPopup,
    LControl,
    LControlScale,
    LMarker,
    LCircleMarker,
    LIcon
  },
  props: {
    geodata: {
      type: Array
    },
    foundLocations: {
      type: Array
    }
  },
  data() {
    const icon = divIcon({
      className: "custom-marker",
      html:
        "<div class='marker-pin'></div><i class='v-icon notranslate mdi mdi-parking'></i>",
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
    return {
      filteredFeatures: [],
      currentlocation: [],
      icon: icon,
      u: u
    };
  },

  computed: {
    placeMarker() {
      return require("@/assets/markers/place-marker.png");
    },
    defaultMarker() {
      return require("@/assets/markers/choice-marker.png");
    },
    choiceMarker() {
      return require("@/assets/markers/default-marker.png");
    }
  },

  methods: {
    selectLocation(e) {
      const c = this.$refs.popup.mapObject._latlng;
      const geo = [c.lat, c.lng];
      this.setCurrentLocation(geo);
      // this.$emit("update:geodata", geo);
    },
    useCustomLocation(feature) {
      const geo = feature.geometry.coordinates.slice().reverse();
      this.setCurrentLocation(geo);
    },
    setCurrentLocation(data) {
      // coordinates of edited item are firebase GeoPoint
      // coordinates in Openlayers/Leaflet are arrays
      const lat = parseFloat(data._lat) || parseFloat(data[0]);
      const long = parseFloat(data._long) || parseFloat(data[1]);
      if (lat && long && this.$refs.currentLayer) {
        const currentLayer = this.$refs.currentLayer.mapObject;
        currentLayer.clearLayers();
        this.center = [lat, long];

        const pointer = marker([lat, long], {
          icon: this.icon,
          zIndexOffset: 1000
        }).addTo(currentLayer);
        this.$refs.map.mapObject.closePopup();
        this.$emit("update:geodata", [lat, lng]);
      }
    },
    removeCurrent() {
      const currentLayer = this.$refs.currentLayer.mapObject;
      currentLayer.clearLayers();
      this.$emit("update:geodata", []);
      this.$refs.map.mapObject.closePopup();
    },

    filterFound(data) {
      if (!data || !data.length) return;
      this.filteredFeatures = data;
      this.$nextTick(() => {
        const extent = this.$refs.features.mapObject.getBounds();
        console.log("filterFound", extent);
        if (extent && extent.length) {
          this.$refs.map.fitBounds(extent, {
            maxZoom: 17,
            padding: [50, 50]
          });
        }
      });
    },
    onMapClick(e) {
      this.$refs.popup.mapObject
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .openOn(e.target);
    }
  },
  mounted() {
    if (!this.foundLocations.length) {
      this.getLookupLocation();
    }
  },

  watch: {
    foundLocations(val) {
      return val;
    },
    geodata: {
      deep: true,
      handler: "setCurrentLocation"
    },
    foundLocations: {
      handler: "filterFound"
    }
  }
};
</script>

<style lang="scss">
.custom-marker {
  transition: 1.5s;
  & i {
    position: absolute;
    width: 22px;
    font-size: 22px;
    left: 0;
    right: 0;
    margin: 10px auto;
    text-align: center;
  }
  & i.mdi {
    margin: 12px auto;
    font-size: 17px;
  }

  & .marker-pin {
    -webkit-transition: 1.5s;
    transition: 1.5s;
    -moz-transition: 1.5s;
    -ms-transition: 1.5s;
    -o-transition: 1.5s;
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    background: #3498db;
    position: absolute;
    transform: rotate(-45deg);
    left: 50%;
    top: 50%;
    margin: -15px 0 0 -15px;

    &::after {
      content: "";
      width: 24px;
      height: 24px;
      margin: 3px 0 0 3px;
      background: $white-color;
      position: absolute;
      border-radius: 50%;
    }

    &.selected {
      transition: 1.5s;
      background: red;
    }
  }
}
</style>
