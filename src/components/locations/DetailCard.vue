<template>
  <div
    v-if="location"
    flat
    class="primary detail-card overflow-auto small-scroll drawer d-flex flex-column"
  >
    <div class="py-1 d-flex pa-2">
      <div class="flex-grow-1"></div>
      <v-btn color="accent" icon text @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-divider></v-divider>

    <div class="pa-6">
      <div>
        <h2 class="display-1 text-capitalize text-center mb-3">
          About this place
        </h2>
        <p v-if="location.description">{{ location.description }}</p>
        <div class="d-flex flex-wrap justify-space-around">
          <div class="tag d-flex pa-2" v-for="tag in location.tags" :key="tag">
            <v-icon dark>{{ getTagIcon(tag) }}</v-icon>
            <span class="white--text text-capitalize">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <v-divider></v-divider>
    <div class="pa-6">
      <h3 class="title">{{ location.address.street }}</h3>
      <h4 class="grey--text mb-4">{{ location.address.city }}</h4>
      <div class="d-flex justify-space-between align-center mb-4">
        <h2>{{ location.price | currency }}/h</h2>
        <div class="d-flex">
          <v-icon dark class="mr-2">mdi-near-me</v-icon>
          <h2>{{ convertDistance(location.distance * 1000) }}</h2>
        </div>
      </div>
      <div class="d-flex justify-end">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <div class="availibility grey--text cursor-pointer" v-on="on">
              Availibility
              <div :style="availableStyle"></div>
            </div>
          </template>
          <span>{{ location.available }} spot(s)</span>
        </v-tooltip>
      </div>
    </div>

    <v-divider></v-divider>

    <div class="pa-6 ">
      <div class="mb-4" v-if="location.hours && location.hours.length">
        <div class="description">
          <h4>Working hours</h4>
        </div>
        <div>
          <p v-if="currentDay.fullTime" class="mb-0">
            Open 24h
          </p>
          <p v-else class="mb-0">
            {{ currentDay.open }}{{ "&nbsp;" }}-{{ "&nbsp;"
            }}{{ currentDay.close }}
          </p>
          <p style="color:green" class="mb-1" v-if="checkHours(currentDay)">
            Now is open
          </p>
          <div class="caption " style="color:red" v-else>Now is closed</div>
        </div>
      </div>

      <div class="mb-4">
        <div class="description">
          <h4>Contacts</h4>
        </div>
        <p v-if="location.phone" class="mb-1">
          {{ formatPhone(location.phone) }}
        </p>
        <p v-if="location.website" class="mb-1">
          {{ location.website }}
        </p>
      </div>

      <div class="mb-4">
        <div class="description">
          <h4>Full address</h4>
        </div>
        <p class="mb-0">
          {{ location.address.street }}
        </p>
        <p class="mb-0">
          {{ location.address.city }}, {{ location.address.zip }}
        </p>
        <p>{{ location.address.state }}, {{ location.address.country }}</p>
      </div>
    </div>

    <div class="tertiary flex-grow-1">
      <div class="pa-8">
        <h3
          class="pa-3 white--text cursor-pointer"
          @click="showRoute = !showRoute"
        >
          Show
          <span>
            Route
            <v-icon dark="">mdi-chevron-down</v-icon>
          </span>
        </h3>
      </div>
      <div
        class="d-flex justify-center align-center"
        v-if="routeLoadStatus === 1"
      >
        <v-progress-circular indeterminate size="64"> </v-progress-circular>
      </div>
      <transition-auto-height>
        <div v-if="!!routeData && showRoute" class="pa-8">
          <div v-if="routeData">
            <RouteGuide :routeData="routeData" />
          </div>
          <h3
            class="px-3 white--text cursor-pointer mt-8"
            @click="showRoute = false"
          >
            Close
            <v-icon dark="">mdi-chevron-up</v-icon>
          </h3>
        </div>
      </transition-auto-height>
    </div>
  </div>
</template>

<script>
import RouteGuide from "@/components/map/RouteGuide";
import TransitionAutoHeight from "@/components/transitions/TransitionAutoHeight";

import { getTagIcon } from "@/utils";
import u from "@/api/map_utils";
import { LocationMixin } from "@/mixins/Location";
export default {
  mixins: [LocationMixin],
  props: ["location", "userLocation"],
  components: { RouteGuide, TransitionAutoHeight },
  data() {
    return {
      getTagIcon,
      showRoute: false
    };
  },
  computed: {
    availableStyle() {
      const style = { backgroundColor: "#9e9e9e" };
      const { available } = this.location;
      if (!available) {
        return style;
      }
      if (available) {
        style.backgroundColor = "#49eb34";
      } else {
        style.backgroundColor = "#ff0000";
      }
      return style;
    },

    placeLoadstatus() {
      return this.$store.getters["map/getPlaceLoadstatus"];
    },
    routeLoadStatus() {
      return this.$store.getters["map/getRouteLoadStatus"];
    },
    routeData() {
      return this.$store.getters["map/getRouteData"];
    }
  },
  created() {
    this.$store.dispatch("map/findRoute", [
      u.toLatLng(this.userLocation.coordinates),
      u.toLatLng(this.location.geo)
    ]);
  },
  methods: {
    close() {
      this.$emit("close");
    },
    formatPhone(phone) {
      const regex = /^(\+?\d{0|2}?)?(\d{3})(\d{2,3})(\d{2,4})$/;
      const match = phone.match(regex);
      if (match) {
        return [
          match[1] ? match[1] + " " : "",
          match[2],
          "-",
          match[3],
          "-",
          match[4]
        ].join("");
      }
      return phone;
    },
    checkHours(item) {
      if (!item.fullTime) {
        const current = this.$moment(this.$moment().format("HH:mm"), "HH:mm");
        const close = this.$moment(item.close, "HH:mm");
        const diff = close.diff(current, "minutes");
        if (diff < 0) {
          return false;
        }
      }
      return true;
    }
  }
};
</script>

<style lang="scss">
.detail-card {
  height: 100%;
  width: 350px;
  min-width: 350px;
  z-index: 10;
  right: 0;
  top: 0;
  position: absolute;
}

.full-icon {
  background-color: $primary;
  color: $white-color !important;
}
.tag {
  // flex: 1 0 50%;
  min-width: 100px;
  max-width: 25%;
}

.availibility {
  color: $white-color;
  // opacity: 0.4;
  display: flex;
  align-items: center;
  padding: 5px;

  &:hover {
    filter: brightness(0.8);
  }

  div {
    margin-left: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: $white-color;
  }
}
</style>
