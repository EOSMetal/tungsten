import Vue from "vue";
import Vuex from "vuex";
import ScatterJS from "scatter-js/dist/scatter.cjs";
import eosjs from "eosjs";

const network = {
  local: {
    protocol: "http",
    host: "localhost",
    port: 8888,
    chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
  },
  jungle: {
    protocol: "https",
    host: "api.jungle.alohaeos.com",
    port: 443,
    chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
  }
}[process.env.VUE_APP_EOSIO_NETWORK || "local"];

const eos = eosjs({
  chainId: network.chainId,
  httpEndpoint: `${network.protocol}://${network.host}:${network.port}`
});
eos.scatter = null;

Vue.mixin({
  beforeCreate() {
    this.$eos = eos;
  }
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: {
      network,
      contractAccount: process.env.VUE_APP_CONTRACT_ACCOUNT || "tungstenbond"
    },
    account: null,
    bond: null,
    loadingBond: true,
    claim: null,
    loadingClaim: true
  },
  mutations: {
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
    },
    setClaim(state, claim) {
      state.claim = claim;
    },
    startLoadingClaim(state) {
      state.loadingClaim = true;
    },
    finishLoadingClaim(state) {
      state.loadingClaim = false;
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

      eos.scatter = scatter.eos(network, eosjs, {
        authorization: `${account.name}@${account.authority}`,
        expireInSeconds: 60
      });
    },
    logOut({ commit }) {
      eos.scatter = null;
      commit("setAccount", null);
    },
    async loadBond({ state, commit }, bondName) {
      commit("startLoadingBond");
      commit("setBond", null);
      const bond = (await eos.getTableRows({
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
    async loadClaim({ state, commit }, claimName) {
      commit("startLoadingClaim");
      commit("setClaim", null);
      const claim = (await eos.getTableRows({
        json: true,
        code: state.config.contractAccount,
        scope: state.config.contractAccount,
        table: "claims",
        lower_bound: claimName,
        limit: 1
      })).rows[0];
      if (claim && claim.name === claimName) {
        commit("setClaim", claim);
      }
      commit("finishLoadingClaim");
    },
    async grantPermission({ state }) {
      const accountInfo = await eos.getAccount({
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
      await eos.scatter.updateauth(
        state.account.name,
        "active",
        "owner",
        authority
      );
    }
  }
});
