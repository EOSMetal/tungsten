<template>
  <div class="content">
    <section class="call-to-action-section">
      <div class="w-container">
        <div class="w-row">
          <div class="column w-col w-col-8">
            <h1 class="brand-text page-title">Dashboard</h1>
            <h2 class="page-subtitle">View your bonds here</h2>
          </div>
          <div class="align-right w-col w-col-4">
            <router-link :to="{name: 'createBond'}" class="navy-button white">Create New Bond</router-link>
          </div>
        </div>
      </div>
    </section>
    <section id="Dashboard" class="section">
      <div class="container w-container">
        <div class="columns-2 w-row">
          <div v-for="bond in bonds" :key="bond.name" class="column-4 w-col w-col-4">
            <div class="bond-block">
              <h2 class="bond-creator">{{bond.creator}}</h2>
              <h2 class="bond-name-title">{{bond.name}}</h2>
              <h2 class="bond-value">{{bond.deposit}}</h2>
              <h2 class="bond-expire">{{bond.expiration | date}}</h2>
              <router-link :to="{name: 'viewBond', params: {name: bond.name}}" class="view-bond">
                Manage Bond
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      bonds: []
    };
  },
  computed: {
    ...mapState(["config"])
  },
  filters: {
    date: ts => moment(parseInt(ts)).fromNow()
  },
  async mounted() {
    this.bonds = (await this.$eos.getTableRows({
      json: true,
      code: this.config.contractAccount,
      scope: this.config.contractAccount,
      table: "bonds"
    })).rows;
  }
};
</script>
