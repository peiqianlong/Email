<template>
  <div class="flex-layout">
    <!-- 左侧内容   start -->
    <div class="flex-side">
      <div class="main-ctc">
        <div class="search iconfont iconsearch">
          <Input v-model="textValue" @on-blur="blur" @on-enter="search" :placeholder="$t('message.search')"/>
        </div>
        <div class="left-list">
          <ul v-if="groupList.length>0">
            <li
              v-for="(item,index) in groupList"
              :key="item.id"
              @click="groupItemClick(item,index)"
              :class="{'on':index===currentGroupIndex}"
            >{{`${item.group_name}(${item.member_count})`}}
            </li>
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
            <Input @on-enter="initGroupList" @on-blur="blur2" v-model="serchValue" :placeholder="$t('message.search')"/>
          </div>
          <Select @on-change="initGroupList" v-model="selectType" style="width:200px;">
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
      <div class="btm-footer">
        <EMPage
          :currentPage="pageInfo.page_current"
          :totalPage="pageInfo.page_count"
          @on-change="changePage"
        ></EMPage>
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
            <Input v-model="searchName" :placeholder="$t('message.search')"/>
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
    <!-- 删除Modal start -->
    <Modal
      v-model="deleteModal"
      title="Shift Out Members"
      class-name="vertical-center-modal"
      @on-ok="deleteOk()"
      :ok-text="$t('operation.delete')"
      :cancel-text="$t('operation.cancle')"
    >
      <div class="reminder">Are you sure to shift out these members？
      </div>
    </Modal>
    <!-- 删除Modal end -->
  </div>
</template>
<script>
    export default {
        data() {
            return {
                searchinfo: [],//左侧列表临时数据
                textValue: "",//左侧搜索数据
                serchValue: "",//搜索数据
                searchName: "",
                loading: true,
                deleteModal: false, //删除
                selectType: "0", //被选项值
                //下拉选项
                typeList: [
                    {
                        value: "0",
                        label: "all"
                    },
                    {
                        value: "1",
                        label: "enabled"
                    },
                    {
                        value: "2",
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
                            let text =
                                params.row.status === 1
                                    ? "Occupied"
                                    : params.row.active === 0
                                    ? "Disabled"
                                    : "Enabled";
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
                selectedMemberType: 0,//是否只查看enabled用户
                pageInfo: {
                    page_current: 1,
                    total: 0,
                    page_size: 10,
                    page_count: 0
                }
            };
        },
        created() {
            this.initGroupList();
        },
        methods: {
            //失焦
            blur() {
                if (this.textValue == '') {
                    this.initGroupList();
                }
            },
            blur2() {
                if (this.serchValue == '') {
                    this.initMemberList(this.currentGroupId);
                }
            },
            //分页
            changePage(val) {
                debugger
                this.pageInfo.page_current = val;
                this.initGroupList();
            },
            //左侧搜索
            search() {
                let _this = this;
                _this.$request.get("/group/list").then(res => {
                    if (res.status === 1) {
                        _this.groupList = res.result.list;
                        _this.currentGroupId = res.result.list[0].id;
                        _this.$nextTick(() => {
                            _this.initMemberList();
                            //重置数据后开始搜索
                            this.searchinfo = [];
                            let val = this.textValue;
                            let tree = this.groupList;
                            if (val !== '') {
                                this.datalist(val, tree);
                                this.groupList = this.searchinfo;
                            }

                        });
                    }
                });
            },
            //选出合适数据
            datalist(val, tree) {
                if (Array.isArray(tree)) {
                    tree.forEach(item => {
                        if (item.group_name.includes(val)) {
                            this.searchinfo.push(item)
                        } else if (item.children) {
                            this.datalist(val, item.children);
                        }
                    })
                }
            },
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
                        id: group_id ? Number(group_id) : _this.currentGroupId,
                        search_name: this.serchValue,
                        search_type: this.selectType,
                        page: this.pageInfo.page_current,
                        page_size: this.pageInfo.page_size
                    })
                    .then(res => {
                        if (res.status === 1) {
                            _this.dataList = res.result.list;
                            _this.pageInfo = res.result.page_info;
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
            showDetail(row) {
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
                this.selectedMember = []
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
                    this.$Message.warning("Please select members!");
                    return false;
                } else {
                    this.deleteModal = true;
                }
            },
            //确认上删除
            deleteOk() {
                let _this = this;
                let arr = [];
                this.removeMember.forEach(item => {
                    arr.push(item.id);
                });
                _this.$request
                    .get("/group/removeMember", {
                        id: Number(_this.currentGroupId),
                        member_id: arr
                    })
                    .then(res => {
                        if (res.status === 1) {
                            _this.$Message.success(res.message);
                            this.removeMember = [];
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
