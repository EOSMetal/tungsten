<template>
  <div data-collapse="medium" data-animation="default" data-duration="400" data-no-scroll="1" class="left-navigation w-nav" style="z-index: auto">
    <router-link :to="{name: 'home'}" class="logo-link w-nav-brand">
      <h1 class="brand-text logo">Tungsten</h1>
      <div class="credits">
        By <img src="@/assets/images/eosmetal-logo.png" width="80px" alt="EOSMetal"/>
      </div>
    </router-link>
    <Nav class="w-hidden-medium w-hidden-small w-hidden-tiny"/>
    <Slide class="hamburger">
      <Nav/>
    </Slide>
  </div>
</template>

<script>
import Nav from "./Nav";
import { Slide } from "vue-burger-menu";

export default {
  components: { Nav, Slide }
};
</script>

<style scoped>
.credits {
  margin-top: -18px;
  margin-bottom: 42px;
  margin-left: 32px;
}
.credits > img {
  margin-left: 6px;
}
@media (min-width: 992px) {
  .hamburger {
    display: none;
  }
}
@media (max-width: 991px) {
  .logo-link {
    margin-left: 82px;
  }
  .brand-text {
    display: inline-block;
  }
  .credits {
    display: inline-block;
    vertical-align: middle;
    margin: 0;
    margin-left: 16px;
    margin-top: -8px;
  }
}
</style>
