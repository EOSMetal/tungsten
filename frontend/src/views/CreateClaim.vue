<template>
  <div class="content">
    <section class="call-to-action-section">
      <div class="w-container">
        <div class="w-row">
          <div class="column w-col w-col-8">
            <h1 class="brand-text page-title">Create a new Claim</h1>
            <h2 v-if="account" class="page-subtitle">Submit the form below</h2>
            <h2 v-else class="page-subtitle">
              Please pair your Scatter in order to create a claim
            </h2>
          </div>
        </div>
      </div>
    </section>
    <section id="Dashboard" class="section">
      <div class="container-4 w-container">
        <div v-if="account" class="w-row">
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
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-bondName>Read more</a></p>
                    <b-collapse id="info-bondName">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <input v-model="claim.bondName" disabled type="text" class="text-field w-input"
                    maxlength="12" id="bondName" required/>
                  
                  <label for="name" class="bond-label-form">Claim Name</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-name>Read more</a></p>
                    <b-collapse id="info-name">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <input v-model="claim.name" type="text" class="text-field w-input" maxlength="12" id="name" required/>
                  
                  <label for="amount" class="bond-label-form">Claimed Amount</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-amount>Read more</a></p>
                    <b-collapse id="info-amount">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <AssetInput v-model="claim.amount" id="amount" required/>

                  <label for="securityDeposit" class="bond-label-form">Claim Security Deposit (10%)</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-securityDeposit>Read more</a></p>
                    <b-collapse id="info-securityDeposit">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <AssetInput :value="securityDeposit" id="securityDeposit" disabled/>
                  
                  <label for="arbitratorFee" class="bond-label-form">Arbitration Fee (20% of deposit)</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-arbitratorFee>Read more</a></p>
                    <b-collapse id="info-arbitratorFee">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <AssetInput :value="arbitratorFee" id="arbitratorFee" disabled/>
                  
                  <label for="language" class="bond-label-form">Language of the Claim Details</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-language>Read more</a></p>
                    <b-collapse id="info-language">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <input v-model="claim.language" type="text" class="text-field w-input" maxlength="64" id="language" required/>
                  
                  <label for="details" class="bond-label-form">Claim Details</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-details>Read more</a></p>
                    <b-collapse id="info-details">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <textarea v-model="claim.details" id="details" maxlength="5000" class="textarea w-input"></textarea>
                  
                  <input type="submit" value="Submit Claim" class="navy-button submit-light w-button"/>
                </form>
              </div>
            </div>
          </div>
          <div class="w-col w-col-4">
            <h1 class="brand-text claim-name form-left">Helpful Links</h1>
            <div class="active-claims-block">
              <router-link :to="{name: 'about'}" style="text-decoration: none">
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
import AssetInput from "../components/AssetInput";
import eosjs from "eosjs";
import Big from "big.js";

const BigEos = Big();
BigEos.RM = 0;

export default {
  components: { AssetInput },
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
    ...mapState(["bond", "loadingBond", "account", "config"]),
    securityDeposit() {
      if (this.claim.amount) {
        const { amount } = eosjs.modules.format.parseAsset(this.claim.amount);
        return (
          BigEos(amount)
            .times("0.1")
            .toFixed(4) + " EOS"
        );
      }
    },
    arbitratorFee() {
      if (this.claim.amount) {
        const { amount } = eosjs.modules.format.parseAsset(this.claim.amount);
        return (
          BigEos(amount)
            .times("0.1")
            .times("0.2")
            .toFixed(4) + " EOS"
        );
      }
    }
  },
  async mounted() {
    await this.$store.dispatch("loadBond", this.$route.params.bondName);
  },
  methods: {
    async submit() {
      try {
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
        await this.$store.dispatch("loadBalance");
      } catch (error) {
        this.$notify({
          type: "error",
          title: "Error",
          text: this.$eos.extractErrorMessage(error)
        });
      }
    }
  }
};
</script>
