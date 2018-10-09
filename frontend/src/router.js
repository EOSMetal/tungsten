import Vue from "vue";
import Router from "vue-router";

import Layout from "./views/Layout.vue";
import NotFound from "./views/NotFound.vue";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Bonds from "./views/Bonds.vue";
import CreateBond from "./views/CreateBond.vue";
import ViewBond from "./views/ViewBond.vue";
import CreateClaim from "./views/CreateClaim.vue";
import ViewClaim from "./views/ViewClaim.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Layout,
      redirect: { name: "home" },
      children: [
        {
          path: "",
          name: "home",
          component: Home
        },
        {
          path: "about",
          name: "about",
          component: About
        },
        {
          path: "bonds",
          name: "bonds",
          component: Bonds
        },
        {
          path: "bonds/new",
          name: "createBond",
          component: CreateBond
        },
        {
          path: "bonds/:name",
          name: "viewBond",
          component: ViewBond
        },
        {
          path: "bonds/:bondName/claim",
          name: "createClaim",
          component: CreateClaim
        },
        {
          path: "claims/:name",
          name: "viewClaim",
          component: ViewClaim
        }
      ]
    },
    {
      path: "*",
      component: Layout,
      children: [
        {
          path: "*",
          name: "notFound",
          component: NotFound
        }
      ]
    }
  ]
});
