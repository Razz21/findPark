<template>
  <v-dialog
    :value="authDialog"
    persistent
    max-width="350px"
    eager
    :fullscreen="$vuetify.breakpoint.xs"
  >
    <v-card
      flat
      tile
      :loading="authStatus === 1"
      class="d-flex flex-column relative align-center"
      width="100%"
      height="100%"
    >
      <v-btn icon @click.prevent="close" class="close-btn">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <template v-slot:progress>
        <v-progress-linear
          absolute
          color="accent"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>
      <div class="auth-wrapper">
        <router-view :key="$route.fullPath" name="auth"></router-view>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import store from "@/store";
import router from "@/router";
export default {
  beforeRouteLeave(to, from, next) {
    this.$store.commit("auth/toggleAuthDialog", false);
    next();
  },
  beforeRouteEnter(to, from, next) {
    store.commit("auth/toggleAuthDialog", true);
    store.commit("global/setprevRoute", from.fullPath);
    next();
  },

  data() {
    return {};
  },

  computed: {
    authDialog() {
      return this.$store.getters["auth/getAuthDialog"];
    },
    authStatus() {
      return this.$store.getters["auth/getStatus"];
    },
    prevRoute() {
      return this.$store.getters["global/getprevRoute"];
    }
  },
  methods: {
    close() {
      this.$router.push(this.prevRoute);
    }
  }
};
</script>

<style>
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}
</style>
