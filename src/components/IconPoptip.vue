<template>
  <div class="icon-poptip" @click.stop="popClick">
    <i class="iconfont icon-button" :class="iconName"></i>
    <div class="poptip-title">{{title}}</div>
  </div>
</template>
<script>
export default {
  props: {
    iconName: {
      type: String,
      request: true,
      default: ""
    },
    title: {
      type: String
    }
  },
  methods:{
    popClick(){
      this.$emit("popClick");
    }
  }
};
</script>
<style lang="scss" scoped>
.icon-poptip {
  display: inline-block;
  vertical-align: middle;
  position: relative;
  background: transparent;
  .iconfont {
    color: $font-color3;
  }
  .poptip-title {
    @include h-center();
    top: 40px;
    height: 24px;
    line-height: 20px;
    background: #000000;
    border-radius: $border-radius1;
    color: #fff;
    white-space: nowrap;
    font-size: 12px;
    padding: 0 8px;
    z-index: 2;
    visibility: hidden;
    opacity: 0;
    @include e-transition();
  }
  &:hover {
    .iconfont {
      color: $font-color1;
    }
    .poptip-title {
      visibility: visible;
      opacity: 1;
    }
  }
}
</style>