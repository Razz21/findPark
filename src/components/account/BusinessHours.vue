<template>
  <v-card outlined style="grid-area:hours">
    <v-card-title class="title">
      Business Hours
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
            Select Working Hours
            <div class="flex-grow-1"></div>
            <v-btn text @click="close" icon>
              <v-icon size="30">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-checkbox
              class="px-3"
              v-model="disableForm"
              label="Hours are unknown or should not be shown."
            ></v-checkbox>
            <v-form ref="form" lazy-validation v-model="valid" class="px-3">
              <div style="display:table; table-layout: fixed; width:100%">
                <div
                  v-for="(item, idx) in hoursTemp"
                  :key="idx"
                  class="mb-1"
                  style="display: table-row;width:100%"
                >
                  <v-checkbox
                    :disabled="disableForm"
                    :label="item.day"
                    v-model="working[idx]"
                    style="display: table-cell; width:30%;"
                    hide-details
                    :error="errors[idx]"
                    @change="validate(idx)"
                  ></v-checkbox>
                  <v-switch
                    :error="errors[idx]"
                    @change="validate(idx)"
                    :disabled="!working[idx] || disableForm"
                    v-model="item.fullTime"
                    label="24h"
                    style="display: table-cell; width:30%"
                  ></v-switch>
                  <v-text-field
                    @input="validate(idx)"
                    :error="errors[idx]"
                    :disabled="!working[idx] || item.fullTime || disableForm"
                    style="display: table-cell; width:20%"
                    v-model="item.open"
                    type="time"
                    hide-details
                    single-line
                  ></v-text-field>

                  <v-text-field
                    @input="validate(idx)"
                    :error="errors[idx]"
                    :disabled="!working[idx] || item.fullTime || disableForm"
                    style="display: table-cell; width:20%"
                    v-model="item.close"
                    type="time"
                    hide-details
                    single-line
                  ></v-text-field>
                </div>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn icon class="my-0" @click="resetForm">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <div class="flex-grow-1"></div>
            <v-btn
              text
              @click.prevent="submit"
              :disabled="!valid && !disableForm"
              >save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <p v-if="!hours.length">Not specified</p>
      <div
        v-else
        style="display:table; table-layout: fixed; border-spacing:1rem .5rem"
      >
        <div
          v-for="(item, idx) in hours"
          :key="idx"
          class="mb-1"
          style="display: table-row;"
        >
          <span style="display: table-cell;">{{ item.day }}</span>
          <span v-if="item.fullTime" style="display: table-cell;">24h</span>
          <span v-else-if="item.open && item.close" style="display: table-cell;"
            >from {{ item.open }} to {{ item.close }}</span
          >
          <span v-else style="display: table-cell;">closed</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["hours"],
  data() {
    return {
      dialog: false,
      disableForm: true,
      errors: [false, false, false, false, false, false, false],
      working: [false, false, false, false, false, false, false],
      hoursTemp: [],
      valid: false,
      defaultHours: [
        { close: "", day: "Sunday", open: "", fullTime: false },
        { close: "", day: "Monday", open: "", fullTime: false },
        { close: "", day: "Tuesday", open: "", fullTime: false },
        { close: "", day: "Wednesday", open: "", fullTime: false },
        { close: "", day: "Thursday", open: "", fullTime: false },
        { close: "", day: "Friday", open: "", fullTime: false },
        { close: "", day: "Saturday", open: "", fullTime: false }
      ]
    };
  },

  methods: {
    validate(idx) {
      const item = this.hoursTemp[idx];
      if (this.working[idx] && !item.fullTime && (!item.close || !item.open)) {
        this.errors[idx] = true;
      } else {
        this.errors[idx] = false;
      }
      return true;
    },
    resetForm() {
      /*
      Note: Firefox bug
      time input value can be resetting only BEFORE disabling,
      so not disabling  it at all or explicitly disable AFTER clearing values
      */
      //  clear values

      this.hoursTemp.forEach(i => {
        i.close = i.open = "";
        i.fullTime = false;
      });
      // reset other values and disabling time inputs
      setTimeout(() => {
        this.$refs.form.reset();
        this.working = Array.from({ length: 7 }, i => false);
        this.disableForm = true;
      }, 20);
    },
    close() {
      this.hoursTemp = [];
      this.dialog = false;
    },
    submit() {
      if (this.disableForm) {
        // working hours are not specified
        this.$emit("hours:update", []);
      } else {
        const isValid = this.$refs.form.validate();
        if (isValid) {
          // clear values for not-working days
          this.hoursTemp.forEach((i, idx) => {
            if (this.working[idx] && i.fullTime) {
              i.close = i.open = "";
            } else {
              i.close = i.open = "";
              i.fullTime = false;
            }
          });
          this.$emit("hours:update", this.hoursTemp);
        }
      }
      this.close();
    }
  },

  watch: {
    dialog: {
      handler(val) {
        // dialog sends also values on change input fields
        // need only dialog`s open trigger
        if (val === true) {
          this.errors = Array.from({ length: 7 }, i => false);

          if (this.hours.length) {
            // hours are specified - fullfill data and enable form
            this.disableForm = false;
            this.hoursTemp = JSON.parse(JSON.stringify(this.hours));
            this.working = this.hours.map(
              i => i.fullTime || (i.open && i.close)
            );
          } else {
            // initialize with defaults
            this.hoursTemp = JSON.parse(JSON.stringify(this.defaultHours));
          }
        }
      }
    }
  }
};
</script>
