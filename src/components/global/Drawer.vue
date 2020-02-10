<template>
  <v-navigation-drawer
    v-model="drawer"
    style="z-index:200"
    fixed
    temporary
    disable-resize-watcher
    width="300px"
  >
    <template v-slot:prepend>
      <v-card
        dark
        flat
        tile
        color="primary"
        min-height="15vh"
        class="align-end d-flex mb-6"
      >
        <v-card-text class="display-1 text-center">
          FindPark
        </v-card-text>
        <v-list disabled v-if="isAuthenticated">
          <v-list-item>
            <v-list-item-avatar size="60">
              <v-img :src="userImage"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item link two-line>
            <v-list-item-content>
              <v-list-item-title class="title" v-if="user.display_name">
                {{ user.display_name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, idx) in linkItems"
        :key="idx"
        link
        exact
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append v-if="isAuthenticated">
      <div class="pa-2" @click="logout">
        <v-btn block color="accent">Logout</v-btn>
      </div>
    </template>
    <template v-slot:append v-else>
      <div class="pa-2" @click="$router.push({ name: 'signup' })">
        <v-btn block outlined color="accent">Sign Up</v-btn>
      </div>
      <div class="pa-2" @click="$router.push({ name: 'login' })">
        <v-btn block dark color="accent">Login</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { EventBus } from "@/bus";
export default {
  data() {
    return {
      drawer: false,
      authLinkItems: [
        { link: { name: "map" }, icon: "mdi-map", title: "Map" },
        {
          link: { name: "dashboard" },
          icon: "mdi-map-marker-multiple",
          title: "Dashboard"
        }
      ],
      guestLinkItems: [{ link: { name: "map" }, icon: "mdi-map", title: "Map" }]
    };
  },
  computed: {
    user() {
      return this.$store.getters["auth/getUser"];
    },
    userImage() {
      return this.user.photoURL || require("@/assets/default-user.png");
    },
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    linkItems() {
      if (this.isAuthenticated) {
        return this.authLinkItems;
      }
      return this.guestLinkItems;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
    }
  },
  created() {
    EventBus.$on("toggleDrawer", () => {
      this.drawer = !this.drawer;
    });
  }
};
</script>

<style></style>
