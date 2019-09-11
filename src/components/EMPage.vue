<template>
  <div class="page-list">
    <span class="first iconfont iconfirst" :class="{'disabled':currentValue<=1}" @click="firstPage"></span>
    <span>{{currentValue}}/{{totalPage}}</span>
    <span>of</span>
    <span>{{totalPage}}</span>
    <span
      class="prev iconfont iconprevious"
      :class="{'disabled':currentValue<=1}"
      @click="prevPage"
    ></span>
    <span
      class="next iconfont iconnext"
      :class="{'disabled':currentValue>=totalPage}"
      @click="nextPage"
    ></span>
    <span
      class="last iconfont iconlast"
      :class="{'disabled':currentValue>=totalPage}"
      @click="lastPage"
    ></span>
  </div>
</template>
<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 0
    },
    totalPage: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentValue: this.currentPage
    };
  },
  watch: {
    currentValue(val) {
      this.$emit("on-change", val);
    }
  },
  methods: {
    firstPage() {
      this.currentValue = 1;
    },
    lastPage() {
      this.currentValue = this.totalPage;
    },
    nextPage() {
      this.currentValue =
        this.currentValue < this.totalPage
          ? ++this.currentValue
          : this.totalPage;
    },
    prevPage() {
      this.currentValue = this.currentValue > 1 ? --this.currentValue : 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.page-list {
  font-size: 0;
  text-align: right;
  span {
    display: inline-block;
    vertical-align: middle;
    font-size: $font-size;
    text-align: center;
    line-height: 17px;
    margin: 0 2px;
    color: $font-color3;
    &.prev {
      margin: 0 0 0 15px;
    }
    &.next,
    &.last {
      margin: 0 0 0 10px;
    }
    &.first {
      margin: 0 15px 0 0;
    }
    &.prev,
    &.next,
    &.first,
    &.last {
      width: 32px;
      height: 32px;
      line-height: 32px;
      border-radius: 50%;
      font-size: 18px;
      @include e-transition();
      cursor: pointer;
      &:hover {
        background: $background-color;
        color: $font-color1;
      }
    }
    &.disabled {
      cursor: no-drop;
      &:hover{
        background: transparent;
        color: $font-color3;
      }
    }
  }
}
</style>