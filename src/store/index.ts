import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import authModule from "./modules/auth";
import { RootState } from "./types";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
});

const store = new Vuex.Store<RootState>({
  modules: {
    auth: authModule,
  },
  plugins: [vuexLocal.plugin],
});

export default store;

// export default new Vuex.Store({
//   state: {},
//   getters: {},
//   mutations: {},
//   actions: {},
//   modules: {
//     auth: authModule,
//   },
//   plugins: [new VuexPersistence().plugin],
// });
