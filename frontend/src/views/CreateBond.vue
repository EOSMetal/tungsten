<template>
  <div>
    <section class="call-to-action-section">
      <div class="w-container">
        <div class="w-row">
          <div class="column w-col w-col-8">
            <h1 class="brand-text page-title">Create a new Bond</h1>
            <h2 v-if="account" class="page-subtitle">Submit the form below</h2>
            <h2 v-else class="page-subtitle">
              Please pair your Scatter in order to create a bond
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
                  <h2 class="contract-answer bond-p">Lorem ipsum dolor sit amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</h2>
                </div>
                <div class="w-col w-col-3"></div>
              </div>
              <div class="w-form">
                <form @submit.prevent="submit()" id="email-form" class="form w-clearfix">
                  <label for="name" class="bond-label-form">Name</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-name>Read more</a></p>
                    <b-collapse id="info-name">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <input v-model="bond.name" type="text" class="text-field w-input" maxlength="12" id="name" required/>
                  
                  <label for="deposit" class="bond-label-form">Deposit Amount</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-amount>Read more</a></p>
                    <b-collapse id="info-amount">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <AssetInput v-model="bond.deposit" id="deposit" required/>
                  
                  <label for="arbitrator" class="bond-label-form">Arbitrator Account</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-arbitrator>Read more</a></p>
                    <b-collapse id="info-arbitrator">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <input v-model="bond.arbitrator" type="text" class="text-field w-input" maxlength="12" id="arbitrator"/>
                  
                  <label for="expiration" class="bond-label-form">Expiration Date</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-expiration>Read more</a></p>
                    <b-collapse id="info-expiration">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <datetime type="datetime" v-model="bond.expiration" input-class="text-field spacer w-input" input-id="expiration" required></datetime>
                  
                  <label for="ricardian" class="bond-label-form">Ricardian Contract</label>
                  <div class="help-text">
                    <p>Lorem ipsum dolor sit amet. <a v-b-toggle.info-ricardian>Read more</a></p>
                    <b-collapse id="info-ricardian">
                      <p>Amet et delectus accommodare his consul copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</p>
                    </b-collapse>
                  </div>
                  <textarea v-model="bond.ricardian" id="ricardian" maxlength="5000" class="textarea w-input"></textarea>
                  
                  <input type="submit" value="Submit Bond" class="navy-button submit-light w-button"/>
                </form>
              </div>
            </div>
          </div>
          <div class="w-col w-col-4">
            <h1 class="brand-text claim-name form-left">Helpful Links</h1>
            <div class="active-claims-block">
              <h2 class="active-bond"><strong>About Bonds</strong></h2>
              <h2 class="active-bond"><strong>About Tungsten</strong></h2>
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

export default {
  components: { AssetInput },
  data() {
    return {
      bond: {
        name: null,
        deposit: null,
        ricardian: null,
        expiration: null,
        arbitrator: null
      }
    };
  },
  computed: {
    ...mapState(["account", "config"])
  },
  methods: {
    async submit() {
      try {
        await this.$eos.scatter.transaction(this.config.contractAccount, tr => {
          tr.createbond(
            this.account.name,
            this.bond.name,
            this.bond.deposit,
            this.bond.ricardian,
            Math.floor(new Date(this.bond.expiration).getTime() / 1000),
            this.bond.arbitrator
          );
        });
        this.$router.push({
          name: "viewBond",
          params: { name: this.bond.name }
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
