import Vue from "vue";
import Vuex from "vuex";

import ScatterJS from "scatter-js/dist/scatter.cjs";
import eosjs from "eosjs";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    eos: eosjs({
      chainId:
        "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
    }),
    scatterEos: null,
    account: null,
    bond: null,
    loadingBond: true
  },
  mutations: {
    setScatterEos(state, eos) {
      state.scatterEos = eos;
    },
    setAccount(state, account) {
      state.account = account;
    },
    setBond(state, bond) {
      state.bond = bond;
    },
    startLoadingBond(state) {
      state.loadingBond = true;
    },
    finishLoadingBond(state) {
      state.loadingBond = false;
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
      commit("setScatterEos", eos);
    },
    async loadBond({ state, commit }, bondName) {
      commit("startLoadingBond");
      commit("setBond", null);
      const bond = (await state.eos.getTableRows({
        json: true,
        code: "tungsten",
        scope: "tungsten",
        table: "bonds",
        lower_bound: bondName,
        limit: 1
      })).rows[0];
      if (bond && bond.name === bondName) {
        commit("setBond", bond);
      }
      commit("finishLoadingBond");
    }
  }
});
