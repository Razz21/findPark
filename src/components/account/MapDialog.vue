<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <template v-slot:activator="{ on }">
      <v-btn block v-on="on" @click="fetchGeodata" height="56px">
        <v-icon size="30">mdi-map-marker</v-icon>
        <v-icon size="30" v-if="isLocation" color="success"
          >mdi-check-bold</v-icon
        >
        <v-icon size="30" v-else color="error">mdi-alert-circle-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="align-start">
        <span>
          Select Location From Map
          <v-subheader class="caption grey--text"
            >All changes are saved automatically</v-subheader
          >
        </span>
        <div class="flex-grow-1"></div>
        <v-btn text @click="dialog = false" icon>
          <v-icon size="30">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-container
        fill-height
        class="d-flex flex-column align-start max-width:none"
      >
        <AccountMap
          :geodata.sync="geo"
          @setGeodata="setGeodata"
          :foundLocations.sync="foundLocations"
        />
        <v-row class="mt-3">
          <v-col cols="6" class="my-0 py-0">
            <v-text-field
              v-model="geo[0]"
              hint="Pass longitude of your location or select from map"
              label="Longitude"
              clearable
              outlined
              :rules="[rules.required, rules.numberRule, rules.longitudeRules]"
            ></v-text-field>
          </v-col>
          <v-col cols="6" class="my-0 py-0">
            <v-text-field
              hint="Pass latitude of your location or select from map"
              v-model="geo[1]"
              label="Latitude"
              clearable
              outlined
              :rules="[rules.required, rules.numberRule, rules.latitudeRules]"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import AccountMap from "@/components/account/AccountMap";
export default {
  props: ["geo"],
  data() {}
};
</script>

<style></style>
