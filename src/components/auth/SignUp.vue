<template>
  <v-card
    class="d-flex flex-column auth-card light-white"
    height="100%"
    width="100%"
    min-height="500px"
  >
    <v-card-title
      class="justify-center align-end jusify-self-end font-weight-medium text-capitalize display-1 flex-grow-1"
    >
      Sign up
    </v-card-title>

    <v-card-text class="flex-grow-1">
      <v-form ref="form" v-model="valid">
        <v-text-field
          flat
          solo-inverted
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          clearable
          required
          validate-on-blur
        ></v-text-field>

        <v-text-field
          flat
          solo-inverted
          validate-on-blur
          type="password"
          v-model="password"
          :rules="passwordRules"
          label="Password"
          required
          clearable
        ></v-text-field>
      </v-form>
      <v-btn
        style="margin-top:10%"
        dark
        block
        depressed
        large
        color="accent"
        @click="validate"
        >Sign Up</v-btn
      >
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="grey--text justify-center py-5">
      Have an account?{{ "&nbsp;" }}
      <span
        class="auth-link font-weight-medium"
        @click.prevent="$router.push({ name: 'login' })"
        >Log in</span
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    password: "",
    passwordRules: [
      v => !!v || "Password is required",
      v =>
        (v && v.length > 5) || "Password length must be at least 6 characters"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ]
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        const { email, password } = this;
        this.$store.dispatch("auth/register", { email, password });
      }
    }
  }
};
</script>
<style lang="scss">
.auth-link {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
