<template>
  <footer class="footer center">
    <div class="container-3 w-container">
      <div class="w-row">
        <div class="w-col w-col-4">
          <div class="footer-text">
            <a class="fulltime-link" href="http://www.fulltime.digital/">
              <img src="@/assets/images/fulltime-logo-32.jpg" class="fulltime-logo"/>
              Designed by FULLTIME.<span class="digital">digital</span>
            </a>
          </div>
        </div>
        <div class="w-col w-col-4" style="text-align: center">
          <a href="https://github.com/EOSMetal/tungsten" target="_blank">
            <fa-icon :icon="['fab', 'github']" size="lg" class="gihub-icon"/>
          </a>
        </div>
        <div class="w-col w-col-4" style="text-align: right">
          <a href="https://eosmetal.io/" target="_blank">
            <img src="@/assets/images/eosmetal-logo.png" width="79" alt="EOSMetal">
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter"
};
</script>

<style scoped>
.fulltime-link {
  color: #0f2e4d;
  text-decoration: none;
}
.fulltime-logo {
  margin-top: -3px;
}
.gihub-icon {
  margin-top: 6px;
  color: black;
}
.footer {
  padding-top: 40px;
}
</style>
