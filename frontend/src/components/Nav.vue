<template>
  <nav role="navigation" class="tungsten-nav-menu">
      <router-link :to="{name: 'home'}" class="tungsten-nav-link">
        <div class="w-row">
          <div class="w-col w-col-2">
            <fa-icon icon="home" size="2x" class="nav-icon"/>
          </div>
          <div class="column-nav w-col w-col-10">
            Home
          </div>
        </div>
      </router-link>
      <router-link :to="{name: 'bonds'}" class="tungsten-nav-link">
        <div class="w-row">
          <div class="w-col w-col-2">
            <fa-icon icon="link" size="2x" class="nav-icon"/>
          </div>
          <div class="column-nav w-col w-col-10">
            Bonds
          </div>
        </div>
      </router-link>
      <router-link :to="{name: 'about'}" class="tungsten-nav-link">
        <div class="w-row">
          <div class="w-col w-col-2">
            <fa-icon icon="question-circle" size="2x" class="nav-icon"/>
          </div>
          <div class="column-nav w-col w-col-10">
            About
          </div>
        </div>
      </router-link>
      <div class="social-footer">
        <div class="w-row">
          <div class="w-col w-col-12">
            <div v-if="!account">
              <a href="#" @click="pairScatter()" class="pair-link">
                Pair with your
                <img src="@/assets/images/scatter.png" width="65" alt="Scatter" class="pair"/>
              </a>
            </div>
            <div v-else class="account-info">
              <p>
                Account: <strong>{{account.name}}</strong>
                <br/>
                Balance: <strong>{{balance}}</strong>
              </p>
              <div v-if="!loadingActiveAuthority" style="margin-top: 12px">
                <a v-if="!hasGrantedPermission" href="#" @click="grantPermission()" class="sidebar-button white">Grant Permission</a>
                <a v-else href="#" @click="removePermission()" class="sidebar-button white">Remove Permission</a>
              </div>
              <div style="margin-top: 12px">
                <a href="#" @click="logOut()" class="sidebar-button white">Log out</a>
              </div>
            </div>
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
    </nav>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "Nav",
  computed: {
    ...mapState(["account", "balance", "loadingActiveAuthority"]),
    ...mapGetters(["hasGrantedPermission"])
  },
  methods: {
    ...mapActions([
      "pairScatter",
      "logOut",
      "grantPermission",
      "removePermission"
    ])
  }
};
</script>

<style>
.bm-menu {
  background-color: #a8b5c0;
}
</style>

<style scoped>
.bm-menu {
  background-color: #d8e4ed;
}
.tungsten-nav-menu {
  display: block;
  padding-left: 35px;
}
@media (max-width: 991px) {
  .tungsten-nav-menu {
    padding-left: 0;
  }
}
.tungsten-nav-link {
  display: block;
  margin-left: 0px;
  padding: 5px 0px;
  font-family: "Varela Round", sans-serif;
  color: #0f2e4d;
  font-size: 15px;
  font-weight: 800;
  text-align: left;
  letter-spacing: 0.35px;
  text-transform: none;
}
.router-link-exact-active {
  color: #007fd3;
}
.nav-icon {
  margin-top: 6px;
  margin-bottom: 6px;
}
.column-nav {
  margin-top: 12px;
}
.social-footer {
  margin-top: 48px;
}
.pair-link {
  text-decoration: none;
  color: #0f2e4d;
}
.pair {
  display: block;
  width: 131px;
  margin-top: 12px;
}
.account-info {
  color: #0f2e4d;
}
</style>
