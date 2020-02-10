<template>
  <v-container>
    <v-card class="mb-1">
      <v-toolbar flat color="white">
        <v-toolbar-title>Add admin</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <div class="flex-grow-1"></div>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" @submit="addAdmin">
          <v-row>
            <v-col cols="12" xs="12" sm="6" md="4">
              <v-text-field
                outlined
                v-model="email"
                label="create admin from email"
                type="email"
              ></v-text-field>
              <v-btn type="submit">submit</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-toolbar flat color="white">
        <v-toolbar-title>Other Settings</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
      <v-card-text></v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="success" depressed disabled>Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: ""
    };
  },
  computed: {
    accountLoadingStatus() {
      return this.$store.getters["account/getLoadAccountStatus"];
    },
    userAccount() {
      return this.$store.getters["account/getAccount"];
    },
    user() {
      return this.$store.getters["auth/getUser"];
    }
  },
  methods: {
    addAdmin() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.$store.dispatch("auth/createAdmin", this.email);
      }
    }
  },
  watch: {}
};
</script>

<style></style>
