import Vue from "vue";
import VueRouter from "vue-router";
import DeviceSpecificDashboard from "../views/DeviceSpecificDashboard.vue";

Vue.use(VueRouter);

// tslint:disable-next-line:typedef
const routes = [
  {
    path: "/",
    name: "dashboard",
    component: DeviceSpecificDashboard
  },
  {
    path: "/devices",
    name: "deviceoverview",
    component: () =>
      import(
        /* webpackChunkName: "generic-device-overview" */ "../views/GenericDeviceOverview.vue"
      )
  },
  {
    path: "/values",
    name: "valueoverview",
    component: () =>
      import(
        /* webpackChunkName: "generic-value-overview" */ "../views/GenericValueOverview.vue"
      )
  },
  {
    path: "/wstest",
    name: "wstest",
    component: () =>
      import(
        /* webpackChunkName: "websocket-test" */ "../views/WebsocketTest.vue"
      )
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router: VueRouter = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
