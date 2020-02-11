<template>
  <v-card
    solo
    dark
    color="primary"
    hover
    class="item card-border"
    v-bind="$attrs"
  >
    <v-card-text
      class="d-flex flex-column justify-space-between white--text"
      style="height:100%"
    >
      <div class="d-flex justify-space-between">
        <div class="d-flex align-center">
          <v-icon class="full-icon">mdi-currency-usd</v-icon>
          <span class="subtitle-1" style="color:#eee"
            >{{ "&nbsp;" }}{{ location.price | currency }}/h</span
          >
        </div>
        <div class="d-flex align-center">
          <v-icon class="full-icon">mdi-parking</v-icon>
          <span
            class="subtitle-1"
            :style="{ color: location.available ? '#eee' : '#db4437' }"
            >{{ "&nbsp;" }}{{ location.available }}{{ "&nbsp;" }}spots</span
          >
        </div>
        <div class="text-center accent distance px-2">
          <p class="subtitle-1 ma-0 white--text">
            {{ convertDistance(location.distance * 1000) }}
          </p>
        </div>
      </div>
      <div class="my-3">
        <p class="grey--text mt-0 mb-1">Address</p>
        <div class="subtitle-1 ">
          {{ location.address.street }}
        </div>
      </div>

      <div class="d-flex justify-space-around">
        <v-btn color="accent" depressed block rounded @click="showDetails"
          >Details</v-btn
        >
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { LocationMixin } from "@/mixins/Location";
export default {
  mixins: [LocationMixin],
  props: ["location"],

  data() {
    return {};
  },
  computed: {},

  methods: {
    showDetails() {
      this.$store.commit("map/setPlace", this.location);
    }
  }
};
</script>

<style lang="scss">
.item {
  box-sizing: border-box;
  width: 100%;
  min-width: 300px;
  & .distance {
    border: 1px solid #aaa;
    border-radius: 20px;
    color: $accent;
  }
}

.full-icon {
  background-color: $accent;
  color: $white-color !important;
}

@include mediaSmAndDown {
  .item {
    max-width: 400px;
    width: 100%;
  }
}
</style>
