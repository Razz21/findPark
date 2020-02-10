<template>
  <v-container class="d-flex flex-column" v-if="editedItem">
    <v-card class="flex-grow-1" flat>
      <div class="flex-grow-1"></div>
      <v-toolbar flat color="white">
        <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-toolbar-items>
          <v-btn large @click="submit" :disabled="!valid">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="py-1 grid-layout">
        <AddressDialog
          :data="{ geo: editedItem.geo, address: editedItem.address }"
          style="grid-area:address"
          @address:update="onAddressUpdate"
        />

        <DetailsCard
          :data="{
            capacity: editedItem.capacity,
            price: editedItem.price,
            tags: editedItem.tags,
            phone: editedItem.phone,
            website: editedItem.website,
            description: editedItem.description
          }"
          style="grid-area:others"
          @details:update="onDetailUpdate"
        />
        <BusinessHours
          :hours="editedItem.hours"
          @hours:update="data => (editedItem.hours = data)"
          style="grid-area:hours"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { GeoPoint } from "@/firebase";
import BusinessHours from "@/components/account/BusinessHours";
import DetailsCard from "@/components/account/DetailsCard";
import AddressDialog from "@/components/account/AddressDialog";
import store from "@/store";
export default {
  beforeRouteEnter(to, from, next) {
    if (to.name === "newplace") {
      next(vm => vm.initializeItem());
    } else {
      if (to.params.editId) {
        store
          .dispatch("account/loadOneLocation", to.params.editId)
          .then(res => {
            next(vm => {
              vm.edit = true;
              vm.editedItem = JSON.parse(JSON.stringify(res));
            });
          })
          .catch(er => {
            next(false);
          });
      } else {
        next(false);
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$options.beforeRouteEnter(to, from, next);
  },
  components: { BusinessHours, DetailsCard, AddressDialog },
  data() {
    return {
      valid: false,
      defaultItem: {
        address: {
          city: "",
          country: "",
          state: "",
          street: "",
          zip: ""
        },
        hours: [],
        description: "",
        phone: "",
        capacity: 0,
        website: "",
        price: "0.00",
        tags: [],
        geo: [],
        coordinates: {}
      },
      editedItem: null,
      edit: false
    };
  },
  created() {
    // this.initializeItem();
  },
  computed: {
    userAccount() {
      return this.$store.getters["account/getAccount"];
    },
    formTitle() {
      return this.edit ? "Edit Item" : "New Item";
    },
    getEitedItem() {
      return this.$store.getters["account/getEditedObject"];
    }
  },
  methods: {
    onDetailUpdate(data) {
      this.editedItem.website = data.website;
      this.editedItem.phone = data.phone;
      this.editedItem.tags = data.tags;
      this.editedItem.description = data.description;
      this.editedItem.capacity = data.capacity;
      this.editedItem.price = data.price;
    },
    onAddressUpdate(data) {
      this.editedItem.address = data.address;
      this.editedItem.geo = data.geo;
    },
    submit() {
      // be sure coordinates is Gopoint instance
      this.editedItem["coordinates"] = new GeoPoint(
        parseFloat(this.editedItem.geo[0]),
        parseFloat(this.editedItem.geo[1])
      );
      if (this.edit) {
        this.$store
          .dispatch("account/updateLocation", this.editedItem)
          .then(() => {
            this.$router.push({ name: "places" });
          });
      } else {
        // FIXME <user.id> is not supported in cloud functions, add security rule
        this.editedItem["ownerId"] = this.userAccount.id;
        this.$store
          .dispatch("account/addLocationGeo", this.editedItem)
          .then(() => {
            this.$router.push({ name: "places" });
          });
      }
    },
    initializeItem() {
      this.edit = false;
      this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
    }
  },
  watch: {
    editedItem: {
      deep: true,
      handler(val) {
        this.valid =
          Object.keys(val.address).every(i => val.address[i]) &&
          val.geo.length == 2;
      }
    }
  }
};
</script>

<style lang="scss">
.map-container {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.grid-layout {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-template-rows: auto;
  grid-template-areas:
    "address others"
    "address hours";
}
@include mediaSm {
  .grid-layout {
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    grid-template-areas:
      "address address"
      "others hours";
  }
}
@include mediaXs {
  .grid-layout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "address"
      "others"
      "hours";
  }
}
</style>
