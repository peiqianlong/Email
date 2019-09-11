<template>
  <div>
    <Header></Header>
    <Nav></Nav>
    <!-- 主体内容   start -->
    <div class="content">
      <router-view></router-view>
    </div>
    <!-- 主体内容   end -->
    <Footer></Footer>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Nav from "@/components/Nav.vue";
import Footer from "@/components/Footer.vue";
export default {
  components: {
    Header,
    Nav,
    Footer
  }
};
</script>
<style lang="scss" scoped>
.content {
  min-height: calc(100vh - 104px);
  margin-top: 64px;
  min-width: 1200px;
  overflow: hidden;
  padding: 17px 16px 19px;
}
</style>

