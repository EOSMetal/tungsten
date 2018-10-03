<template>
  <div>
    <Sidebar />
    <router-view />
    <AppFooter />
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  name: "Layout",
  components: {
    AppFooter,
    Sidebar
  }
};
</script>
