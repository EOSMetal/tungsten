<template>
  <div class="content">
    <section class="call-to-action-section">
      <div class="w-container">
        <div class="w-row">
          <div class="column w-col w-col-8">
            <h1 class="brand-text page-title">Create a new Claim</h1>
            <h2 class="page-subtitle">Submit the form below</h2>
          </div>
        </div>
      </div>
    </section>
    <section id="Dashboard" class="section">
      <div class="container-4 w-container">
        <div class="w-row">
          <div class="w-col w-col-8">
            <div class="bond-form-block">
              <div class="w-row">
                <div class="w-col w-col-9">
                  <h2 class="bond-name title">Create Here</h2>
                  <h2 class="contract-answer bond-p">Lorem ipsum dolor sit amet et delectus accommodare his consul
                    copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</h2>
                </div>
              </div>
              <div class="w-form">
                <form @submit.prevent="submit()" id="email-form" class="form w-clearfix">
                  <label for="bondName" class="bond-label-form">Bond Name</label>
                  <input v-model="claim.bondName" disabled type="text" class="text-field w-input"
                    maxlength="12" id="bondName" required/>
                  <label for="name" class="bond-label-form">Claim Name</label>
                  <input v-model="claim.name" type="text" class="text-field w-input" maxlength="12" id="name" required/>
                  <label for="amount" class="bond-label-form">Claimed Amount</label>
                  <input v-model="claim.amount" type="text" class="text-field w-input" maxlength="256" id="amount" required/>
                  <label for="language" class="bond-label-form">Language of the Claim Details</label>
                  <input v-model="claim.language" type="text" class="text-field w-input" maxlength="64" id="language" required/>
                  <!-- <select id="language" class="text-field w-select" required>
                    <option value="">Select one...</option>
                    <option value="First">First Choice</option>
                    <option value="Second">Second Choice</option>
                    <option value="Third">Third Choice</option>
                  </select> -->
                  <label for="details" class="bond-label-form">Claim Details</label>
                  <textarea v-model="claim.details" id="details" maxlength="5000" class="textarea w-input"></textarea>
                  <input type="submit" value="Submit Claim" class="navy-button submit-light w-button"/>
                </form>
              </div>
            </div>
          </div>
          <div class="w-col w-col-4">
            <h1 class="brand-text claim-name form-left">Helpful Links</h1>
            <div class="active-claims-block">
              <router-link :to="{name: 'about'}">
                <h2 class="active-bond"><strong>About Bonds and Claims</strong></h2>
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

export default {
  data() {
    return {
      claim: {
        bondName: this.$route.params.bondName,
        name: null,
        amount: null,
        language: null,
        details: null
      }
    };
  },
  computed: {
    ...mapState(["bond", "loadingBond", "account", "config"])
  },
  async mounted() {
    await this.$store.dispatch("loadBond", this.$route.params.bondName);
  },
  methods: {
    async submit() {
      await this.$eos.scatter.transaction(this.config.contractAccount, tr => {
        tr.createclaim(
          this.account.name,
          this.claim.bondName,
          this.claim.name,
          this.claim.amount,
          this.claim.details,
          this.claim.language
        );
      });
      this.$router.push({
        name: "viewClaim",
        params: { name: this.claim.name }
      });
    }
  }
};
</script>
