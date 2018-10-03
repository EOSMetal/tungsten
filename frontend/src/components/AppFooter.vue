<template>
  <footer class="footer center">
    <div class="container-3 w-container">
      <div class="w-row">
        <div class="w-col w-col-6">
          <div class="footer-text">
            <img src="@/assets/images/fulltime-logo-32.jpg" class="fulltime-logo"/>
            Designed by FULLTIME.<span class="digital">digital</span>
          </div>
        </div>
        <div class="column-16 w-clearfix w-col w-col-6">
          <a href="https://eosmetal.io/" target="_blank">
            <img src="@/assets/images/eosmetal-logo.png" width="79" alt="EOSMetal" class="image-2">
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
.fulltime-logo {
  margin-top: -3px;
}
.footer {
  padding-top: 40px;
}
</style>
