import Vue from "vue";
import VueRouter from "vue-router";
import MyHome from "../views/MyHome.vue";
import ValueDashboard from "../views/ValueDashboard.vue";

Vue.use(VueRouter);

// tslint:disable-next-line:typedef
const routes = [
  {
    path: "/",
    name: "myhome",
    component: MyHome
  },
  {
    path: "/values",
    name: "valuedashboard",
    component: ValueDashboard
  },
  {
    path: "/wstest",
    name: "wstest",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/WebsocketTest.vue")
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

// tslint:disable-next-line:typedef
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
