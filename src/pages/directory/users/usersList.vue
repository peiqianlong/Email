<template>
  <div class="flex-content">
    <div class="main-ctc">
      <!-- 顶部操作区   start -->
      <div class="content-header">
        <div class="item title">{{$t('title.users')}}</div>
        <button @click="addUsers">{{$t('operation.add_new_user')}}</button>
        <div class="item operation">
          <button>{{$t('operation.import')}}</button>
          <ul class="oper-list">
            <li>{{$t('operation.import')}}</li>
            <li @click="temoDownLoad">{{$t('operation.download_the_template')}}</li>
          </ul>
        </div>
        <button @click="exportExel">{{$t('operation.export')}}</button>
        <button @click="operationUsers('delete')">{{$t('operation.delete')}}</button>
        <button @click="operationUsers('enable')">{{$t('operation.enabled')}}</button>
        <button @click="operationUsers('disable')">{{$t('operation.disabled')}}</button>
      </div>
      <!-- 顶部操作区   end -->
      <div class="content-search">
        <div class="search iconfont iconsearch">
          <Input @on-enter="initList" v-model="textValue" :placeholder="$t('message.search')"/>
        </div>
        <Select @on-change="initList" v-model="selectType" style="width:200px">
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
        >
          <template slot-scope="{ row, index }" slot="action">
            <IconPoptip
              :disabled="row.status"
              iconName="iconedit"
              title="Edit"
              @popClick="edit(row)"
            ></IconPoptip>
            <IconPoptip
              :disabled="row.status"
              iconName="iconrename"
              title="Rename user"
              @popClick="rename(row)"
            ></IconPoptip>
            <IconPoptip
              :disabled="row.status"
              iconName="iconadd_group"
              title="Add to groups"
              @popClick="addGroup(row)"
            ></IconPoptip>
          </template>
        </Table>
      </div>
    </div>
    <div class="btm-footer">
      <EMPage
        :currentPage="pageInfo.page_current"
        :totalPage="pageInfo.page_count"
        @on-change="changePage"
      ></EMPage>
    </div>
    <!-- rename Modal  start -->
    <Modal
      v-model="renameModal"
      title="Rename User"
      class-name="vertical-center-modal"
      @on-ok="renameOk"
    >
      <Form ref="updateName" :model="updateName" :rules="ruleUpdateName">
        <FormItem prop="username">
          <Input v-model.trim="updateName.username"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- rename Modal  end -->
    <!-- 部门穿梭框弹层  start -->
    <Modal
      v-model="ShuttleGroupModal"
      title="Add to groups"
      class-name="vertical-center-modal"
      @on-cancel="groupCancle"
      @on-ok="groupOk"
    >
      <div class="transfer fn-clear">
        <div class="item float-left">
          <div class="item-content">
            <div class="left-list">
              <ul v-if="groupList.length>0">
                <li
                  v-for="item in groupList"
                  :key="item.id"
                  @click="groupItemClick(item)"
                >{{item.group_name}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="item float-right">
          <ul class="results-list">
            <li v-for="(item,index) in selectedGroup">
              <span>{{item.group_name}}</span>
              <i class="iconfont icondel" @click="deleteGroup(item,index)"></i>
            </li>
          </ul>
        </div>
        <span class="arrow-group">>></span>
      </div>
    </Modal>
    <!-- 部门穿梭框弹层  end -->
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
        props: ["rowData"],
        data() {
            return {
                textValue: "",//
                deleteModal: false, //删除弹层
                //左侧树
                id: 0, //部门id
                departmentData: [],
                selectType: "0", //被选项值
                loading: true,
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
                    },
                    {
                        value: "3",
                        label: "Occupied"
                    }
                ],
                //表头
                columns: [
                    {
                        type: "selection",
                        width: 52,
                        align: "center"
                    },
                    {
                        title: this.$t("userListTableTh.name"),
                        key: "username",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: this.$t("userListTableTh.title"),
                        key: "position",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: this.$t("userListTableTh.section"),
                        key: "department",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: this.$t("userListTableTh.phone_number"),
                        key: "mobile",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: this.$t("userListTableTh.e_mail"),
                        key: "mail_name",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: this.$t("userListTableTh.status"),
                        key: "status",
                        render: (h, params) => {
                            let text =
                                params.row.status === "1"
                                    ? "Occupied"
                                    : params.row.active === "0"
                                    ? "Disabled"
                                    : "Enabled";
                            return h("span", text);
                        }
                    },
                    {
                        width: 160,
                        title: " ",
                        align: "right",
                        slot: "action"
                    }
                ],
                //列表数据
                dataList: [],
                //分页信息
                pageInfo: {
                    page_current: 1,
                    total: 0,
                    page_size: 20,
                    page_count: 0
                },
                renameModal: false, //重命名弹层
                //更新名称
                updateName: {
                    id: "",
                    username: ""
                },
                ruleUpdateName: {
                    username: [
                        {
                            required: true,
                            message: "Please fill in the usename.",
                            trigger: "blur"
                        }
                    ]
                },
                ShuttleGroupModal: false, //群组穿梭框弹层
                selectedGroup: [], //选中的群组
                isEdit: 0, //编辑或新增
                operationData: [], //删除、启用、禁用成员
                groupList: [],
                changeGroupMemberId: null //改变群组的成员id
            };
        },
        created() {
            this.initList();
        },
        computed: {
            operationDataIds() {
                let arr = [];
                this.operationData.forEach(item => {
                    arr.push(item.id);
                });
                return arr;
            }
        },
        methods: {
            //导出表格
            exportExel() {
                this.loading = true;
                require.ensure([], () => {
                    const {export_json_to_excel} = require('../../../utils/Export2Excel') //这个地址和页面的位置相关，这个地址是Export2Excel.js相对于页面的相对位置
                    const tHeader = ["Name", "Title", "Section", "Phone Number", "E-Mail", "Status"]; //这个是表头名称 可以是iveiw表格中表头属性的title的数组
                    const filterVal = ["username", "position", "department", "mobile", "mail_name", "status"]; //与表格数据配合 可以是iview表格中的key的数组
                    //格式化数据
                    let datainfo = this.dataList;
                    datainfo.forEach(item => {
                        item.status = item.status === "1"
                            ? "禁止操作"
                            : item.active === "0"
                                ? "启用"
                                : "禁用";
                    });

                    const list = datainfo; //表格数据，iview中表单数据也是这种格式！
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '用户列表数据'); //列表excel  这个是导出表单的名称
                    this.downloadLoading = false
                })
            },
            formatJson(filterVal, jsonData) {
                this.loading = false;
                this.initList();
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            //模板下载
            temoDownLoad() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('../../../utils/Export2Excel');
                    const tHeader = ["Name", "Account", "Sex", "Phone Number", "Tel", "Address", "Section", "Title", 'Identity', 'Group', 'Logon_rights', 'Active', 'Status'];
                    const filterVal = ["Name", "Account", "Sex", "Phone Number", "Tel", "Address", "Section", "Title", 'Identity', 'Group', 'Logon_rights', 'Active', 'Status'];
                    const list = [{
                        "Name": '成员',
                        "Account": 'sssss@gia.com',
                        "Sex": '男',
                        "Phone Number": '+8615124579542',
                        "Tel": '+865421587',
                        "Address": '陕西省西安市',
                        "Section": '部门1,部门2',
                        "Title": 'title',
                        'Identity': '普通用户',
                        'Group': '测试',
                        'Logon_rights': 'imap/smtp',
                        'Active': '禁用',
                        'Status': '否'
                    }];
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '模板'); //列表excel  这个是导出表单的名称
                    this.downloadLoading = false
                })
            },

            //列表信息
            initList() {
                let _this = this;
                _this.$request
                    .get("/member/list", {
                        gid: _this.rowData.id ? _this.rowData.id : -1,
                        page: _this.pageInfo.page_current,
                        page_size: _this.pageInfo.page_size,
                        search_name: this.textValue,
                        search_type: this.selectType
                    })
                    .then(res => {
                        if (res.status === 1) {
                            _this.dataList = res.result.list;
                            _this.pageInfo = res.result.page_info;
                            _this.dataList.forEach(item => {
                                item._disabled = item.status == 1 ? true : false;
                                item.department = item.department.join(",");
                            });
                            _this.loading = false;
                        } else {
                            _this.$Message.error(res.message);
                        }
                    });
            },
            //页码切换
            changePage(val) {
                this.pageInfo.page_current = val;
                this.initList();
            },
            selectChange(selection) {
                this.operationData = selection;
            },
            //添加成员
            addUsers() {
                this.isEdit = 0;
                this.$router.push({
                    path: "usersform",
                    query: {
                        isEdit: this.isEdit
                    }
                });
            },
            operationUsers(str) {
                let _this = this;
                if (_this.operationDataIds.length === 0) {
                    _this.$Message.warning("请选择成员");
                    return false;
                } else {
                    if (str === "delete") {
                        _this.deleteModal = true;
                        return false;
                    }
                    _this.$request
                        .get(`/member/${str}`, {
                            id: _this.operationDataIds
                        })
                        .then(res => {
                            if (res.status === 1) {
                                _this.$Message.success(res.message);
                                this.operationData = []
                                _this.initList();
                            } else {
                                _this.$Message.error(res.message);
                            }
                        });
                }
            },
            //删除确认
            deleteOk() {
                this.$request
                    .get(`/member/delete`, {
                        id: this.operationDataIds
                    })
                    .then(res => {
                        if (res.status === 1) {
                            this.$Message.success(res.message);
                            this.operationData = []
                            this.initList();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
            },
            //编辑
            edit(row) {
                this.isEdit = 1;
                this.$router.push({
                    path: "usersform",
                    query: {
                        isEdit: this.isEdit,
                        id: row.id
                    }
                });
            },
            //显示重命名弹层
            rename(row) {
                this.renameModal = true;
                this.updateName.id = row.id;
                this.updateName.username = row.username;
            },
            //确认重命名
            renameOk() {
                let _this = this;
                this.$refs["updateName"].validate(valid => {
                    if (valid) {
                        _this.$request.post("/member/rename", _this.updateName).then(res => {
                            if (res.status === 1) {
                                _this.$Message.success(res.message);
                                _this.initList();
                            } else {
                                _this.$Message.error(res.message);
                            }
                        });
                    } else {
                        this.$Message.error("Fail!");
                    }
                });
            },
            //显示群组弹层
            addGroup(row) {
                this.groupListGet();
                this.ShuttleGroupModal = true;
                this.changeGroupMemberId = row.id;
                this.$request.get("/member/detail", {id: row.id}).then(res => {
                    if (res.status === 1) {
                        this.selectedGroup = res.result.group;
                    }
                });
            },
            //选中群组
            groupItemClick(item) {
                let obj = {
                    group_id: "",
                    group_name: ""
                };
                obj.group_id = item.id;
                obj.group_name = item.group_name;
                let flag = this.selectedGroup.findIndex(value => {
                    return value.group_id == obj.group_id;
                });
                flag === -1 ? this.selectedGroup.push(obj) : "";
            },
            //获取群组信息
            groupListGet() {
                let _this = this;
                _this.$request.get("/group/list").then(res => {
                    if (res.status === 1) {
                        _this.groupList = res.result.list;
                    }
                });
            },
            //删除群组
            deleteGroup(item, index) {
                this.selectedGroup.splice(index, 1);
            },
            //群组确认
            groupOk() {
                let _this = this;
                let group_ids = [];
                _this.selectedGroup.forEach(item => {
                    group_ids.push(item.id);
                });
                if (group_ids.length > 0) {
                    _this.$request
                        .post("/member/changeGroup", {
                            id: Number(_this.changeGroupMemberId),
                            group_id: group_ids
                        })
                        .then(res => {
                            if (res.status === 1) {
                                _this.initList();
                                _this.$Message.success(res.message);
                            } else {
                                _this.$Message.error(res.message);
                            }
                            _this.selectedGroup = [];
                        });
                }
            },
            groupCancle() {
                this.selectedGroup = [];
            },
            //详情
            showDetail(row) {
                this.$router.push({
                    path: "usersdetail",
                    query: {
                        id: row.id
                    }
                });
            }
        },
        watch: {
            rowData(val) {
                this.loading = true;
                this.initList();
            }
        }
    };
</script>
