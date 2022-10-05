import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import useStore from "../store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "root",
    alias: "/home",
    component: HomeView,
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/hands",
    name: "hands",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/HandsView.vue"),
  },
  {
    path: "/pose",
    name: "pose",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PoseView.vue"),
  },
  {
    path: "/holistic",
    name: "holistic",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/HolisticView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = useStore.state.auth.credential !== "";
  const withAuthPages = ["hands", "pose", "holistic"];
  if (
    // check user auth state
    !isAuthenticated &&
    // avoid repeating redirects
    withAuthPages.includes(to.name ?? "")
  ) {
    Vue.$toast.default("Please log in.");
    // redirect to home
    // next({ name: "home" });
  } else {
    next();
  }
});

export default router;
