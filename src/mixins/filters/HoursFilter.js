// import moment from "moment";
export const HoursFilter = {
  methods: {
    processHoursFilter(location, filter) {
      if (filter) {
        if (location.hours && location.hours.length) {
          const day = new Date().getDay();
          const item = location.hours[day];

          if (item.fullTime) {
            return true;
          } else {
            const current = this.$moment(
              this.$moment().format("HH:mm"),
              "HH:mm"
            );
            const close = this.$moment(item.close, "HH:mm");
            return close.diff(current, "minutes") > 0;
          }
        }
        return false;
      } else {
        return true;
      }
    }
  }
};
