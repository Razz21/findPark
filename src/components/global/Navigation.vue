<template>
  <v-app-bar
    color="#165e63"
    dark
    app
    clipped-left
    style="z-index:10; position:relative; flex: 0 0 auto;"
    dense
    tile
    flat
  >
    <v-app-bar-nav-icon
      @click.stop="toggleDrawer"
      v-if="$vuetify.breakpoint.smAndDown"
    ></v-app-bar-nav-icon>
    <div v-if="$vuetify.breakpoint.smAndDown" class="flex-grow-1"></div>

    <v-toolbar-title>
      <router-link
        :to="{ name: 'home' }"
        class="text-capitalize white--text"
        style="text-decoration:none;"
      >
        <span class="font-weight-light">Find Park</span>
      </router-link>
    </v-toolbar-title>

    <div class="flex-grow-1"></div>

    <v-btn icon :to="{ name: 'map' }">
      <v-icon>mdi-map</v-icon>
    </v-btn>

    <template v-if="isAuthenticated">
      <v-btn icon :to="{ name: 'dashboard' }">
        <v-icon>mdi-view-dashboard</v-icon>
      </v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </template>

    <template v-else>
      <v-btn icon :to="{ name: 'login' }">
        <v-icon>mdi-login</v-icon>
      </v-btn>

      <v-btn icon :to="{ name: 'signup' }">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
import { EventBus } from "@/bus";
export default {
  computed: {
    userLoadStatus() {
      return this.$store.getters["auth/getUserLoadStatus"];
    },
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    user() {
      return this.$store.getters["auth/getUser"];
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
    },
    toggleDrawer() {
      EventBus.$emit("toggleDrawer");
    }
  }
};
</script>
<style></style>
