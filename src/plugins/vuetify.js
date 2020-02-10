import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);
const opts = {
  theme: {
    dark: false,
    themes: {
      light: {
        primary: "#012F38",
        secondary: "#db761c",
        accent: "#0da89b",
        tertiary: "#00232D"
      }
    }
  }
};

export default new Vuetify(opts);
