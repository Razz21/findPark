<template>
  <v-dialog
    :value="dialog"
    max-width="1300px"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
  >
    <v-card tile flat>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="submit"
            :disabled="!(valid && editedItem.geo.length == 2)"
            >Save</v-btn
          >
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" xs="12" lg="5">
              <v-subheader>1. Add address data</v-subheader>
              <v-form ref="form" lazy-validation v-model="valid">
                <v-row>
                  <v-col cols="12" sm="6" class="my-0 py-0">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Location Name"
                      clearable
                      outlined
                      :rules="requiredRule"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" class="my-0 py-0">
                    <v-text-field
                      v-model="editedItem.address"
                      label="Address"
                      clearable
                      outlined
                      :rules="requiredRule"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" class="my-0 py-0">
                    <v-text-field
                      v-model="editedItem.city"
                      :rules="requiredRule"
                      label="City"
                      clearable
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" class="my-0 py-0">
                    <v-text-field
                      v-model="editedItem.zip"
                      label="Postalcode"
                      clearable
                      outlined
                      :rules="zipRules"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" class="my-0 py-0">
                    <v-select
                      v-model="editedItem.state"
                      :items="regions"
                      item-text="name"
                      item-value="name"
                      no-data-text="Select country"
                      label="State/Region"
                      required
                      outlined
                      :rules="requiredRule"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" class="my-0 py-0">
                    <v-autocomplete
                      @change="addRegions"
                      v-model="editedItem.country"
                      :items="countries"
                      label="Country"
                      required
                      outlined
                      :rules="requiredRule"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" class="my-0 py-0">
                    <v-combobox
                      v-model="editedItem.tags"
                      hint="Tags helps users find your location."
                      label="Add tags (max 5)"
                      multiple
                      outlined
                      small-chips
                      deletable-chips
                      counter="5"
                      :rules="tagsRules"
                    >
                      <template
                        v-slot:selection="{ attrs, item, parent, selected }"
                      >
                        <v-chip
                          label
                          small
                          close
                          @click:close="parent.selectItem(item)"
                          >{{ item }}</v-chip
                        >
                      </template>
                    </v-combobox>
                  </v-col>

                  <v-col v-if="editedItem.geo.length == 2">
                    <p>Longitude: {{ editedItem.geo[0].toFixed(5) }}</p>
                    <p>Latitude: {{ editedItem.geo[0].toFixed(5) }}</p>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
            <v-col cols="12" xs="12" lg="7" style="height: 300px;width: 100%;">
              <v-subheader>2. Select Location From Map</v-subheader>
              <div v-if="foundLocationsStatus > 0">
                <v-select
                  :loading="foundLocationsStatus == 1"
                  hide-details
                  v-model="location"
                  :items="foundLocations"
                  label="Select location"
                  item-text="display_name"
                  solo
                  return-object
                  @input="centerMapToLocation"
                ></v-select>
                <v-subheader>
                  Not found your location? Check your data or click your
                  location on map
                </v-subheader>
              </div>

              <v-btn
                small
                @click="toggleMap"
                v-show="$vuetify.breakpoint.smAndDown"
                >{{ mapButton.text }}</v-btn
              >

              <AccountMap
                v-show="showMap"
                :geodata="editedItem.coordinates"
                @setGeodata="setGeodata"
                @useCustomLocation="useCustomLocation"
                :foundLocations.sync="foundLocations"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import { getRegions } from "@/country-region/countryList";
import { GeoPoint } from "@/firebase";
import { EventBus } from "@/bus";
import AccountMap from "@/components/account/AccountMap";
export default {
  components: { AccountMap },
  props: {
    dialog: { type: Boolean, default: false }
  },
  data() {
    return {
      mapButton: { text: "Hide Map" },
      showMap: true,
      valid: false,
      //   dialog: false,
      editedIndex: null,
      selectedRows: [],
      defaultItem: {
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        type: "",
        coordinates: { empty: true },
        tags: [],
        country: ""
      },
      editedItem: {
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        type: "",
        coordinates: { empty: true },
        tags: [],
        country: ""
      },
      requiredRule: [v => !!v || "This field is required"],
      zipRules: [
        v => !!v || "This field is required"
        // v =>
        //   /^\d{2}[-]?\d{3}$/.test(v) ||
        //   "Postalcode must must in format xxxxx or xx-xxx"
      ],
      tagsRules: [v => (v && v.length <= 5) || "Maximum 5 tags"],
      foundLocations: [],
      location: {},
      foundLocationsStatus: 0,
      regions: [],
      loadingAdd: 0
    };
  },
  computed: {
    userAccount() {
      return this.$store.getters["account/getAccount"];
    },
    formTitle() {
      return this.editedIndex ? "Edit Item" : "New Item";
    },
    countries() {
      return this.$store.getters["account/getAllCountries"];
    }
  },
  methods: {
    toggleMap() {
      this.showMap = !this.showMap;
      this.mapButton.text = this.showMap ? "Hide map" : "Show map";
    },
    addRegions() {
      this.regions = getRegions(this.editedItem.country).regions;
    },

    closeDialog() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = null;
      this.foundLocations = [];
      this.location = {};
      this.$refs.form.reset();
      this.$emit("closeDialog");
    },
    useCustomLocation(data) {
      // todo convert address properly
      const locData = data.properties.address;
      this.editedItem.city = locData.city || locData.town || "";
      this.editedItem.state = locData.state;
      this.editedItem.zip = locData.postcode;
      let address = "";
      address += locData.house_number || "";
      address += locData.village || "";
      address += locData.road || "";
      this.editedItem.address = address.trim();
      const geo = data.geometry.coordinates;
      this.editedItem.coordinates = this.convertToGeoPoint(geo[0], geo[1]);
    },
    centerMapToLocation() {
      this.setGeodata(this.location);
    },
    convertToGeoPoint(lat, lon) {
      return new GeoPoint(Number(lat), Number(lon));
    },
    setGeodata(data) {
      console.log("setGeodata", data);
      this.editedItem.coordinates = this.convertToGeoPoint(data.lat, data.lon);
    },

    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, this.defaultItem, item);
      this.addRegions();
    },
    submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        if (this.editedIndex) {
          this.$emit("update", this.editedItem);
        } else {
          // FIXME <user.id> is not supported in cloud functions, add security rule
          this.editedItem["ownerId"] = this.userAccount.id;
          this.$emit("create", this.editedItem);
        }
      }
    }
  },
  watch: {
    dialog(val) {
      val || this.closeDialog();
    }
  },
  created() {
    EventBus.$on("edit-dialog", this.editItem);
  }
};
</script>

<style></style>
