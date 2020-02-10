<template>
  <div>
    <v-toolbar>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        v-if="$vuetify.breakpoint.mdAndDown"
      ></v-app-bar-nav-icon>
      <v-breadcrumbs :items="breadcrumbs" divider=">">
        <!-- <v-breadcrumbs-item
          slot="item"
          slot-scope="{ item }"
          exact
          :to="item.to"
        >
          {{ item.text }}
        </v-breadcrumbs-item> -->
      </v-breadcrumbs>
    </v-toolbar>
    <v-navigation-drawer app v-model="drawer" clipped mobile-break-point="960">
      <v-list>
        <template v-for="(item, index) in linkItems">
          <v-subheader
            class="text-capitalize mt-3 mb-1"
            style="height:auto"
            v-if="item.header"
            :key="item.header"
            v-text="item.header"
          ></v-subheader>

          <v-divider
            v-else-if="item.divider"
            :key="index"
            :inset="item.inset"
          ></v-divider>

          <v-list-item v-else :key="index" :to="item.link" exact>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <router-view></router-view>
  </div>
</template>

<script>
import accountModule from "@/store/modules/account";
export default {
  created() {
    this.$store.registerModule("account", accountModule);
  },
  beforeDestroy() {
    this.$store.unregisterModule("account");
  },
  data() {
    return {
      drawer: true,
      linkItems: [
        { link: { name: "map" }, title: "Map" },
        { header: "My locations" },
        {
          link: { name: "places" },
          title: "All Locations"
        },
        {
          link: { name: "newplace" },
          title: "New Location"
        },
        { link: { name: "settings" }, title: "Settings" }
      ],
      breadcrumbs: []
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.breadcrumbs = this.$route.meta.breadcrumb;
      }
    }
  }
};
</script>

<style></style>
