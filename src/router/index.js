import Vue from "vue";
import Router from "vue-router";
import Layout from "@/pages/Layout.vue";
import store from "@/store";

/* auth wrapper components must be loaded before use in separete view */
import AuthDialog from "@/components/auth/AuthDialog.vue";
import DirectView from "@/components/auth/DirectView.vue";
const Login = () => import("@/components/auth/Login.vue");
const SignUp = () => import("@/components/auth/SignUp.vue");

/* Error "NavigationDuplicated" */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

Vue.use(Router);

const beforeAuthEnter = (to, from, next) => {
  // load fullpage auth component, if no previous page registered
  if (!from.name) {
    to.matched[0].components = {
      default: DirectView,
      dialog: false
    };

    // load auth dialog component
  } else {
    // display dialog in separate named view,
    // copy previous path component and display it behind dialog in default named view
    if (from.matched.length > 2) {
      const childrenView = from.matched.slice(2, from.matched.length);
      for (let view of childrenView) {
        to.matched.push(view);
      }
    }
    if (to.matched[0].components) {
      to.matched[0].components.default = from.matched[0].components.default;
      to.matched[1].components.default = from.matched[1].components.default;
      to.matched[0].components.dialog = AuthDialog;
    }
  }

  next();
};

Vue.use(Router);

const router = new Router({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes: [
    {
      path: "/auth",
      children: [
        {
          path: "/login",
          name: "login",
          beforeEnter: beforeAuthEnter,
          components: { auth: Login },
          meta: {
            guest: true
          }
        },
        {
          path: "/signup",
          name: "signup",
          beforeEnter: beforeAuthEnter,
          components: { auth: SignUp },
          meta: {
            guest: true
          }
        }
      ]
    },

    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/pages/Home.vue")
        },
        {
          path: "/map",
          name: "map",
          component: () => import("@/pages/MapLayout.vue")
        },
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/pages/Dashboard.vue"),
          redirect: { name: "places" },
          children: [
            {
              path: "places",
              name: "places",
              component: () => import("@/pages/Places.vue"),
              meta: {
                requiresAuth: true,
                breadcrumb: [
                  { text: "Dashboard", disabled: true },
                  { text: "Places" }
                ]
              }
            },
            {
              path: "places/new",
              name: "newplace",
              component: () => import("@/pages/NewPlace.vue"),
              meta: {
                requiresAuth: true,
                breadcrumb: [
                  { text: "Dashboard", disabled: true },
                  {
                    text: "Places",
                    to: { name: "places" },
                    disabled: false,
                    exact: true
                  },
                  { text: "New" }
                ]
              }
            },
            {
              path: "places/edit/:editId",
              name: "editplace",
              component: () => import("@/pages/NewPlace.vue"),
              meta: {
                requiresAuth: true,
                breadcrumb: [
                  { text: "Dashboard", disabled: true },
                  {
                    text: "Places",
                    to: { name: "places" },
                    disabled: false,
                    exact: true
                  },
                  { text: "Edit" }
                ]
              }
            },
            {
              path: "settings",
              name: "settings",
              component: () => import("@/pages/Settings.vue"),
              meta: {
                requiresAuth: true,
                breadcrumb: [
                  { text: "Dashboard", exact: false, disabled: true },
                  { text: "Settings", exact: true }
                ]
              }
            }
          ]
        }
      ]
    },
    { path: "*", redirect: { name: "home" } }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const guest = to.matched.some(record => record.meta.guest);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  const isAuthenticated = store.getters["auth/isAuthenticated"];

  // access only for guests; redirect to home page if authenticated
  if (guest && isAuthenticated) {
    next({ name: "home" });
  }
  // access only for authenticated users
  else if (requiresAuth && !isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath.slice(1) } });
  } else {
    next();
  }
});

export default router;
