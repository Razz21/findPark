<template>
  <div class="map">
    <l-map
      ref="map"
      :zoom.sync="zoom"
      :center.sync="center"
      :min-zoom="min_zoom"
      :options="{ zoomControl: false }"
      :paddingTopLeft="[0, 400]"
      @locationfound="onlocationfound"
      @locationerror="onlocationerror"
      @ready="onMapMounted"
      @click="onMapClick"
      @leaflet:load="setMapReady"
      :maxBounds="maxBounds"
      @contextmenu="onMapContextMenu"
    >
      <!-- @contextmenu="onMapContextMenu" -->
      <l-tile-layer
        @load="onTileLoad"
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        :options="{ attribution: attribution }"
      ></l-tile-layer>

      <!-- map control -->
      <l-control-scale position="bottomleft"></l-control-scale>

      <l-control position="topright" class="leaflet-control">
        <v-btn fab small @click="toggleGeoloc">
          <v-icon>mdi-crosshairs-gps</v-icon>
        </v-btn>
      </l-control>

      <l-control position="topright" class="leaflet-control">
        <v-btn fab small color="#fff" @click="getCenter">
          <v-icon>mdi-image-filter-center-focus</v-icon>
        </v-btn>
      </l-control>
      <!-- map control -->

      <!-- route group -->
      <l-feature-group ref="route"> </l-feature-group>
      <!-- route group -->

      <!-- cluster group -->
      <l-feature-group ref="clusterLayer">
        <l-marker
          v-for="location in filtered"
          :lat-lng="location.geo"
          :key="location.id"
          :options="{ id: location.id }"
          :icon="placeIcon"
        >
          <l-popup
            class="pa-0 item-popup"
            :options="{ closeButton: false, maxWidth: 'auto' }"
          >
            <Item :location="location" :hover="false" />
          </l-popup>
        </l-marker>
      </l-feature-group>
      <!-- cluster group -->

      <!-- user location -->
      <l-circle
        v-if="userLocation && searchRadius"
        :lat-lng="userLocation.coordinates"
        :radius="searchRadius"
        :fillOpacity="0.1"
        :weight="0"
      />
      <l-feature-group ref="userLocation">
        <l-marker
          v-if="userLocation"
          :lat-lng="userLocation.coordinates"
          :zIndexOffset="1000"
          :icon="userIcon"
        >
          <l-popup
            :options="{
              closeButton: false,
              minWidth: 130,
              offset: [0, 0],
              className: 'popup-padding'
            }"
          >
            <v-card flat>
              <v-card-text
                class=" pa-2 body-2 text-no-wrap align-center justify-center"
              >
                <v-icon>mdi-account</v-icon>
                Your location</v-card-text
              >
            </v-card>
          </l-popup>
        </l-marker>
      </l-feature-group>
      <!-- user location -->

      <!-- contextmenu -->
      <l-feature-group>
        <l-popup
          ref="contextmenu"
          :options="{
            closeOnClick: false,
            closeButton: false,
            autoClose: false,
            minWidth: 130,
            offset: [0, 0],
            className: 'popup-padding'
          }"
        >
          <v-card
            flat
            v-for="(item, index) in contextMenuItems"
            :key="index"
            @click="item.callback"
            class=" pa-2 body-2 text-no-wrap align-center justify-center"
          >
            <v-icon v-text="item.icon"></v-icon>
            <span> {{ item.title }} </span>
          </v-card>
        </l-popup>
      </l-feature-group>
      <!-- contextmenu -->
    </l-map>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LFeatureGroup,
  LPopup,
  LControl,
  LControlScale,
  LIcon,
  LPolyline,
  LCircle
} from "vue2-leaflet";
import * as L from "leaflet";

const Item = () => import("@/components/locations/Item");

import MapDrawer from "@/components/map/MapDrawer";
import { RouteOSRM } from "@/api/nominatim";
import { EventBus } from "@/bus";
import { MapMixin } from "@/mixins/Leaflet";

import u from "@/api/map_utils";

L.Polyline.prototype._updatePath = function() {
  const path = u.createPath(this._parts);
  this._renderer._setPath(this, path);
};

export default {
  mixins: [MapMixin],
  components: {
    Item,
    LMap,
    LTileLayer,
    LFeatureGroup,
    LPopup,
    LControl,
    LControlScale,
    LMarker,
    LIcon,
    LPolyline,
    MapDrawer,
    LCircle
  },
  data() {
    const placeIcon = L.divIcon({
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, 0],
      className: "place-marker",
      html: '<div class="centraldot"><div class="innerdot"></div></div>'
    });
    const userIcon = L.divIcon({
      iconSize: [20, 20],
      className: "user-marker",
      html:
        '<div class="centraldot"></div><div class="wave"></div><div class="wave2"></div>'
    });

    return {
      offsetX: 0,
      offsetY: 0,
      /*  */
      placeIcon,
      userIcon,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',

      console: console,
      filtered: [],

      contextMenuItems: [
        {
          title: "Set my location",
          icon: "mdi-map-marker-outline",
          callback: () => {
            const popup = this.$refs.contextmenu.mapObject;
            const center = popup._latlng;
            if (center) {
              const coordinates = [center.lat, center.lng];
              const result = { display_name: "Point from map", coordinates };
              this.userLocation = result;
              this.items = [result];
            }
            popup._close();
          }
        }
      ]
    };
  },
  computed: {
    user() {
      return this.$store.getters["auth/getUser"];
    },
    /* map */
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
    places() {
      return this.$store.getters["map/getPlaces"];
    },
    /* global */
    loadingPage() {
      return this.$store.getters["global/getLoadingState"];
    },
    stepGeometries() {
      return this.$store.getters["map/getStepGeometries"];
    },
    selectedLocation() {
      return this.$store.getters["map/getPlace"];
    },
    searchRadius() {
      return this.$store.getters["filters/getRadius"] * 1000;
    }
  },
  watch: {
    selectedLocation: "selectMarker",
    stepGeometries: "drawRoute",
    userLocation(val) {
      this.$store.commit("map/removeSelected");
    },
    places: "getFeatures"
  },
  methods: {
    onTileLoad() {
      const loader = document.querySelector(".loader");
      if (loader) {
        loader.style.display = "none";
      }
    },
    getFeatures() {
      const sourceVm = this.$refs.clusterLayer.mapObject;
      if (!this.places || !sourceVm) return;
      this.filtered = this.places;

      this.$nextTick(() => {
        this.getCenter();
      });
    },
    /* geolocation*/
    toggleGeoloc() {
      this.$refs.map.mapObject.locate();
    },
    onlocationfound(e) {
      this.geolocPosition = [e.latitude, e.longitude];
    },
    onlocationerror(e) {
      this.$store.dispatch("global/createAlert", e.message);
    },

    /* map */
    changeMapExtent(extent, maxZoom) {
      const map = this.$refs.map.mapObject;
      /* fit view to given bounds */
      if (map) {
        if (maxZoom === undefined) {
          maxZoom = map.getZoom();
        }

        map.fitBounds(extent, {
          maxZoom,
          // paddingTopLeft: [this.offsetX, 0],
          paddingBottomRight: [this.offsetX, 0]
        });
      }
    },
    async getCenter() {
      /*
      center map depends of current url route or available locations
       */
      let bounds, geo, maxZoom;
      bounds = this.$refs.route.mapObject.getBounds();
      if (this.selectedLocation && bounds) {
        maxZoom = 17;
      } else if (this.selectedLocation) {
        geo = this.selectedLocation.center;
        bounds = L.latLngBounds(geo, geo);
        maxZoom = 15;
      } else {
        const featuresBounds = this.$refs.clusterLayer.mapObject;
        // center view to display all locations

        if (featuresBounds && featuresBounds.getBounds().isValid()) {
          bounds = featuresBounds.getBounds();
          maxZoom = 15;
        } else if (this.userLocation && this.userLocation.coordinates) {
          // center view to display selected user location
          geo = this.userLocation.coordinates;
          bounds = L.latLngBounds(geo, geo);
        } else {
          // center view to display user location based on ip lookup
          const val = await this.getLookupLocation();
          if (val) {
            bounds = L.latLngBounds(val[0], val[0]);
          }
        }
      }

      if (bounds && bounds.isValid()) {
        this.changeMapExtent(bounds, maxZoom);
      }
    },
    panToLocation(data) {
      /* center map to selected location in details route */
      this.selectedLocation = data;
      this.$refs.map.mapObject.setView(data.center, 17);
    },
    /* route */
    drawRoute(data) {
      const routeGroup = this.$refs.route.mapObject;
      routeGroup.clearLayers();
      if (!data.length) return;
      const features = data.map((polyline, idx, arr) => {
        const res = polyline.geometry.coordinates.map(i => u.toLatLng(i));
        return res;
      });

      features.forEach(line => {
        const poly = L.polyline(line, { color: "#0da89b", weight: 4 });
        routeGroup.addLayer(poly);
      });

      this.$nextTick(() => {
        this.offsetX = 350;
        this.getCenter();
      });
    },
    /*---------------- to update ----------------*/
    getAllLayers() {
      const ref = this.$refs.clusterLayer;
      if (!ref) return;
      const layers = ref.mapObject.getLayers();
      return layers;
    },
    unselectAllMarkers() {
      const active = document.querySelector(".leaflet-marker-icon.active");
      if (active) {
        active.classList.remove("active");
      }
    },
    async selectMarker(location) {
      this.unselectAllMarkers();
      if (!location) {
        this.offsetX = 0;
        await this.getCenter();
        return;
      }
      const layers = this.getAllLayers();
      const target = layers.find(i => i.options.id === location.id);
      if (target) {
        target._icon.classList.add("active");
      }
    },
    onMapClick(e) {
      this.onMapContextMenu(e);
    },
    onMapMounted(e) {
      this.getFeatures();
    },
    setMapReady(evt) {
      this.$refs.map.mapObject.createPane("route");
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.getCenter();
    });
  },

  updated() {
    this.$nextTick(() => {});
  }
};
</script>

<style lang="scss">
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

.main-map {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 0;
}

/* leaflet map */

.leaflet-route-pane {
  z-index: 1001;
}

.leaflet-fade-anim .leaflet-tile,
.leaflet-zoom-anim .leaflet-zoom-animated {
  will-change: auto !important;
}
.leaflet-popup-content {
  padding: 0px;
  max-width: 350px;
}
.popup-padding {
  & .leaflet-popup-content {
    padding: 10px !important;
    cursor: pointer;
  }
}

.leaflet-popup-content-wrapper,
.leaflet-popup-content {
  @extend .card-border;
  overflow: hidden;
  margin: 0;
  box-shadow: none;
}

.leaflet-popup-content-wrapper {
  @extend .card-shadow;
}

.leaflet-popup-tip {
  border-radius: 2px;
}

path.leaflet-interactive {
  stroke-linejoin: round;
}

/* location marker */
.marker-pin {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  position: absolute;
  transform: rotate(-45deg);
  background: #3498db;

  &.selected {
    background: red;
  }

  & i.mdi {
    transform: rotate(45deg);
    bottom: 3px;
    left: 3px;
    margin: 0 auto;
    text-align: center;
    font-size: 17px;
    width: 24px;
    height: 24px;
    background: $white-color;
    position: absolute;
    border-radius: 50%;
  }
}

.marker-shadow {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  height: 14px;
  width: 14px;
  position: absolute;
  left: 7px;
  bottom: 0;
  transform: rotateX(55deg);
  z-index: -2;
}

.leaflet-popup {
  transition: opacity 0.2s ease;
  opacity: 0.5 !important;
  &:hover {
    opacity: 1 !important;
  }
}

.place-marker {
  & > .centraldot {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation-name: scale;
    animation-duration: 0.5s;
    width: 12px;
    height: 12px;
    background: $white-color;
    box-shadow: 0 0 2px 3px #aaaaaa50;
    border-radius: 50%;
    position: absolute;
    transform-origin: 50% 50%;
    transition: all 0.3s ease;

    & > .innerdot {
      transition: all 0.3s ease;
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $primary;
    }
  }
  &.active {
    & > .centraldot {
      width: 20px;
      height: 20px;
      background: $accent;
      & > .innerdot {
        background: $white-color;
        width: 14px;
        height: 14px;
      }
    }
  }
}

/* user pin */
.user-marker {
  & > .centraldot {
    width: 20px;
    height: 20px;
    background: $accent;
    box-shadow: 0 0 2px 3px #aaaaaa50;
    border: 2px solid $white-color;
    border-radius: 50%;
    position: absolute;
    transform-origin: 50% 50%;
  }

  & .wave,
  & .wave2 {
    width: 20px;
    height: 20px;
    background: $dark-green;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    animation: animationWave cubic-bezier(0, 0.54, 0.53, 1) 3s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
  }

  & .wave {
    animation-delay: 0.9s;
  }

  & .wave2 {
    animation-delay: 1.07s;
  }
}

@keyframes scale {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes animationWave {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  1% {
    opacity: 1;
  }

  10% {
    background: rgba(32, 150, 243, 0.4);
  }

  100% {
    transform: scale(5);
    background: rgba(32, 150, 243, 0);
  }
}

path {
  animation: draw-path 3s linear forwards;
  animation-delay: 1.3s; // change map bounds first
  stroke-dasharray: 110%;
}

@keyframes draw-path {
  0% {
    stroke-dashoffset: 100%;
  }
  100% {
    stroke-dashoffset: 0%;
  }
}
</style>
