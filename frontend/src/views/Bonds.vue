<template>
  <div class="content">
    <section class="call-to-action-section">
      <div class="w-container">
        <div class="w-row">
          <div class="column w-col w-col-8">
            <h1 class="brand-text page-title">Active Bonds</h1>
            <h2 class="page-subtitle">View active bonds here</h2>
            <div class="page-subtitle">
              Search <input type="text" v-model="searchQuery" class="search-input">
            </div>
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
          <div v-for="bond in filteredBonds" :key="bond.name" class="column-4 w-col w-col-4">
            <div class="bond-block">
              <h2 class="bond-creator">{{bond.creator}}</h2>
              <h2 class="bond-name-title">
                <router-link :to="{name: 'viewBond', params: {name: bond.name}}" class="view-bond">
                  {{bond.name}}
                </router-link>
              </h2>
              <h2 class="bond-value">{{bond.deposit}}</h2>
              <h2 class="bond-expire">{{bond.expiration | dateFromNow}}</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      bonds: [],
      searchQuery: ""
    };
  },
  computed: {
    ...mapState(["config"]),
    filteredBonds() {
      if (this.searchQuery) {
        return this.bonds.filter(
          b =>
            b.creator.includes(this.searchQuery) ||
            b.name.includes(this.searchQuery)
        );
      } else {
        return this.bonds;
      }
    }
  },
  async mounted() {
    const fetchBonds = async (lower_bound = 0) => {
      const result = await this.$eos.getTableRows({
        json: true,
        code: this.config.contractAccount,
        scope: this.config.contractAccount,
        table: "bonds",
        lower_bound,
        limit: 50
      });
      this.bonds = this.bonds.concat(result.rows);
      if (result.more) {
        await fetchBonds(
          this.$eos.nextKey(result.rows[result.rows.length - 1].name)
        );
      }
    };
    await fetchBonds();
  }
};
</script>

<style scoped>
.search-input {
  border: none;
  border-bottom: solid 3px #2d3e4f;
}
</style>
