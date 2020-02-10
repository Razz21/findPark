<template>
  <div>
    <template v-for="(step, idx) in routeData.routes[0].legs[0].steps">
      <div :key="idx" class="d-flex justify-space-between align-center">
        <div>
          <h4 class="text-sentence-case" v-html="routeGuide(step).guide"></h4>
          <p
            class="mb-1"
            style="opacity:0.4"
            v-html="routeGuide(step).name"
          ></p>
        </div>
        <h4 class="align-self-center" v-if="step.distance > 0">
          {{ routeDistance(step.distance) }}
        </h4>
      </div>
      <v-divider class="my-1" :key="'divider' + idx"></v-divider>
    </template>
  </div>
</template>

<script>
import u from "@/api/map_utils";
import { roundToNearest } from "@/api/helpers";
export default {
  props: {
    routeData: Object
  },

  methods: {
    h(t) {
      return [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
        "ninth",
        "tenth"
      ][t - 1];
    },
    routeDistance(distance) {
      if (distance > 10000) {
        return roundToNearest(distance / 1000, 1) + " km"; // 1 km
      }
      if (distance > 1000) {
        return roundToNearest(distance / 1000, 0.1).toFixed(1) + " km"; // 100 m
      }

      return roundToNearest(distance, 10) + " m"; //10 m
    },
    formatGuide(obj) {
      let [type, ...add] = obj.o.split("_");
      let res = "";
      let name = obj.name;
      switch (type) {
        /* --- */
        case "arrive":
          res = "You have arrived";
          break;
        case "off ramp right":
        case "off ramp left":
        case "on ramp right":
        case "on ramp left":
          res = "Take " + type + (obj.exit ? obj.exit + "th" : "") + " exit ";
          name = obj.directions ? obj.directions : obj.name;
          break;
        /* --- */
        case "depart":
          res = "Depart at the end";
          break;
        case "continue":
        case "turn straight":
          res += "Continue";
          break;

        case "turn uturn":
        case "uturn":
          res = "Turn back";
          break;
        case "merge right":
        case "merge left":
          res = type;
          break;

        case "end of road right":
        case "end of road left":
          res = "Take " + type;
          break;

        case "roundabout":
        case "rotary":
          res =
            "At the " +
            type +
            (obj.exit
              ? " take the " +
                (add.indexOf("ordinal") > -1 ? obj.exit : obj.exit + "th") +
                " exit "
              : " turn ");
          break;

        case "turn slight right":
        case "turn right":
        case "turn sharp right":
        case "turn slight left":
        case "turn left":
        case "turn sharp left":
        case "fork right":
        case "fork left":
        case "exit roundabout":
        case "exit rotary":
        default:
          res = type;
          break;
      }

      return { guide: res, name: obj.name };
    },
    routeGuide(t) {
      let n;
      switch (t.maneuver.type) {
        case "on ramp":
        case "off ramp":
        case "merge":
        case "end of road":
        case "fork":
          n =
            t.maneuver.type +
            " " +
            (0 <= t.maneuver.modifier.indexOf("left") ? "left" : "right");
          break;
        case "depart":
        case "arrive":
        case "roundabout":
        case "rotary":
        case "exit roundabout":
        case "exit rotary":
          n = t.maneuver.type;
          break;
        case "roundabout turn":
        case "turn":
        default:
          n = "turn " + t.maneuver.modifier;
      }
      let a,
        s = t.destinations,
        r = {},
        c = !0,
        o = n.slice();
      r["o"] = n;
      if (
        (t.name && t.ref
          ? (a = t.name + " (" + t.ref + ")")
          : t.name
          ? (a = t.name)
          : t.ref
          ? (a = t.ref)
          : ((a = "noname"), (c = !1)),
        t.maneuver.type.match(/^exit (rotary|roundabout)$/))
      )
        r["name"] = a;
      else if (t.maneuver.type.match(/^(rotary|roundabout)$/)) {
        t.maneuver.exit
          ? t.maneuver.exit <= 10
            ? ((r.o += "_with_exit_ordinal"),
              (r.exit = this.h(t.maneuver.exit)),
              (r["name"] = a))
            : ((r.o += "_with_exit"),
              (r["exit"] = t.maneuver.exit),
              (r["name"] = a))
          : ((r.o += "_without_exit"), (r["name"] = a));
      } else if (t.maneuver.type.match(/^(on ramp|off ramp)$/)) {
        var l = {};
        t.exits && t.maneuver.type.match(/^(off ramp)$/) && (l.exit = t.exits),
          t.destinations && (l.directions = s),
          c && (l.directions = a),
          0 < Object.keys(l).length &&
            (r.o += "_with_" + Object.keys(l).join("_")),
          (r = Object.assign(r, l));
      } else {
        r.o += "_without_exit";
        r["name"] = a;
      }
      return this.formatGuide(r);
    },
    convertDuration(dur) {
      // https://github.com/moment/moment/issues/959
      const interval = 10 * 60 * 1000; //min * sec * ms
      const rounded = this.$moment.utc(
        Math.ceil((dur * 1000) / interval) * interval
      );

      if (dur > 3600) {
        return rounded.format("HH:mm") + " h";
      }
      return rounded.format("mm") + " min";
    }
  }
};
</script>

<style></style>
