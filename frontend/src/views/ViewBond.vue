<template>
  <div class="content">
    <section class="call-to-action-section">
      <div class="w-container">
        <div class="w-row">
          <div class="column w-col w-col-8">
            <h1 class="brand-text page-title">Examine Bond</h1>
            <h2 class="page-subtitle">Review the bond details below</h2>
          </div>
          <div v-if="!loadingBond && bond && Date.now() < bond.expiration * 1000" class="align-right w-col w-col-4">
            <router-link :to="{name: 'createClaim', params: {bondName: bond.name}}" class="navy-button white">
              File New Claim
            </router-link>
          </div>
        </div>
      </div>
    </section>
    <section id="Dashboard" class="section">
      <div class="w-container">
        <div v-if="loadingBond" class="w-row">
          <h2 class="bond-name">Loading...</h2>
        </div>
        <div v-else-if="!bond" class="w-row">
          <h2 class="bond-name"><span style="color: black">Bond not found:</span> {{$route.params.name}}</h2>
          <p>The bond you are looking for does not currently exist. Please check the URL is corrent.</p>
        </div>
        <div v-else class="w-row">
          <div class="w-col w-col-8">
            <h2 class="bond-name"><span style="color: black">Name:</span> {{bond.name}}</h2>
            <div class="bond-form-block">
              <div class="bond-breakdown w-row">
                <div class="column-15 w-col w-col-3 w-col-small-3 w-col-tiny-6">
                  <h2 class="bond-info">Created By</h2>
                </div>
                <div class="column-14 w-col w-col-9 w-col-small-9 w-col-tiny-6">
                  <h2 class="bond-answer"><strong>{{bond.creator}}</strong></h2>
                </div>
              </div>
              <div class="bond-breakdown w-row">
                <div class="column-15 w-col w-col-3 w-col-tiny-6">
                  <h2 class="bond-info">Arbitrated By</h2>
                </div>
                <div class="column-14 w-col w-col-9 w-col-tiny-6">
                  <h2 class="bond-answer"><strong>{{bond.arbitrator}}</strong></h2>
                </div>
              </div>
              <div class="bond-breakdown w-row">
                <div class="column-15 w-col w-col-3 w-col-tiny-6">
                  <h2 class="bond-info">Expiry Date</h2>
                </div>
                <div class="column-14 w-col w-col-9 w-col-tiny-6">
                  <h2 class="bond-answer">
                    <strong>{{bond.expiration | dateFromNow}} </strong>
                    <a v-if="account && account.name === bond.creator" href="#" @click.prevent="showExtendModal()">
                      (Extend)
                    </a>
                  </h2>
                </div>
              </div>
              <h2 class="bond-remaining">Deposit Remaining</h2>
              <h2 class="bond-price">{{bond.deposit}}</h2>
              <h2 class="ricardian-contract"><strong class="bold-text-2">Ricardian Contract</strong></h2>
              <h2 class="contract-answer">{{bond.ricardian}}</h2>
            </div>
          </div>
          <div class="w-col w-col-4">
            <div v-if="Date.now() > bond.expiration * 1000 && claims.length === 0">
              <h1 class="brand-text claim-name">Bond Expired</h1>
              <p>This bond has expired and it has no active claims.</p>
              <button v-if="account && account.name === bond.creator"
                      @click="closeBond()"
                      class="navy-button submit-light w-button">
                Close Bond
              </button>
            </div>
            <div v-else>
              <h1 class="brand-text claim-name">Active Claims:</h1>
              <div v-for="claim in claims" :key="claim.name" class="active-claims-block">
                <h2 class="active-bond"><strong>{{claim.claimer}}</strong></h2>
                <h2 class="active-bond-claim-name">
                  <router-link :to="{name: 'viewClaim', params: {name: claim.name}}" class="view-claim">
                    <strong class="bold-text">
                      {{claim.name}}
                    </strong>
                  </router-link>
                </h2>
                <h2 class="active-bond-price" style="font-size: 160%">{{claim.amount}}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RenewBond from "./RenewBond";

export default {
  data() {
    return {
      claims: []
    };
  },
  computed: {
    ...mapState(["bond", "loadingBond", "config", "account"])
  },
  async mounted() {
    const fetchClaims = async (lower_bound = 0) => {
      const result = await this.$eos.getTableRows({
        json: true,
        code: this.config.contractAccount,
        scope: this.config.contractAccount,
        table: "claims",
        lower_bound,
        limit: 50
      });
      this.claims = this.claims.concat(
        result.rows.filter(c => c.bond_name === this.$route.params.name)
      );
      if (result.more) {
        await fetchClaims(
          this.$eos.nextKey(result.rows[result.rows.length - 1].name)
        );
      }
    };

    await Promise.all([
      this.$store.dispatch("loadBond", this.$route.params.name),
      fetchClaims()
    ]);
  },
  methods: {
    showExtendModal() {
      this.$modal.show(RenewBond, { bond: this.bond }, { height: "auto" });
    },
    async closeBond() {
      await this.$store.dispatch("closeBond", this.bond);
      this.$router.push({ name: "bonds" });
      this.$notify({
        type: "success",
        title: "Success",
        text: "Bond successfully closed"
      });
    }
  }
};
</script>

<style scoped>
.view-claim {
  color: white;
}
</style>
