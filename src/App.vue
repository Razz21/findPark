<template>
  <v-app>
    <router-view></router-view>
    <router-view name="dialog"></router-view>
  </v-app>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    /* webkit browsers viewport fix */
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    window.addEventListener("resize", () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    });

    ///* hide loader on page full load */
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.style.display = "none";
    }
  }
};
</script>
<style lang="scss">
html,
body,
#app {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  box-sizing: border-box;
}
html,
body {
  width: 100% !important;
  height: 100% !important;
  scrollbar-width: none;
}

#app {
  overflow: hidden;
  width: 100%;
  position: relative;
  height: 100vh;
  /* webkit browsers viewport fix */
  height: calc(var(--vh, 1vh) * 100);
  height: -webkit-fill-available;
}

::-webkit-scrollbar {
  display: none;
}

/* webkit browsers viewport fix */
.v-application--wrap {
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  min-height: -webkit-fill-available;
}
</style>
