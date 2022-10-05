import { Module } from "vuex";

const authModule: Module<any, any> = {
  state: {
    // uuid: "",
    credential: "",
  },
  getters: {
    credential(state: any): string {
      return state.credential;
    },
  },
  mutations: {
    login(state: any, payload) {
      // state.uuid = payload.uuid;
      state.credential = payload.credential;
    },
  },
  actions: {
    login(context, payload) {
      context.commit("login", payload);
    },
  },
};

export default authModule;
