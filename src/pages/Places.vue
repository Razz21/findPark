<template>
  <v-container fluid>
    <v-card>
      <account-table
        :headers="headers"
        :loading="locationsLoadingStatus == 1"
        title="My Locations"
        :items="userLocations"
        @delete="deleteItems"
        :sort-by="['address.city', 'address.street']"
      >
        <v-toolbar-items>
          <v-btn text @click="$router.push({ name: 'newplace' })">
            <v-icon>mdi-plus</v-icon>
            <span v-show="$vuetify.breakpoint.mdAndUp">Add location</span>
          </v-btn>
        </v-toolbar-items>
      </account-table>
    </v-card>
  </v-container>
</template>

<script>
import AccountTable from "@/components/account/AccountTable";
export default {
  components: { AccountTable },
  data() {
    return {
      headers: [
        { text: "Street", value: "address.street", align: "left" },
        { text: "City", value: "address.city" },
        { text: "Zip", value: "address.zip" },
        { text: "Country", value: "address.country" },
        { text: "Capacity", value: "capacity" },
        { text: "Available", value: "available" },
        { text: "Price/h", value: "price" },
        { text: "Actions", value: "action", align: "right", sortable: false }
      ]
    };
  },

  computed: {
    accountLoadingStatus() {
      return this.$store.getters["account/getLoadAccountStatus"];
    },
    locationsLoadingStatus() {
      return this.$store.getters["account/getLocadLocationsStatus"];
    },
    userAccount() {
      return this.$store.getters["account/getAccount"];
    },
    userLocations() {
      return this.$store.getters["account/getLocations"];
    },
    user() {
      return this.$store.getters["auth/getUser"];
    }
  },

  methods: {
    deleteItems(items) {
      this.$store.dispatch("account/deleteBatchLocations", items);
    }
  },
  watch: {
    user: {
      // wait for user before fetching data;
      // watch, instead of mounted, in case of loading page after page refresh and/or resetting store data
      immediate: true,
      handler(val) {
        if (val) {
          this.$store.dispatch("account/loadUserLocations", this.user.uid);
        }
      }
    }
  }
};
</script>
