<template>
  <div data-collapse="medium" data-animation="default" data-duration="400" data-no-scroll="1" class="left-navigation w-nav">
    <a href="#" class="logo-link w-nav-brand">
      <h1 class="brand-text logo">Tungsten</h1>
      <div class="credits">
        By <img src="@/assets/images/eosmetal-logo.png" width="80px" alt="EOSMetal"/>
      </div>
    </a>
    <nav role="navigation" class="nav-menu w-nav-menu">
      <router-link :to="{name: 'home'}" class="nav-link w-nav-link">
        <div class="columns-5 w-row">
          <div class="column-11 w-col w-col-2">
            <fa-icon icon="home" size="2x" class="nav-icon"/>
          </div>
          <div class="column-nav w-col w-col-10">
            Home
          </div>
        </div>
      </router-link>
      <router-link :to="{name: 'bonds'}" class="nav-link w-nav-link">
        <div class="columns-5 w-row">
          <div class="column-11 w-col w-col-2">
            <fa-icon icon="link" size="2x" class="nav-icon"/>
          </div>
          <div class="column-nav w-col w-col-10">
            Bonds
          </div>
        </div>
      </router-link>
      <router-link :to="{name: 'about'}" class="nav-link w-nav-link">
        <div class="columns-5 w-row">
          <div class="column-11 w-col w-col-2">
            <fa-icon icon="question-circle" size="2x" class="nav-icon"/>
          </div>
          <div class="column-nav w-col w-col-10">
            About
          </div>
        </div>
      </router-link>
    </nav>
    <div class="hamburger-button w-nav-button">
      <div class="icon w-icon-nav-menu"></div>
    </div>
    <div class="social-footer w-hidden-medium w-hidden-small w-hidden-tiny">
      <div v-if="!account">
        <a href="#" @click="pairScatter()" class="footer-pair w-nav-link">
          Pair with your
          <img src="@/assets/images/scatter.png" width="65" alt="Scatter" class="pair"/>
        </a>
      </div>
      <div v-else>
        <p>
          Account: <strong>{{account.name}}</strong>
        </p>
        <div style="margin-top: 12px">
          <a href="#" @click="logOut()" class="sidebar-button white">Log out</a>
        </div>
      </div>
      <!-- <div class="columns-8 w-row">
        <div class="w-col w-col-4">
          <a href="#" class="sidebar-button white">Help</a>
        </div>
        <div class="column-5 w-col w-col-4">
          <h2 class="sidebar-links">Privacy</h2>
        </div>
        <div class="column-6 w-col w-col-4">
          <h2 class="bond-expire">Terms</h2>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Sidebar",
  computed: mapState(["eos", "account"]),
  methods: {
    ...mapActions(["pairScatter"]),
    logOut() {
      this.$store.commit("setEos", null);
      this.$store.commit("setAccount", null);
    }
  }
};
</script>

<style scoped>
.router-link-exact-active {
  margin-left: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-family: "Varela Round", sans-serif;
  color: #007fd3;
  font-weight: 800;
  text-align: left;
  letter-spacing: 0.35px;
  text-transform: capitalize;
}
@media (max-width: 479px) {
  .router-link-exact-active {
    margin-left: 28px;
    color: #0f2e4d;
  }
}
.credits {
  margin-top: -18px;
  margin-bottom: 42px;
  margin-left: 32px;
}
.credits > img {
  margin-left: 6px;
}
.nav-icon {
  margin-top: 6px;
  margin-bottom: 6px;
}
.column-nav {
  margin-top: 12px;
}
.pair {
  margin-left: 0;
  margin-top: 12px;
}
</style>
