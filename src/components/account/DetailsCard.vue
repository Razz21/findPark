<template>
  <v-card outlined>
    <v-card-title class="title">
      Details
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
            Details
            <div class="flex-grow-1"></div>
            <v-btn text @click="close" icon>
              <v-icon size="30">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation v-model="valid">
              <v-numeric-field
                v-model="tempData.capacity"
                label="Capacity"
                clearable
                outlined
                validate-on-blur
                placeholder="0"
              ></v-numeric-field>
              <v-numeric-field
                :prefix="'$'"
                :decimalPoints="2"
                v-model="tempData.price"
                label="Price per hour"
                clearable
                outlined
                validate-on-blur
                placeholder="0.00"
              ></v-numeric-field>
              <v-text-field
                clearable
                v-model="tempData.website"
                label="Website"
                outlined
                validate-on-blur
              ></v-text-field>
              <v-text-field
                v-model="tempData.phone"
                label="Phone"
                clearable
                outlined
                hint="You can split number parts with empty space, dot or dash"
                :rules="[rules.phoneRule]"
                validate-on-blur
              ></v-text-field>
              <v-select
                v-model="tempData.tags"
                label="Tags"
                multiple
                outlined
                small-chips
                deletable-chips
                :items="tags"
              >
                <template v-slot:selection="{ attrs, item, parent, selected }">
                  <v-chip
                    label
                    small
                    close
                    @click:close="parent.selectItem(item)"
                    >{{ item }}</v-chip
                  >
                </template>
              </v-select>
              <v-textarea
                v-model="tempData.description"
                rows="3"
                label="Description"
                auto-grow
                clearable
                outlined
                hint="Write brief description of this place: specyfic location, driving directions, etc."
                validate-on-blur
                :counter="1000"
              ></v-textarea>
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
      <!-- <p class="text-sentence">website: {{ data.website }}</p>
      <p class="text-sentence">phone: {{ data.phone }}</p>
      <p class="text-sentence">tags: {{ data.tags.join(', ') }}</p>
      <p class="text-sentence">capacity: {{ data.capacity }}</p>
      <p class="text-sentence">price/h: {{ data.price }}</p>
      <p class="text-sentence">description: {{ data.description }}</p>-->
      <div v-for="(val, key) in data" :key="key" class="d-flex">
        <p class="text-sentence">{{ key }}:{{ "&nbsp;" }}</p>
        <span>{{ processVal(val) }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import VNumericField from "./VNumericField";
export default {
  components: { VNumericField },
  props: ["data"],
  data() {
    return {
      errors: [],
      tempData: {},
      showImage: false,
      dialog: false,
      valid: false,
      rules: {
        required: v => !!v || "This field is required",
        phoneRule: v =>
          !v ||
          /^(\(?\+?[0-9]{1,3}\)?\s?)?\(?\d{3}\)?[\s.-]?\d{2,3}[\s.-]?\d{2,4}$/g.test(
            v
          ) ||
          "Invalid format"
      }
    };
  },
  computed: {
    tags() {
      // todo group tags
      const obj = this.$store.getters["map/getTags"];
      return Object.keys(obj).reduce((arr, curr) => arr.concat(obj[curr]), []);
    }
  },
  methods: {
    processVal(val) {
      if (val instanceof Array) {
        return val.join(", ");
      }
      return val;
    },
    resetForm() {
      this.tempData = {
        capacity: 0,
        description: "",
        phone: "",
        price: "0.00",
        tags: [],
        website: ""
      };
    },
    submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.$emit("details:update", this.tempData);
        this.close();
      }
    },
    close() {
      this.dialog = false;
    }
  },
  watch: {
    dialog: {
      handler(val) {
        // dialog sends also values on change input fields
        // need only dialog`s open trigger
        if (val === true) {
          this.tempData = Object.assign({}, this.data);
        }
      }
    }
  }
};
</script>

<style>
.text-overflow {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
