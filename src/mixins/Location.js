import { roundToNearest } from "@/api/helpers";
export const LocationMixin = {
  computed: {
    currentDay() {
      return this.location.hours[this.today];
    },
    today() {
      return new Date().getDay();
    }
  },
  methods: {
    convertDistance(distance) {
      if (distance > 10000) {
        return roundToNearest(distance / 1000, 1) + " km"; // 1 km
      }
      if (distance > 1000) {
        return roundToNearest(distance / 1000, 0.1).toFixed(1) + " km"; // 100 m
      }
      return roundToNearest(distance, 10) + " m"; //10 m
    }
  }
};
