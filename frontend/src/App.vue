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

export default {};
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
</style>
