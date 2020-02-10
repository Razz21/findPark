<template>
  <v-container
    fluid
    fill-height
    class="justify-center text-center animated-background d-flex align-center"
    style="position:relative"
  >
    <v-btn
      id="btn-back"
      style="top:20px;left:20px;position:absolute;z-index:2"
      class="absolute"
      dark
      depressed
      :icon="$vuetify.breakpoint.xs"
      outlined
      color="accent"
      :to="{ name: 'home' }"
    >
      <v-icon>mdi-chevron-left</v-icon>
      <span v-if="$vuetify.breakpoint.smAndUp">
        Start
      </span>
    </v-btn>
    <v-card flat class="auth-wrapper" :loading="authStatus === 1">
      <template v-slot:progress>
        <v-progress-linear
          top
          absolute
          color="accent"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>
      <router-view name="auth"></router-view>
    </v-card>
  </v-container>
</template>

<script>
export default {
  computed: {
    authStatus() {
      return this.$store.getters["auth/getStatus"];
    }
  }
};
</script>

<style lang="scss">
#btn-back {
  & > span.v-btn__content {
    color: $white-color;
    @include mediaXs {
      color: $accent;
    }
  }
}
</style>
