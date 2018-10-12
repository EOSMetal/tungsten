import Vue from "vue";
import Vuex from "vuex";

import ScatterJS from "scatter-js/dist/scatter.cjs";
import eosjs from "eosjs";

Vue.use(Vuex);

const network = {
  local: {
    protocol: "http",
    host: "localhost",
    port: 8888,
    chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
  },
  jungle: {
    protocol: "http",
    host: "jungle.eosmetal.io",
    port: 18888,
    chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
  }
}[process.env.VUE_APP_EOSIO_NETWORK || "local"];

export default new Vuex.Store({
  state: {
    config: {
      network,
      contractAccount: process.env.VUE_APP_CONTRACT_ACCOUNT || "tungstenbond"
    },
    eos: eosjs({
      chainId: network.chainId,
      httpEndpoint: `${network.protocol}://${network.host}:${network.port}`
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
    async pairScatter({ state, commit }) {
      const network = { blockchain: "eos", ...state.config.network };

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
    logOut({ commit }) {
      commit("setScatterEos", null);
      commit("setAccount", null);
    },
    async loadBond({ state, commit }, bondName) {
      commit("startLoadingBond");
      commit("setBond", null);
      const bond = (await state.eos.getTableRows({
        json: true,
        code: state.config.contractAccount,
        scope: state.config.contractAccount,
        table: "bonds",
        lower_bound: bondName,
        limit: 1
      })).rows[0];
      if (bond && bond.name === bondName) {
        commit("setBond", bond);
      }
      commit("finishLoadingBond");
    },
    async grantPermission({ state }) {
      const accountInfo = await state.eos.getAccount({
        account_name: state.account.name
      });
      const authority = accountInfo.permissions.find(
        p => p.perm_name === "active"
      ).required_auth;
      authority.accounts.push({
        permission: {
          actor: state.config.contractAccount,
          permission: "eosio.code"
        },
        weight: authority.threshold
      });
      await state.scatterEos.updateauth(
        state.account.name,
        "active",
        "owner",
        authority
      );
    }
  }
});
