<template>
  <div class="w-form" style="padding: 36px">
    <form @submit.prevent="renewBond()" id="email-form" class="form w-clearfix">
      <h2>Extend Bond Expiration</h2>
      <label for="expiration" class="bond-label-form">New Expiration Date</label>
      <datetime type="datetime" v-model="date" input-class="text-field spacer w-input" input-id="expiration" required></datetime>
      <input type="submit" value="Extend" class="navy-button submit-light w-button"/>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(this.bond.expiration * 1000).toISOString()
    };
  },
  props: ["bond"],
  methods: {
    renewBond() {
      this.$store.dispatch("renewBond", {
        bond: this.bond,
        expiration: Math.floor(new Date(this.date).getTime() / 1000)
      });
      this.$emit("close");
    }
  }
};
</script>
