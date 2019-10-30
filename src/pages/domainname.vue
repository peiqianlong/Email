<template>
  <div class="domainname">
    <header>
      <div class="logo"></div>
      <span></span>
    </header>
  </div>
</template>

<script>
    export default {
        name: "domainname"
    }
</script>

<style lang="scss" scoped>
  header {
    height: 64px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 0px rgba(221, 221, 221, 1);
    width: 100%;
    display: flex;
    align-items: center;
    .logo {
      width: 96px;
      height: 28px;
      background: url(../assets/images/ecer_logo.png) no-repeat;
      margin-left: 28px;
    }
  }


</style>
