<template>
  <v-card
    style="height:100%;display:flex; flex-direction:column;overflow:hidden"
    tile
    id="main"
    :class="{ 'no-transitions': !animations }"
  >
    <v-card tile style="overflow-y:auto;flex: 0 1 auto; " class="cont" flat>
      <v-content class="cont" style="padding-top:0">
        <v-container fluid class="pa-0 ma-0 cont">
          <v-scroll-x-transition hide-on-leave leave-absolute>
            <router-view />
          </v-scroll-x-transition>
        </v-container>
      </v-content>
    </v-card>
  </v-card>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {
    loadingPage() {
      return this.$store.getters["global/getLoadingStatus"];
    },
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    animations() {
      return this.$store.getters["global/getSettings"].animations;
    }
  },
  watch: {}
};
</script>

<style lang="scss">
.cont {
  width: 100% !important;
  height: 100% !important;
}

#main.no-transitions * {
  transition: none !important;
  -o-transition: none !important;
  -moz-transition: none !important;
  -webkit-transition: none !important;
}
.map {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.fill-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}
</style>
