<template>
  <div class="flex-layout">
    <!-- 左侧内容   start -->
    <div class="flex-side">
      <div class="main-ctc">
        <div class="search iconfont iconsearch">
          <Input :placeholder="$t('message.search')" />
        </div>
        <div class="left-list">
          <ul v-if="groupList.length>0">
            <li
              v-for="(item,index) in groupList"
              :key="item.id"
              @click="groupItemClick(item,index)"
              :class="{'on':index===currentGroupIndex}"
            >{{`${item.group_name}(${item.member_count})`}}</li>
          </ul>
        </div>
      </div>
      <div class="btm-footer">
        <button @click="manageGroups">Manage groups</button>
      </div>
    </div>
    <!-- 左侧内容   end -->
    <!-- 右侧内容   start -->
    <div class="flex-content">
      <div class="main-ctc">
        <!-- 顶部操作区   start -->
        <div class="content-header">
          <div class="item title">Groups</div>
          <button @click="addMember">Add Member</button>
          <button @click="shiftOut">Shift out</button>
        </div>
        <!-- 顶部操作区   end -->
        <div class="content-search">
          <div class="search iconfont iconsearch">
            <Input :placeholder="$t('message.search')" />
          </div>
          <Select v-model="selectType" style="width:200px;">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="table">
          <Table
            ref="selection"
            :columns="columns"
            :data="dataList"
            @on-selection-change="selectChange"
            :loading="loading"
            @on-row-click="showDetail"
          ></Table>
        </div>
      </div>
    </div>
    <!-- 右侧内容   end -->
    <!-- 成员穿梭框弹层  start -->
    <Modal
      v-model="addMemberModal"
      title="Please select members"
      class-name="vertical-center-modal"
      @on-cancel="addMemberCancle"
      @on-ok="addMemberOk"
    >
      <Select
        v-model="selectedMemberType"
        style="width:200px;margin-bottom: 15px;"
        @on-change="selectedMemberTypeChange"
      >
        <Option :value="0">All</Option>
        <Option :value="1">enabled</Option>
      </Select>
      <div class="transfer fn-clear">
        <div class="item float-left">
          <div class="search iconfont iconsearch">
            <Input :placeholder="$t('message.search')" />
          </div>
          <div class="item-content">
            <Tree :data="memberTreeData" show-checkbox @on-check-change="memberCheckChange"></Tree>
          </div>
        </div>
        <div class="item float-right">
          <ul class="results-list">
            <li v-for="(item,index) in selectedMember">
              <span>{{item.title}}</span>
              <i class="iconfont icondel" @click="deleteMember(item,index)"></i>
            </li>
          </ul>
        </div>
        <span class="arrow-group">>></span>
      </div>
    </Modal>
    <!-- 成员穿梭框弹层  end -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: true,
      selectType: "1", //被选项值
      //下拉选项
      typeList: [
        {
          value: "1",
          label: "all"
        },
        {
          value: "2",
          label: "enabled"
        },
        {
          value: "3",
          label: "disable"
        }
      ],
      groupList: [], //群组列表
      currentGroupIndex: 0, //当前群组
      currentGroupId: null, //当前群组id
      //表头
      columns: [
        {
          type: "selection",
          width: 52,
          align: "center"
        },
        {
          title: "Name",
          key: "username",
          ellipsis: true,
          tooltip: true
        },
        {
          title: "Title",
          key: "position",
          ellipsis: true,
          tooltip: true
        },
        {
          title: "Section",
          key: "section",
          ellipsis: true,
          tooltip: true,
          render: (h, params) => {
            return h("span", params.row.section.join(","));
          }
        },
        {
          title: "Phone Number",
          key: "mobile",
          width: 180,
          render: (h, params) => {
            let text = `+${params.row.country_code}${params.row.mobile}`;
            return h("span", text);
          }
        },
        {
          title: "E-mail",
          key: "mail_name",
          ellipsis: true,
          tooltip: true
        },
        {
          title: "Status",
          key: "active",
          render: (h, params) => {
            let text = params.row.active === "1" ? "Able" : "Disable";
            return h("span", text);
          }
        }
      ],
      //列表数据
      dataList: [],
      removeMember: [], //移除成员
      addMemberModal: false, //添加成员弹层
      selectedMember: [], //穿梭框被选中的成员
      memberTreeData: [],
      selectedMemberType: 0 //是否只查看enabled用户
    };
  },
  created() {
    this.initGroupList();
  },
  methods: {
    //管理群组
    manageGroups() {
      this.$router.push("/groupsmanage");
    },
    //初始化左侧群组列表
    initGroupList() {
      let _this = this;
      _this.$request.get("/group/list").then(res => {
        if (res.status === 1) {
          _this.groupList = res.result.list;
          _this.currentGroupId = res.result.list[0].id;
          _this.$nextTick(() => {
            _this.initMemberList();
          });
        }
      });
    },
    //群组切换
    groupItemClick(item, index) {
      this.currentGroupIndex = index;
      this.currentGroupId = item.id;
      this.initMemberList(item.id);
    },
    //初始化成员列表
    initMemberList(group_id) {
      let _this = this;
      _this.loading = true;
      _this.$request
        .get("/group/member", {
          id: group_id ? Number(group_id) : _this.groupList[0].id
        })
        .then(res => {
          if (res.status === 1) {
            _this.dataList = res.result.list;
            _this.loading = false;
          } else {
            _this.$Message.error(res.message);
          }
        });
    },
    selectChange(selection) {
      this.removeMember = selection;
    },
    //详情
    showDetail(row) {},
    //初始化树数据结构
    treeDepthInit(arr, filterId = null) {
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          item.expand = false;
          item.checked = false;
          if (item.children) {
            this.treeDepthInit(item.children);
          }
        });
      }
      return arr;
    },
    //初始化树数据结构
    treeDepthInit(arr, filterId = null) {
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          item.expand = false;
          item.checked = false;
          if (item.children) {
            this.treeDepthInit(item.children);
          }
        });
      }
      return arr;
    },
    //取消选中的节点
    cancelTreeCheck(arr, filterId) {
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.member_id === filterId) {
            item.checked = false;
          } else if (item.children) {
            this.cancelTreeCheck(item.children, filterId);
          }
        });
      }
      return arr;
    },
    //初始化树
    initMemberTree() {
      this.$request
        .get("/group/memberList", {
          id: this.currentGroupId,
          enabled: this.selectedMemberType
        })
        .then(res => {
          if (res.status === 1) {
            let data = this.treeDepthInit(res.result.list);
            data.length === 1 ? (data[0].expand = true) : "";
            this.memberTreeData = data;
          }
        });
    },
    memberCheckChange(data) {
      this.selectedMember = data.filter(item => {
        return item.id === -1;
      });
    },
    //添加成员
    addMember() {
      this.addMemberModal = true;
      this.initMemberTree();
    },
    //删除穿梭框选中的成员
    deleteMember(item, index) {
      this.selectedMember.splice(index, 1);
      this.memberTreeData = this.cancelTreeCheck(
        this.memberTreeData,
        item.member_id
      );
    },
    //取消添加成员
    addMemberCancle() {
      this.selectedMember = [];
      this.selectedMemberType = 0;
    },
    //确认添加成员
    addMemberOk() {
      let _this = this;
      if (_this.selectedMember.length === 0) {
        return false;
      }
      let arr = [];
      _this.selectedMember.forEach(item => {
        arr.push(item.member_id);
      });
      _this.$request
        .get("/group/addMember", {
          id: _this.currentGroupId,
          member_id: arr
        })
        .then(res => {
          if (res.status === 1) {
            _this.$Message.success(res.message);
            _this.initGroupList();
            _this.initMemberList(_this.currentGroupId);
            _this.selectedMemberType = 0;
          } else {
            _this.$Message.error(res.message);
          }
        });
    },
    //是否只查看enabled用户
    selectedMemberTypeChange(val) {
      this.selectedMemberType = val;
      this.initMemberTree();
    },
    shiftOut() {
      let _this = this;
      let arr = [];
      this.removeMember.forEach(item => {
        arr.push(item.id);
      });
      if (arr.length === 0) {
        this.$Message.warning("请选择成员！");
        return false;
      }
      _this.$request
        .get("/group/removeMember", {
          id: Number(_this.currentGroupId),
          member_id: arr
        })
        .then(res => {
          if (res.status === 1) {
            _this.$Message.success(res.message);
            _this.initGroupList();
            _this.initMemberList(_this.currentGroupId);
          } else {
            _this.$Message.error(res.message);
          }
        });
    }
  }
};
</script>
<style lang="scss">
.flex-layout .flex-side .btm-footer {
  cursor: pointer;
}
</style>