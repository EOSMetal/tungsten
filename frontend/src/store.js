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
    host: "jungle.eosmetal.io",
    port: 18889,
    chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
  }
}[process.env.VUE_APP_EOSIO_NETWORK || "local"];

const eos = eosjs({
  chainId: network.chainId,
  httpEndpoint: `${network.protocol}://${network.host}:${network.port}`
});
eos.scatter = null;
eos.extractErrorMessage = error => {
  let message;
  if (typeof error === "string") {
    const parsedError = JSON.parse(error);
    if (parsedError.error) {
      message = parsedError.error.details[0].message;
    } else {
      message = parsedError.message;
    }
  } else {
    message = error.message;
  }
  return message.charAt(0).toUpperCase() + message.slice(1);
};

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
    activeAuthority: null,
    loadingActiveAuthority: true,
    bond: null,
    loadingBond: true,
    claim: null,
    loadingClaim: true
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
    setActiveAuthority(state, authority) {
      state.activeAuthority = authority;
    },
    setLoadingActiveAuthority(state, loading) {
      state.loadingActiveAuthority = loading;
    },
    setBond(state, bond) {
      state.bond = bond;
    },
    setLoadingBond(state, loading) {
      state.loadingBond = loading;
    },
    setClaim(state, claim) {
      state.claim = claim;
    },
    setLoadingClaim(state, loading) {
      state.loadingClaim = loading;
    }
  },
  getters: {
    activeAuthorityContractEntry(state) {
      return !state.activeAuthority
        ? undefined
        : state.activeAuthority.accounts.find(
            a =>
              a.permission.actor === state.config.contractAccount &&
              a.permission.permission === "eosio.code"
          );
    },
    hasGrantedPermission(state, getters) {
      const contractEntry = getters.activeAuthorityContractEntry;
      return (
        contractEntry && contractEntry.weight >= state.activeAuthority.threshold
      );
    }
  },
  actions: {
    async pairScatter({ state, commit, dispatch }) {
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

      await dispatch("loadActiveAuthority");
    },
    async loadActiveAuthority({ state, commit }) {
      commit("setLoadingActiveAuthority", true);
      commit("setActiveAuthority", null);
      const accountInfo = await eos.getAccount({
        account_name: state.account.name
      });
      const authority = accountInfo.permissions.find(
        p => p.perm_name === "active"
      ).required_auth;
      commit("setActiveAuthority", authority);
      commit("setLoadingActiveAuthority", false);
    },
    logOut({ commit }) {
      eos.scatter = null;
      commit("setAccount", null);
    },
    async loadBond({ state, commit }, bondName) {
      commit("setLoadingBond", true);
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
      commit("setLoadingBond", false);
    },
    async loadClaim({ state, commit }, claimName) {
      commit("setLoadingClaim", true);
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
      commit("setLoadingClaim", false);
    },
    async grantPermission({ state, dispatch, getters }) {
      // Ensure we have a fresh copy
      await dispatch("loadActiveAuthority");
      const authority = { ...state.activeAuthority };
      const contractEntry = getters.activeAuthorityContractEntry;

      if (contractEntry) {
        authority.accounts = [
          ...authority.accounts.filter(a => a !== contractEntry),
          {
            ...contractEntry,
            weight: authority.threshold
          }
        ];
      } else {
        authority.accounts = [
          ...authority.accounts,
          {
            permission: {
              actor: state.config.contractAccount,
              permission: "eosio.code"
            },
            weight: authority.threshold
          }
        ];
      }

      try {
        await eos.scatter.updateauth(
          state.account.name,
          "active",
          "owner",
          authority
        );
        await dispatch("loadActiveAuthority");
      } catch (error) {
        Vue.notify({
          type: "error",
          title: "Error",
          text: eos.extractErrorMessage(error)
        });
        throw error;
      }
    },
    async removePermission({ state, dispatch, getters }) {
      const authority = {
        ...state.activeAuthority,
        accounts: state.activeAuthority.accounts.filter(
          a => a !== getters.activeAuthorityContractEntry
        )
      };

      try {
        await eos.scatter.updateauth(
          state.account.name,
          "active",
          "owner",
          authority
        );
        await dispatch("loadActiveAuthority");
      } catch (error) {
        Vue.notify({
          type: "error",
          title: "Error",
          text: eos.extractErrorMessage(error)
        });
        throw error;
      }
    },
    async renewBond({ state, commit }, { bond, expiration }) {
      try {
        await eos.scatter.transaction(state.config.contractAccount, tr => {
          tr.renewbond(bond.name, expiration);
        });
        commit("setBond", { ...bond, expiration });
      } catch (error) {
        Vue.notify({
          type: "error",
          title: "Error",
          text: eos.extractErrorMessage(error)
        });
        throw error;
      }
    },
    async closeBond({ state, commit }, bond) {
      try {
        await eos.scatter.transaction(state.config.contractAccount, tr => {
          tr.closebond(bond.name);
        });
        commit("setBond", null);
      } catch (error) {
        Vue.notify({
          type: "error",
          title: "Error",
          text: eos.extractErrorMessage(error)
        });
        throw error;
      }
    },
    async closeClaim({ state, commit }, claim) {
      try {
        await eos.scatter.transaction(state.config.contractAccount, tr => {
          tr.closeclaim(claim.name);
        });
        commit("setClaim", null);
      } catch (error) {
        Vue.notify({
          type: "error",
          title: "Error",
          text: eos.extractErrorMessage(error)
        });
        throw error;
      }
    },
    async delayClaim({ state, dispatch }, claim) {
      try {
        await eos.scatter.transaction(state.config.contractAccount, tr => {
          tr.delayclaim(claim.name);
        });
        dispatch("loadClaim", claim.name);
      } catch (error) {
        Vue.notify({
          type: "error",
          title: "Error",
          text: eos.extractErrorMessage(error)
        });
        throw error;
      }
    }
  }
});
