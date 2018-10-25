<template>
  <div>
    <router-view/>
    <notifications :duration="10000" width="345" position="bottom right" classes="vue-notification toast"/>
  </div>
</template>

<script>
import "@/assets/css/normalize.css";
import "@/assets/css/webflow.css";
import "@/assets/css/tungsten.webflow.css";

export default {
  mounted() {
    this.$store.dispatch("pairScatter");
  }
};
</script>

<style>
.notifications .notification-wrapper {
  overflow: visible;
  padding-bottom: 15px;
  padding-right: 15px;
}
.vue-notification.toast {
  border-radius: 10px;
  box-shadow: 6px 22px 44px 5px rgba(0, 0, 0, 0.8);
}
.vue-notification.toast.error {
  background: #bd2f25;
  border-left-color: #922119;
}
.collapse:not(.show) {
  display: none;
}
.collapsing {
  position: relative;
  height: 0;
  overflow: hidden;
  transition: height 0.35s ease;
}
.help-text p {
  font-family: "Varela Round", sans-serif;
  font-size: 80%;
  color: rgb(168, 168, 168);
  margin-bottom: 2px;
}
.help-text a {
  color: #60a1cc;
  cursor: pointer;
}
.w-input {
  margin-bottom: 24px;
}
.contract-text {
  color: #007fd3;
  line-height: 16px;
  letter-spacing: 0.25px;
  padding-right: 10px;
  padding-left: 10px;
}
.contract-text h1,
h2,
h3,
h4,
h5,
h6 {
  color: #007fd3;
}
.contract-text h1 {
  font-size: 160%;
}
.contract-text h2 {
  font-size: 140%;
}
.contract-text h3 {
  font-size: 120%;
}
.contract-text h4 {
  font-size: 120%;
}
.contract-text h5 {
  font-size: 120%;
}
.contract-text h6 {
  font-size: 110%;
}
</style>
