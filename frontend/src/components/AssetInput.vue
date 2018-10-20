<template>
  <div>
    <div class="w-row">
      <div class="w-col w-col-9">
        <input v-bind="$attrs" type="number" class="text-field w-input numeric-input" maxlength="200"
               min="0" step="0.0001" :value="numericValue" @input="propagateValue($event)"/>
      </div>
      <div class="w-col w-col-3 unit-col">
        EOS
      </div>
    </div>
  </div>
</template>

<script>
import eosjs from "eosjs";
import Big from "big.js";

export default {
  name: "AssetInput",
  inheritAttrs: false,
  props: ["value"],
  computed: {
    numericValue() {
      return this.value && parseFloat(this.value.split(" ")[0]);
    }
  },
  methods: {
    propagateValue(event) {
      if (event.target.value) {
        let value = new Big(event.target.value)
          .times(10000)
          .toString()
          .split(".")[0];
        value = new Big(value).div(10000);
        event.target.value = value;
        value = eosjs.modules.format.DecimalPad(value, 4);
        this.$emit("input", value + " EOS");
      } else {
        this.$emit("input", "");
      }
    }
  }
};
</script>

<style scoped>
.numeric-input {
  text-align: right;
}
.unit-col {
  padding-top: 15px;
}
</style>
