<template>
  <div class="content">
    <section class="call-to-action-section">
      <div class="w-container">
        <div class="w-row">
          <div class="column w-col w-col-8">
            <h1 class="brand-text page-title">Examine Bond</h1>
            <h2 class="page-subtitle">Review the bond details below</h2>
          </div>
          <div class="align-right w-col w-col-4"><a href="#" class="navy-button white">File New Claim</a></div>
        </div>
      </div>
    </section>
    <section id="Dashboard" class="section">
      <div class="w-container">
        <div class="w-row">
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
                  <h2 class="bond-answer"><strong>{{bond.expiration}}</strong></h2>
                </div>
              </div>
              <h2 class="bond-remaining">Deposit Remaining</h2>
              <h2 class="bond-price">{{bond.deposit}}</h2>
              <h2 class="ricardian-contract"><strong class="bold-text-2">Ricardian Contract</strong></h2>
              <h2 class="contract-answer">{{bond.ricardian}}</h2>
            </div>
          </div>
          <div class="w-col w-col-4">
            <h1 class="brand-text claim-name">Active Claims:</h1>
            <div class="active-claims-block">
              <h2 class="active-bond"><strong>fakeclaimer</strong></h2>
              <h2 class="active-bond-claim-name"><strong class="bold-text">fakeclaim</strong></h2>
              <h2 class="active-bond-price">90 EOS</h2>
            </div>
            <div class="active-claims-block">
              <h2 class="active-bond"><strong>claimer</strong></h2>
              <h2 class="active-bond-claim-name"><strong class="bold-text">claimname</strong></h2>
              <h2 class="active-bond-price">200 SYS</h2>
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
      bond: {}
    };
  },
  computed: {
    ...mapState(["publicEos"])
  },
  async mounted() {
    this.bond = (await this.publicEos.getTableRows({
      json: true,
      code: "tungsten",
      scope: "tungsten",
      table: "bonds",
      lower_bound: this.$route.params.name,
      limit: 1
    })).rows[0];
  }
};
</script>
