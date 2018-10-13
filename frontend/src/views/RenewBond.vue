<template>
  <form @submit.prevent="renewBond()">
    <label for="expiration" class="bond-label-form">New Expiration Date</label>
    <datetime type="datetime" v-model="date" input-class="text-field spacer w-input" input-id="expiration" required></datetime>
    <input type="submit" value="Extend"/>
  </form>
</template>

<script>
export default {
  data() {
    return {
      date: null
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
