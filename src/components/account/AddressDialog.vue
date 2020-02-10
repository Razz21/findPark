<template>
  <v-card outlined>
    <v-card-title class="title">
      Address
      <div class="flex-grow-1"></div>

      <v-dialog
        v-model="dialog"
        max-width="500"
        :fullscreen="$vuetify.breakpoint.xsOnly"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="align-start flex-grow-1">
            Address
            <div class="flex-grow-1"></div>
            <v-dialog
              v-model="mapDialog"
              max-width="600"
              :fullscreen="$vuetify.breakpoint.xsOnly"
            >
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="fetchGeodata">
                  <v-icon>mdi-map-marker</v-icon>
                </v-btn>
              </template>

              <v-card class="map-container">
                <v-card-title class="align-start flex-grow-1">
                  <span>Location</span>
                  <div class="flex-grow-1"></div>
                  <v-btn text @click="mapDialog = false" icon>
                    <v-icon size="30">mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <p class="caption grey--text pa-0 ma-0">
                    Select location from found locations or click on map to
                    choose your own.
                  </p>
                  <p class="caption grey--text pa-0 my-0">
                    All changes are saved automatically
                  </p>
                </v-card-text>
                <v-card-text class="map">
                  <AccountMap
                    v-bind:geodata.sync="tempData.geo"
                    :foundLocations.sync="foundLocations"
                  />
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-btn text @click="close" icon>
              <v-icon size="30">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12" xs="12" class="my-0 py-0">
                  <v-text-field
                    :dense="$vuetify.breakpoint.smAndDown"
                    v-model="tempData.address.street"
                    label="Street"
                    clearable
                    outlined
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" class="my-0 py-0">
                  <v-text-field
                    :dense="$vuetify.breakpoint.smAndDown"
                    v-model="tempData.address.city"
                    :rules="[rules.required]"
                    label="City"
                    clearable
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" class="my-0 py-0">
                  <v-text-field
                    :dense="$vuetify.breakpoint.smAndDown"
                    v-model="tempData.address.zip"
                    label="Zip/Postalcode"
                    clearable
                    outlined
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" class="my-0 py-0">
                  <v-autocomplete
                    :dense="$vuetify.breakpoint.smAndDown"
                    @change="addRegions"
                    v-model="tempData.address.country"
                    :items="countries"
                    label="Country"
                    required
                    outlined
                    :rules="[rules.required]"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" xs="12" sm="6" class="my-0 py-0">
                  <v-select
                    :dense="$vuetify.breakpoint.smAndDown"
                    v-model="tempData.address.state"
                    :items="regions"
                    item-text="name"
                    item-value="name"
                    no-data-text="Select country"
                    label="State/Region"
                    required
                    outlined
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <v-col cols="12" xs="12" sm="6" class="my-0 py-0">
                  <v-text-field
                    :dense="$vuetify.breakpoint.smAndDown"
                    v-model.number="tempData.geo[1]"
                    @keypress="isNumber"
                    hint="Pass longitude of your location or select from map"
                    label="Longitude"
                    clearable
                    outlined
                    :rules="[rules.required, rules.longitudeRules]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" class="my-0 py-0">
                  <v-text-field
                    :dense="$vuetify.breakpoint.smAndDown"
                    v-model.number="tempData.geo[0]"
                    @keypress="isNumber"
                    hint="Pass latitude of your location or select from map"
                    label="Latitude"
                    clearable
                    outlined
                    :rules="[rules.required, rules.latitudeRules]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn icon class="my-0" @click="resetForm">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <div class="flex-grow-1"></div>
            <v-btn text @click.prevent="submit" :disabled="!valid">save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div v-for="(val, key) in data.address" :key="key">
        <p class="text-sentence">{{ key }}:{{ "&nbsp;" }}</p>
        <span v-if="val">{{ val }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { getRegions } from "@/country-region/countryList";
const countries = require("@/country-region/countries.json");
import { Nominatim } from "@/api/nominatim";
import AccountMap from "@/components/account/AccountMap";
export default {
  components: { AccountMap },
  props: ["data"],
  data() {
    return {
      valid: false,
      dialog: false,
      mapDialog: false,
      regions: [],
      countries: countries,
      foundLocations: [],
      tempData: { address: {}, geo: [] },
      countries: countries,
      rules: {
        required: v => !!v || v === 0 || "This field is required",
        longitudeRules: v =>
          (v >= -180 && v <= 180) || "Longitude must be in range -180° - 180°",
        latitudeRules: v =>
          (v >= -90 && v <= 90) || "Longitude must be in range -90° - 90°",
        numberRule: v => !!Number(v) || "Only numbers allowed"
      }
    };
  },
  methods: {
    isNumber($event) {
      const charCode = $event.which ? $event.which : $event.keyCode;
      if (
        /^-?.+$/.test($event.target.value) &&
        charCode > 31 &&
        (charCode !== 46 || $event.target.value.indexOf(".") !== -1) &&
        (charCode < 48 || charCode > 57)
      ) {
        $event.preventDefault();
      }
    },
    addRegions() {
      // fill state/region select field based on choosen country
      if (this.tempData.address.country) {
        this.regions = getRegions(this.tempData.address.country).regions;
      }
    },

    fetchGeodata() {
      const { street, city, zip, state, country } = this.tempData.address;
      if (!(street || city || zip || state || country)) {
        return;
      }
      const nominatim = new Nominatim({ limit: 5 });

      nominatim
        .search({ street, city, postalcode: zip, state, country })
        .then(resp => {
          console.log("fetchGeodata", resp.data);
          if (resp.data.features.length) {
            this.foundLocations = resp.data.features;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetForm() {
      this.tempData = {
        address: {
          city: "",
          street: "",
          zip: "",
          country: "",
          state: ""
        },
        geo: []
      };

      this.$refs.form.resetValidation();
    },
    submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.$emit("address:update", this.tempData);
        this.close();
      }
    },
    close() {
      this.$refs.form.resetValidation();
      this.dialog = false;
    }
  },
  watch: {
    dialog: {
      handler(val) {
        // dialog sends also values on change input fields
        // need only dialog`s open trigger
        if (val === true) {
          this.tempData = JSON.parse(JSON.stringify(this.data));
        }
      }
    }
  }
};
</script>

<style lang="scss">
.text-sentence {
  // text-transform: lowercase;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
  word-wrap: break-word;
  word-break: break-all;
  &::first-letter {
    text-transform: uppercase;
  }
}

/* Firefox */
// input[type="number"] {
//   -moz-appearance: textfield;
//   &:focus {
//     -moz-appearance: number-input;
//   }
// }

/* Webkit */
// input[type="number"]::-webkit-inner-spin-button,
// input[type="number"]::-webkit-outer-spin-button {
//   -webkit-appearance: textfield;
//   margin: 0;
//   &:focus {
//     -moz-appearance: number-input;
//   }
// }
</style>
