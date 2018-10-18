import Vue from "vue";
import Vuex from "vuex";
import ScatterJS from "scatter-js/dist/scatter.cjs";
import initEos from "./eos";
import eosjs from "eosjs";

const { network, eos } = initEos(Vue);
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: {
      network,
      contractAccount: process.env.VUE_APP_CONTRACT_ACCOUNT || "tungstenbond"
    },
    account: null,
    balance: null,
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
    setBalance(state, balance) {
      state.balance = balance;
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

      await Promise.all([
        dispatch("loadActiveAuthority"),
        dispatch("loadBalance")
      ]);
    },
    async loadBalance({ state, commit }) {
      try {
        commit(
          "setBalance",
          (await eos.getCurrencyBalance(
            "eosio.token",
            state.account.name,
            "EOS"
          ))[0] || "0.0000 EOS"
        );
      } catch (error) {
        Vue.notify({
          type: "error",
          title: "Error",
          text: "Unable to load account balance"
        });
      }
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
    async closeBond({ state, commit, dispatch }, bond) {
      try {
        await eos.scatter.transaction(state.config.contractAccount, tr => {
          tr.closebond(bond.name);
        });
        commit("setBond", null);
        await dispatch("loadBalance");
      } catch (error) {
        Vue.notify({
          type: "error",
          title: "Error",
          text: eos.extractErrorMessage(error)
        });
        throw error;
      }
    },
    async closeClaim({ state, commit, dispatch }, claim) {
      try {
        await eos.scatter.transaction(state.config.contractAccount, tr => {
          tr.closeclaim(claim.name);
        });
        commit("setClaim", null);
        await dispatch("loadBalance");
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
    },
    async ruleClaim(
      { state, commit, dispatch },
      { claim, authorize, details }
    ) {
      try {
        await eos.scatter.transaction(state.config.contractAccount, tr => {
          tr.ruleclaim(claim.name, authorize ? 1 : 0, details);
        });
        commit("setClaim", null);
        await dispatch("loadBalance");
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
