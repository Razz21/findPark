<template>
  <v-card
    raised=""
    class="d-flex flex-column auth-card light-white"
    height="100%"
    width="100%"
    min-height="500px"
  >
    <v-card-title
      class="justify-center align-end jusify-self-end font-weight-medium display-1 text-capitalize flex-grow-1"
    >
      Login
    </v-card-title>

    <v-card-text class="">
      <v-form
        @submit.prevent="validate"
        lazy-validation
        ref="form"
        v-model="valid"
        validate-on-blur
      >
        <v-text-field
          flat
          solo-inverted
          validate-on-blur
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
          clearable
        ></v-text-field>

        <v-text-field
          flat
          solo-inverted
          type="password"
          v-model="password"
          :rules="passwordRules"
          label="Password"
          required
          clearable
        ></v-text-field>
        <input type="submit" hidden />
      </v-form>
      <div style="margin:5% 0">
        <v-btn dark block depressed large color="accent" @click="validate"
          >Log in</v-btn
        >
      </div>
    </v-card-text>

    <v-card-text class="flex-grow-1 flex-shrink-0 d-flex flex-column">
      <div class="divide text-uppercase body-2">OR</div>
      <div class="d-flex justify-space-around">
        <v-btn
          fab
          depressed
          dark
          v-for="btn in buttons"
          :key="btn.name"
          :color="btn.color"
          @click="socialLogin(btn.val)"
        >
          <v-icon>mdi-google</v-icon>
        </v-btn>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="grey--text justify-center py-5">
      Don’t have an account yet?{{ "&nbsp;" }}
      <span
        class="auth-link font-weight-medium"
        @click.prevent="$router.push({ name: 'signup' })"
        >Sign up</span
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      password: "",
      passwordRules: [
        v => !!v || "Password is required"
        //   v => (v && v.length <= 10) || "Password must be less than 10 characters"
      ],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      buttons: [
        {
          name: "Google",
          icon: "mdi-google",
          val: "google",
          color: "#DB4437",
          disabled: false
        }
        // {
        //   name: "Github",
        //   icon: "mdi-github-box",
        //   val: "github",
        //   color: "#333333",
        //   disabled: true
        // }
      ]
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        const { email, password } = this;
        this.$store.dispatch("auth/login", { email, password });
      }
    },
    socialLogin(val) {
      this.$store.dispatch("auth/socialLogin", val);
    }
  }
};
</script>

<style lang="scss">
.divide {
  display: flex;
  align-items: center;
  color: rgba(126, 126, 126, 0.788);
  width: 100%;
  margin-bottom: 10px;
  &::before,
  &::after {
    content: "";
    flex: 1;
    background: rgba(126, 126, 126, 0.788);
    height: 1px;
    font-size: 0px;
    line-height: 0px;
  }
  &::before {
    margin-right: 8px;
  }
  &::after {
    margin-left: 8px;
  }
}

.auth-card {
  overflow: hidden;
  & .v-card__text {
    padding: 10px 7%;
    justify-content: space-evenly;
  }
}
</style>
