<template>
  <div class="w-form" style="padding: 36px">
    <h2>Rule Claim</h2>
    <form @submit.prevent="ruleClaim()" id="email-form" class="form w-clearfix">
      <label for="details" class="bond-label-form">Ruling Details</label>
      <textarea id="details" maxlength="2000" v-model="details" required class="textarea w-input"></textarea>
      <input type="submit" value="Authorize" @click="authorize = true" class="navy-button submit-light w-button"/>
      <input type="submit" value="Reject" @click="authorize = false" class="navy-button submit-light w-button"
            style="background-color: red"/>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      details: null,
      authorize: null
    };
  },
  props: ["claim", "bond"],
  methods: {
    async ruleClaim() {
      await this.$store.dispatch("ruleClaim", {
        claim: this.claim,
        authorize: this.authorize,
        details: this.details
      });
      this.$emit("close");
      this.$router.push({ name: "viewBond", params: { name: this.bond.name } });
      this.$notify({
        type: "success",
        title: "Success",
        text: "Claim ruled successfully"
      });
    }
  }
};
</script>
