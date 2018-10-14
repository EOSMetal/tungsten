<template>
  <div class="content">
    <section class="call-to-action-section">
      <div class="w-container">
        <div class="w-row">
          <div class="column w-col w-col-8">
            <h1 class="brand-text page-title">View your Claim</h1>
            <h2 class="page-subtitle">Manage your claim below</h2>
          </div>
        </div>
      </div>
    </section>
    <section id="Dashboard" class="section">
      <div class="w-container">
        <div v-if="loadingBond || loadingClaim" class="w-row">
          <h2 class="bond-name">Loading...</h2>
        </div>
        <div v-else-if="!claim" class="w-row">
          <h2 class="bond-name"><span style="color: black">Claim not found:</span> {{$route.params.name}}</h2>
          <p>The claim you are looking for does not currently exist. Please check the URL is corrent.</p>
        </div>
        <div v-else class="w-row">
          <div class="w-col w-col-8">
            <h2 class="bond-name"><span style="color: black">Name:</span> {{claim.name}}</h2>
            <div class="bond-form-block">
              <div class="bond-breakdown w-row">
                <div class="column-15 w-col w-col-3 w-col-small-3 w-col-tiny-6">
                  <h2 class="bond-info">On Bond</h2>
                </div>
                <div class="column-14 w-col w-col-9 w-col-small-9 w-col-tiny-6">
                  <h2 class="bond-answer"><strong>{{bond.name}}</strong></h2>
                </div>
              </div>
              <div class="bond-breakdown w-row">
                <div class="column-15 w-col w-col-3 w-col-tiny-6 w-col-small-3">
                  <h2 class="bond-info">Created By</h2>
                </div>
                <div class="column-14 w-col w-col-9 w-col-tiny-6 w-col-small-9">
                  <h2 class="bond-answer"><strong>{{claim.claimer}}</strong></h2>
                </div>
              </div>
              <div class="bond-breakdown w-row">
                <div class="column-15 w-col w-col-3 w-col-tiny-6 w-col-small-3">
                  <h2 class="bond-info">Expiry Date</h2>
                </div>
                <div class="column-14 w-col w-col-9 w-col-tiny-6 w-col-small-9">
                  <h2 class="bond-answer"><strong>{{claim.expiration | dateFromNow}}</strong></h2>
                </div>
              </div>
              <h2 class="bond-remaining">Claimed Amount</h2>
              <h2 class="bond-price">{{claim.amount}}</h2>
              <div class="bond-breakdown w-row">
                <div class="column-15 w-col w-col-3 w-col-tiny-6 w-col-small-3">
                  <h2 class="bond-info"><strong>Claim Details:</strong></h2>
                </div>
                <div class="column-14 w-col w-col-9 w-col-tiny-6 w-col-small-9">
                  <h2 class="bond-answer"><strong>(Language: {{claim.language}})</strong></h2>
                </div>
              </div>
              <h2 class="contract-answer">{{claim.details}}</h2>
            </div>
          </div>
          <div class="w-col w-col-4">
            <h1 class="brand-text claim-name">Actions</h1>
            <div class="active-claims-block">
              <h2 v-if="!account" class="active-bond">
                Please pair your Scatter to see available actions
              </h2>
              <div v-else>
                <h2 v-if="shouldShowCloseClaimButton" class="active-bond">
                  <a @click="closeClaim()" href="#" class="action-link">
                    Close Claim
                  </a>
                </h2>
                <h2 v-if="shouldShowArbitrationButtons" class="active-bond">
                  <a @click="delayClaim()" href="#" class="action-link">
                    Delay Claim Expiration
                  </a>
                </h2>
                <h2 v-if="shouldShowArbitrationButtons" class="active-bond">
                  <a @click="showRuleClaimModal()" href="#" class="action-link">
                    Rule Claim
                  </a>
                </h2>
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
import RuleClaim from "./RuleClaim";

export default {
  computed: {
    ...mapState(["bond", "loadingBond", "claim", "loadingClaim", "account"]),
    shouldShowCloseClaimButton() {
      return (
        this.account &&
        this.account.name === this.claim.claimer &&
        (Date.now() > this.claim.expiration * 1000 ||
          (this.bond && this.bond.deposit === "0.0000 EOS"))
      );
    },
    shouldShowArbitrationButtons() {
      if (this.account && this.bond && this.claim) {
        return (
          this.account.name === this.bond.arbitrator &&
          Date.now() < this.claim.expiration * 1000
        );
      } else {
        return false;
      }
    }
  },
  async mounted() {
    await this.$store.dispatch("loadClaim", this.$route.params.name);
    if (this.claim) {
      await this.$store.dispatch("loadBond", this.claim.bond_name);
    }
  },
  methods: {
    async closeClaim() {
      await this.$store.dispatch("closeClaim", this.claim);
      this.$router.push({ name: "viewBond", params: { name: this.bond.name } });
      this.$notify({
        type: "success",
        title: "Success",
        text: "Claim successfully closed"
      });
    },
    async delayClaim() {
      await this.$store.dispatch("delayClaim", this.claim);
      this.$notify({
        type: "success",
        title: "Success",
        text: "Claim's expiration successfully delayed"
      });
    },
    async showRuleClaimModal() {
      this.$modal.show(
        RuleClaim,
        { claim: this.claim, bond: this.bond },
        { height: "auto" }
      );
    }
  }
};
</script>

<style scoped>
.action-link {
  color: white;
  text-decoration: none;
}
</style>
