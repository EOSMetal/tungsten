<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul>
          <li>
            <router-link :to="{path:'/admin'}">Dashboard</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright d-flex flex-wrap">
        <a style="color: black" href="https://github.com/EOSMetal/tungsten" target="_blank">
          <i class="fa fa-github" style="font-size: 130%"></i> Tungsten
        </a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {};
</script>
<style>
</style>
