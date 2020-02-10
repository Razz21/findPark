<template>
  <div class="container-fluid home overflow-x-hidden" ref="home" id="home">
    <nav ref="nav" class=" sticky top-0">
      <v-container class="d-flex py-4 px-6 align-baseline">
        <div class="flex-grow-1 accent--text headline">Find<b>Park</b></div>

        <template v-if="isAuthenticated">
          <div class="accent--text mr-4">Hi {{ user.email }}</div>
          <v-btn outlined color="accent" @click="logout">Logout</v-btn>
        </template>
        <template v-else>
          <v-btn outlined color="accent" class="mr-4" :to="{ name: 'signup' }"
            >SingUp</v-btn
          >
          <v-btn depressed color="accent" :to="{ name: 'login' }">Login</v-btn>
        </template>
      </v-container>
    </nav>

    <v-container class="home-content">
      <section id="header">
        <div class="header__content relative" style="z-index:10">
          <div class="header__text">
            <h1
              class="observe-item anim-left-sm"
              :class="{
                'display-2': $vuetify.breakpoint.smAndDown,
                'display-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              Find parking Spots
            </h1>
            <p
              class="observe-item anim-left-sm delay-1 mt-3 font-weight-regular"
              :class="{
                'subtitle-1': $vuetify.breakpoint.smAndDown,
                title: $vuetify.breakpoint.mdAndUp
              }"
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
              assumenda ab velit! Nobis molestiae modi quaerat voluptate vitae
              molestias qui.
            </p>
            <v-btn
              class="observe-item anim-left-sm delay-2 mt-3"
              x-large
              :to="{ name: 'map' }"
              color="accent"
              >Start here</v-btn
            >
          </div>
        </div>
      </section>

      <section id="guide">
        <div class="title">
          <h1 class="observe-item anim-bottom-sm display-3">
            How it works?
          </h1>
        </div>

        <div class="guide__row">
          <div class="guide__image">
            <div class="observe-item anim-right-sm">
              <img src="@/assets/images/parking1.png" />
            </div>
          </div>
          <div class="guide__text">
            <div class=" observe-item anim-left-sm">
              <h3 class="white--text display-2">
                Select location...
              </h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Similique sint reprehenderit esse sit nemo architecto ipsa
                voluptatem praesentium quod dolor, possimus atque, iure
                asperiores corrupti nihil reiciendis unde laborum tempora.
              </p>
            </div>
          </div>
          <div class="skewed-background">
            <div class="observe-item anim-right accent skew-up"></div>
          </div>
        </div>

        <div class="guide__row">
          <div class="guide__image">
            <div class="observe-item anim-left-sm">
              <img src="@/assets/images/parking-variants.png" />
            </div>
          </div>
          <div class="guide__text">
            <div class="observe-item anim-right-sm">
              <h3 class="white--text display-2 ">
                Find best spot...
              </h3>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Quibusdam voluptas repellendus inventore harum maiores
                voluptates temporibus fugit, error enim aliquam.
              </p>
            </div>
          </div>
          <div class="skewed-background">
            <div
              class="observe-item anim-left skew-up"
              style="background-color:#8ab2bd"
            ></div>
          </div>
        </div>

        <div class="guide__row">
          <div class="guide__image">
            <div class=" observe-item anim-right-sm">
              <img src="@/assets/images/parking3.png" />
            </div>
          </div>
          <div class="guide__text">
            <div class=" observe-item anim-left-sm">
              <h3 class="white--text display-2">
                Go...
              </h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                dolorum maxime quos obcaecati, minus inventore! Magni hic
                quibusdam, non distinctio in pariatur libero ducimus
                perferendis!
              </p>
            </div>
          </div>
          <div class="skewed-background">
            <div class="observe-item anim-right skew-up secondary"></div>
          </div>
        </div>
      </section>

      <section style="min-height:200px">
        <div class="left"></div>
        <div class="right"></div>
      </section>
    </v-container>
    <v-footer padless dark>
      <v-container>
        <div class="d-flex justify-center align-center">
          <v-btn dark href="#header" icon
            ><v-icon>mdi-chevron-up</v-icon></v-btn
          >
        </div>
        <v-divider dark class="my-4"></v-divider>
        <div class="d-flex flex-wrap content">
          <div>
            <h4>Company</h4>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Aspernatur expedita quos modi officiis nihil eveniet consequatur
              ipsam adipisci harum deleniti eaque ullam maxime quo enim iure,
              beatae rerum sunt quae.
            </p>
          </div>

          <div>
            <h4>Guides</h4>
            <router-link to="#">
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Tempora, repellat.
              </p>
            </router-link>
          </div>

          <div>
            <h4>Policies</h4>
            <router-link to="#">
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Tempora, repellat.
              </p>
            </router-link>
          </div>
        </div>
        <v-divider dark class="my-4"></v-divider>
        <div class="d-flex justify-center align-baseline grey--text ">
          <div class="headline">Find<b>Park</b>&nbsp;&copy;&nbsp;</div>
          <div>
            {{ new Date().getFullYear() }}
          </div>
        </div>
      </v-container>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {};
  },
  computed: {
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
    }
  },

  mounted() {
    const items = document.querySelectorAll(".observe-item");

    function handleIntersection(entries, observer) {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          entry.target.setAttribute("data-observable", true);
          observer.unobserve(entry.target);
        }
      });
    }
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 0.3
    });
    items.forEach(obs => {
      observer.observe(obs);
    });

    const nav = this.$refs.nav;
    const page = this.$refs.home;
    const scrollhandler = e => {
      if (page.scrollTop > nav.clientHeight) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };
    page.addEventListener("scroll", scrollhandler);
    this.$once("hook:destroyed", () => {
      page.removeEventListener("scroll", scrollhandler);
    });
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

%bottom-shadow {
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}

.home {
  position: relative;
  height: 100vh;
  overflow-y: scroll;
  scroll-behavior: smooth;
  z-index: 2;
  background-color: $primary;
  .container {
    @include mediaXl {
      max-width: 1300px;
    }
  }
}

nav {
  z-index: 1000;
  top: 0;
  transition: all 0.5s ease;
  position: relative;

  &.scrolled {
    @extend %bottom-shadow;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(20px);
  }
}

footer {
  padding-bottom: 3rem;
  background-color: #252728 !important;
  min-height: 100px;
  bottom: 0;
  z-index: 0;
  width: 100%;
  color: $white-color;
  h4 {
    text-transform: uppercase;
    opacity: 0.8;
  }
  p {
    opacity: 0.8;
  }
  a {
    color: $white-color !important;
    text-decoration: none;
  }
  .content {
    div {
      padding: 1rem;
      flex: 1 250px;
    }
  }
}

section {
  position: relative;
}

.skewed-background {
  position: absolute;
  display: grid;
  grid-template-rows: 1;
  grid-template-columns: 1;
  height: 100%;
  width: 100vw;
  z-index: 0;
  > div {
    grid-area: 1/1;
    @extend %bottom-shadow;
    &.skew-down {
      transform: skew(0, 2deg);
      position: relative;
    }
    &.skew-on-top {
      z-index: 1;
    }
    &.skew-up {
      // height: 100%;
      transform: skew(0, -2deg);
      position: relative;
    }
  }
}

/* ================ observable =============== */
$maps: (
  x: (
    left: -1,
    right: 1
  ),
  y: (
    top: -1,
    bottom: 1
  )
);

$variants: (
  sm: 20
);

$anim-prefix: slide;

@mixin animations-factory(
  $maps,
  $variants: (),
  $default: 100,
  $unit: "%",
  $prefix
) {
  @each $direction, $sides in $maps {
    @each $side, $multiplier in $sides {
      /* default */
      @keyframes #{$prefix}-#{$side} {
        from {
          transform: translate#{$direction}#{"("} (#{$default * $multiplier}) + unquote(
              $unit
            ) #{")"};
          opacity: 0;
        }
      }
      /* variants */
      @each $size, $val in $variants {
        @keyframes #{$prefix}-#{$side}-#{$size} {
          from {
            transform: translate#{$direction}#{"("} (#{$val * $multiplier}) + unquote(
                $unit
              ) #{")"};
            opacity: 0;
          }
        }
      }
    }
  }
}

@mixin create-animation-names($maps, $variants: (), $prefix) {
  @each $_, $sides in $maps {
    @each $side, $_ in $sides {
      &.anim-#{$side} {
        animation-name: #{$anim-prefix}-#{$side};
      }
      @each $size, $val in $variants {
        &.anim-#{$side}-#{$size} {
          animation-name: #{$anim-prefix}-#{$side}-#{$size};
        }
      }
    }
  }
}

@include animations-factory($maps, $variants, $prefix: $anim-prefix);

@mixin anim-delays($max: 3, $val: 0.2s) {
  @for $i from 1 through $max {
    &.delay-#{$i} {
      animation-delay: $i * $val;
    }
  }
}

.observe-item {
  opacity: 0;
  &[data-observable] {
    animation-duration: 0.5s;
    animation-timing-function: ease;
    animation-fill-mode: forwards;
    @include anim-delays;
    @include create-animation-names($maps, $variants, $anim-prefix);
    opacity: 1;
  }
}

/* ================ sections =============== */

#header {
  height: 100%;

  .header {
    &__content {
      height: 100%;
      padding: 1rem;
      display: flex;
      align-items: flex-start;
      background-image: url("../assets/images/landing-top.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: right bottom;
      padding-bottom: 200px;
      @include mediaSmAndUp {
        background-size: 70%;
      }
    }

    &__text {
      width: 100%;
      max-width: 500px;
      color: $white-color;
    }
  }
}

#guide {
  > .title {
    padding: 3rem 1rem;
    text-align: center;
    h1 {
      color: $white-color;
    }
  }
  .guide {
    &__row {
      padding: 1rem;
      display: flex;
      flex-wrap: wrap;
      position: relative;

      &:nth-child(odd) {
        flex-direction: row-reverse;
        .guide__text {
          text-align: start !important;
          align-items: start;
        }
      }
    }
    &__image {
      height: 300px;
      flex: 1 0 100%;
      display: flex;
      justify-content: center !important;
      z-index: 10;

      &:nth-child(odd) {
        order: 1;
      }

      &:nth-child(2) {
        // height: 400px;
        justify-content: flex-end;
      }
      @include mediaSmAndUp {
        flex: 1 0 50%;
        &:nth-child(2) {
          order: -1;
        }
      }

      > div {
        height: 100%;
        width: 100%;
        position: relative;
        max-width: 500px;
        display: flex;
        justify-content: center;
        > img {
          display: block;
          // position: absolute;
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;

          object-fit: contain;
        }
      }
    }
    &__text {
      z-index: 10;
      padding: 1rem;
      flex: 1 0 100%;
      text-align: end;
      display: flex;
      flex-direction: column;
      // align-items: center;
      text-justify: newspaper;
      justify-content: center;
      align-items: flex-end;
      color: $white-color;

      > div {
        max-width: 400px;
      }
      p {
        opacity: 0.9;
      }
      @include mediaSmAndUp {
        flex-basis: 50%;
      }
    }
  }
}
</style>
