<template>
  <div class="fill-page d-flex">
    <v-alert
      type="info"
      dark
      class="map-info"
      dense
      transition="fade-transition"
    >
      This is demo project and some of the features are available only in
      Greater Poland area.
    </v-alert>
    <MapDrawer />
    <Map />
    <transition name="slide-right">
      <DetailCard
        :key="location.id"
        :location="location"
        :userLocation="userLocation"
        v-if="location && userLocation"
        @close="closeDetails"
      />
    </transition>
  </div>
</template>

<script>
import MapDrawer from "@/components/map/MapDrawer";
import RouteGuide from "@/components/map/RouteGuide";
import DetailCard from "@/components/locations/DetailCard";
import Map from "@/pages/Map";
export default {
  components: {
    MapDrawer,
    Map,
    RouteGuide,
    DetailCard
  },
  data() {
    return {
      show: true
    };
  },
  watch: {
    location(val) {
      // this.show = !!val;
    }
  },
  computed: {
    userLocation() {
      return this.$store.getters["filters/getCenter"];
    },
    location() {
      return this.$store.getters["map/getPlace"];
    }
  },
  methods: {
    closeDetails() {
      this.$store.commit("map/removeSelected");
    }
  }
};
</script>

<style lang="scss">
.fill-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.slide-right {
  &-enter,
  &-leave-to {
    transform: translateX(100%);
  }

  &-enter-active,
  &-leave-active {
    transition: transform 0.5s ease;
  }
}

.map-info {
  opacity: 0.2;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  font-size: 1rem;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 1;
  }
}
</style>
