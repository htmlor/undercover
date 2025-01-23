import { createRouter, createWebHashHistory } from "vue-router";

// const Home = () => import("./view/Home.vue");
// const Setting = () => import("./view/Setting.vue");
// const Game = () => import("./view/Game.vue");
// const Result = () => import("./view/Result.vue");

import Home from "./view/Home.vue";
import Setting from "./view/Setting.vue";
import Game from "./view/Game.vue";
import Result from "./view/Result.vue";

const routes = [
  {
    path: "/",
    component: Home,
    name: "home",
    meta: { level: 1 },
  },
  {
    path: "/setting",
    component: Setting,
    name: "setting",
    meta: { level: 2 },
  },
  {
    path: "/game",
    component: Game,
    name: "game",
    meta: { level: 3 },
  },
  {
    path: "/result",
    component: Result,
    name: "result",
    meta: { level: 4 },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
    meta: { level: 999 },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
