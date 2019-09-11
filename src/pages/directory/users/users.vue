<template>
  <div class="flex-layout">
    <!-- 左侧内容   start -->
    <div class="flex-side">
      <div class="main-ctc">
        <div class="search iconfont iconsearch">
          <Input :placeholder="$t('message.search')" />
        </div>
        <Tree :data="departmentTree" @on-select-change="treeClick"></Tree>
      </div>
      <div class="btm-footer">
        <button @click="manageUnits">{{$t('manage_units')}}</button>
      </div>
    </div>
    <!-- 左侧内容   end -->
    <!-- 右侧内容   start -->
    <router-view :rowData="rowData"></router-view>
    <!-- 右侧内容   end -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      //左侧树
      id: 0, //部门id
      rowData: [],
      departmentTree: []
    };
  },
  created() {
    this.initTree();
  },
  methods: {
    //初始化树数据结构
    treeDepthInit(arr, filterId = null) {
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          item.selected = false;
          item.title = `${item.title}(${item.dept_member})`
          if (item.children) {
            this.treeDepthInit(item.children);
          }
        });
      }
      return arr;
    },
    //初始化默认选中节点
    initTreeCheck(arr, filterId) {
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.id === filterId) {
            item.selected = true;
          } else if (item.children) {
            this.initTreeCheck(item.children, filterId);
          }
        });
      }
      return arr;
    },
    //左侧树信息
    initTree() {
      let _this = this;
      _this.$request
        .get("/department/index", {
          id: _this.id,
          g_member: 1
        })
        .then(res => {
          if (res.status === 1) {
            let data = _this.treeDepthInit(res.result.list);
            data.length === 1 ? (data[0].expand = true) : "";
            _this.departmentTree = data;
          } else {
            _this.$Message.error(res.message);
          }
        });
    },
    treeClick(item) {
      if (item.length !== 0) {
        this.rowData = item[0];
        // this.$request.setLocal("currentDepartmentInfo", item);
        this.$route.path === "/users/userslist"
          ? ""
          : this.$router.push("userslist");
      } else {
        this.departmentTree = this.initTreeCheck(
          this.departmentTree,
          this.rowData.id
        );
      }
    },
    //管理部门
    manageUnits() {
      this.$router.push("/unitslist");
    }
  }
};
</script>
<style lang="scss">
.flex-layout .flex-side .btm-footer {
  cursor: pointer;
}
</style>