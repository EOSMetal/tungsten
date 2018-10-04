import Vue from "vue";
import Vuex from "vuex";

import ScatterJS from "scatter-js/dist/scatter.cjs";
import eosjs from "eosjs";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    publicEos: eosjs({
      chainId:
        "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
    }),
    eos: null,
    account: null
  },
  mutations: {
    setEos(state, eos) {
      state.eos = eos;
    },
    setAccount(state, account) {
      state.account = account;
    }
  },
  actions: {
    async pairScatter({ commit }) {
      const network = {
        blockchain: "eos",
        protocol: "http",
        host: "localhost",
        port: 8888,
        chainId:
          "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
      };

      const connected = await ScatterJS.scatter.connect("Tungsten");
      if (!connected) return false;

      const scatter = ScatterJS.scatter;
      await scatter.getIdentity({ accounts: [network] });
      const account = scatter.identity.accounts.find(
        a => a.blockchain === "eos"
      );
      commit("setAccount", account);

      const eos = scatter.eos(network, eosjs, { expireInSeconds: 60 });
      commit("setEos", eos);
    }
  }
});
