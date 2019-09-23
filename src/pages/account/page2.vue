<template>
  <div class="flex-layout">
    <!-- 左侧内容   start -->
    <div class="flex-side">
      <div class="main-ctc">
        <div class="search iconfont iconsearch">
          <Input v-model="textValue" @on-enter="initGroupList" :placeholder="$t('message.search')"/>
        </div>
        <div class="left-list">
          <ul v-if="groupList.length>0">
            <li
              v-for="(item,index) in groupList"
              :key="item.id"
              @click="groupItemClick(item,index)"
              :class="{'on':index===currentGroupIndex}"
            >{{`${item.title}(${item.member_num})`}}
            </li>
          </ul>
        </div>
      </div>
      <div class="btm-footer">
        <button @click="Manageroles">Manage groups</button>
      </div>
    </div>
    <!-- 左侧内容   end -->
    <!-- 右侧内容   start -->
    <div class="flex-content">
      <div class="main-ctc">
        <!-- 顶部操作区   start -->
        <div class="content-header">
          <div class="item title">Administrator role</div>
          <button @click="openadd" v-if="line === 1">Add Member</button>
          <button @click="shiftOut" v-if="line === 1">Delete</button>
        </div>
        <div class="content-sel">
          <div @click="selline(1)" class="meber" :class="[line == 1 ? 'selcolor':'']">Members</div>
          <div @click="selline(0)" class="right" :class="[line == 0 ? 'selcolor':'']">Rights</div>
          <div class=" line
          " :style="{'transform':line ==1 ?' translateX(16px)' : 'translateX(99px)','width':line ==1 ?' 83px' : '64px'
          }">
          </div>
        </div>
        <!-- 顶部操作区   end -->
        <div v-if="line === 1" class="content-search">
          <div class="search iconfont iconsearch">
            <Input @on-enter="initGroupList" v-model="serchValue" :placeholder="$t('message.search')"/>
          </div>
          <div class="searchBtn">Search</div>
        </div>
        <div v-if="line === 1" class="table">
          <Table
            ref="selection"
            :columns="columns"
            :data="dataList"
            @on-selection-change="selectChange"
            :loading="loading"
          ></Table>
        </div>
        <div v-else class="Rights">
          <Tree @on-check-change="selectright" :data="roleList" show-checkbox></Tree>
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
            <Input :placeholder="$t('message.search')"/>
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
      title="Delete the member"
      class-name="vertical-center-modal"
      @on-ok="deleteOk()"
    >
      <div class="reminder">Are you sure to delete these members？</div>
    </Modal>
    <!-- 删除Modal end -->
  </div>
</template>
<script>
    export default {
        data() {
            return {
                line: 1,//选中的
                searchinfo: [],//左侧列表临时数据
                textValue: "",//左侧搜索数据
                serchValue: "",//搜索数据
                loading: false,
                deleteModal: false, //删除
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
                        key: "name",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "E-mail",
                        key: "mail",
                        ellipsis: true,
                        tooltip: true
                    }, {
                        title: "Phone Number",
                        key: "mobile",
                        ellipsis: true,
                        tooltip: true
                    },

                ],
                //列表数据
                dataList: [],
                addMemberModal: false, //添加成员弹层
                selectedMember: [], //穿梭框被选中的成员
                selectedMemberType: 0,//是否只查看enabled用户
                memberTreeData: [],
                removeMember: [], //移除成员
                roleList: [],
                data2: [
                    {

                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    }
                                ]
                            },
                            {
                                title: 'parent 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1'
                                    },
                                    {
                                        title: 'leaf 1-2-1'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
        },
        created() {
            this.initGroupList();
        },
        methods: {
            selline(val) {
                this.line = val
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
            //初始化左侧群组列表
            initGroupList() {
                let _this = this;
                _this.$request.get("/role/list", {search_name: this.textValue}).then(res => {
                    if (res.status === 1) {
                        _this.groupList = res.result.list;
                        _this.currentGroupId = res.result.list.length > 0 ? res.result.list[0].id : null;
                        _this.$nextTick(() => {
                            _this.initMemberList();
                        });

                        _this.$request.get('/role/rights').then(res => {
                            _this.roleList = this.treeDepthInitTitle(res.result.list);
                            if (_this.groupList.length > 0) {
                                _this.groupList[0].rights.forEach(item => {
                                    this.initTreeCheck(_this.roleList, item);
                                })
                            }
                        })
                    }
                });

            },
            //管理群组
            Manageroles() {
                this.$router.push("/MeangerUser");
            },
            //群组切换
            groupItemClick(item, index) {
                this.currentGroupIndex = index;
                this.currentGroupId = item.id;
                this.initMemberList(item.id);
                this.treeDepthInitTitle(this.roleList)
                item.rights.forEach(item => {
                    this.initTreeCheck(this.roleList, item)
                })
            },
            //初始化成员列表
            initMemberList(group_id) {
                let _this = this;
                if (_this.groupList.length > 0) {
                    _this.loading = true;
                    _this.$request.get("/role/member", {
                        id: group_id ? Number(group_id) : _this.groupList[0].id,
                    })
                        .then(res => {
                            if (res.status === 1) {
                                _this.dataList = res.result.list;
                                // _this.selectedMember = res.result.rights_id;
                                _this.loading = false;
                            } else {
                                _this.$Message.error(res.message);
                            }
                        });
                }

            },
            selectChange(selection) {
                this.removeMember = selection;
            },
            //点击terr的复选框
            selectright(val) {
                let prams = [];
                val.forEach(item => {
                    prams.push(item.id)
                });
                this.$request.post("/role/updateRigths", {id: this.currentGroupId, rights_id: prams}).then(res => {
                    this.$Message.success(res.message)

                })
            },
            //初始化树数据结构title的选中状态
            //初始化选中树结构
            initTreeCheck(arr, filterId) {
                if (Array.isArray(arr)) {
                    arr.forEach(item => {
                        if (item.id == filterId) {
                            item.checked = true;
                        } else if (item.children) {
                            this.initTreeCheck(item.children, filterId);
                        }
                    });
                }

                return arr;
            },
            //初始化树数据结构title
            treeDepthInitTitle(arr, filterId = null) {
                if (Array.isArray(arr)) {
                    arr.forEach(item => {
                        item.expand = false;
                        item.checked = false;
                        item.title = item.name;
                        if (item.children) {
                            this.treeDepthInitTitle(item.children);
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
            //初始化树
            initMemberTree() {
                this.$request
                    .get("/role/memberList", {
                        id: null,
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
            //添加成员
            openadd() {
                this.addMemberModal = true
                this.initMemberTree();
            },
            // 取消添加成员
            addMemberCancle() {
                this.selectedMember = [];
                this.selectedMemberType = 0;
            },
            //选择切换
            selectedMemberTypeChange(val) {
                this.selectedMemberType = val;
                this.initMemberTree();
            },
            memberCheckChange(data) {
                this.selectedMember = data.filter(item => {
                    return item.id === -1;
                });
            },
            //却认添加成员
            addMemberOk() {
                let arr = []
                this.selectedMember.forEach(item => {
                    arr.push(item.member_id)
                });
                this.$request.post("/role/addMember", {id: this.currentGroupId, member_id: arr}).then(res => {
                    if (res.status) {
                        this.$Message.success(res.message);
                        this.initGroupList();
                    }
                })
            },
            //取消选中的节点
            cancelTreeCheck(arr, filterId, prrentId) {
                if (Array.isArray(arr)) {
                    arr.forEach(item => {
                        item.checked = false;
                        if (prrentId == item.id) {
                            item.checked = false;
                            item.children.forEach(itemchildrte => {
                                if (itemchildrte.member_id === filterId) {
                                    itemchildrte.checked = false;
                                }
                            })
                        } else {
                            this.cancelTreeCheck(item.children, filterId, prrentId);
                        }

                    });
                }

                return arr;

            },
            //删除穿梭框选中的成员
            deleteMember(item, index) {
                this.selectedMember.splice(index, 1);
                // this.memberTreeData =
                let arr = this.cancelTreeCheck(
                    this.memberTreeData,
                    item.member_id,
                    item.parent_id,
                );
                this.memberTreeData = arr;
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
                } else {
                    this.deleteModal = true;
                }
            },
            //确认上删除
            deleteOk() {
                let _this = this;
                let arr = [];
                this.removeMember.forEach(item => {
                    arr.push(item.member_id);
                });
                _this.$request
                    .post("/role/deleteMember", {
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

  .Rights {
    padding-left: 16px;
    padding-top: 6px;
  }

  .content-sel {
    height: 54px;
    border-bottom: 1px solid rgba(242, 242, 242, 1);
    display: flex;
    position: relative;
    text-align: center;

    .meber {
      margin-left: 16px;
      width: 83px;
      height: 100%;
      line-height: 54px;
      color: rgba(119, 119, 119, 1);
      font-weight: 400;
      cursor: pointer;
    }

    .right {
      width: 64px;
      height: 100%;
      line-height: 54px;
      color: rgba(119, 119, 119, 1);
      font-weight: 400;
      cursor: pointer;
    }

    .selcolor {
      color: rgba(76, 132, 255, 1);
      font-weight: bold;
    }

    .line {
      position: absolute;
      height: 2px;
      width: 83px;
      bottom: 0;
      background: rgba(76, 132, 255, 1);
      transition: all 150ms linear;
    }
  }

</style>
