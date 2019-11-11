<template>
  <div class="flex-layout">
    <div class="flex-content">
      <div class="main-ctc">
        <!-- 顶部操作区   start -->
        <div class="content-header">
          <div class="item title">Groups</div>
          <button @click="createGroup">Create group</button>
        </div>
        <!-- 顶部操作区   start -->
        <div class="content-search">
          <div class="search iconfont iconsearch">
            <Input v-model="Search_name" @on-enter="initList" :placeholder="$t('message.search')"/>
          </div>
        </div>
        <div class="table">
          <Table
            ref="selection"
            :columns="columns"
            :data="dataList"
            :loading="loading"
            @on-row-click="showDetail"
          >
            <template slot-scope="{ row, index }" slot="action">
              <IconPoptip iconName="iconedit" title="Edit" @popClick="editGroup(row)"></IconPoptip>
              <IconPoptip iconName="icondel" title="Delete" @popClick="deleteGroup(row)"></IconPoptip>
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
    </div>
    <!-- 添加Modal start -->
    <Modal
      width="700"
      v-model="addOrEditModal"
      title="Add a group"
      class-name="vertical-center-modal"
      @on-ok="addOrEditOk('addOrEditForm')"
      @on-cancel="cancelEditOrAdd('addOrEditForm')"
      :ok-text="$t('operation.yes')"
      :cancel-text="$t('operation.cancle')"
    >
      <Form
        class="select-horizontal"
        ref="addOrEditForm"
        :model="addOrEditForm"
        :rules="addOrEditFormRules"
        label-position="left"
        :label-width="12"
      >
        <div class="form-title">Group details</div>
        <FormItem label="group_name" prop="group_name">
          <Input type="text" autocomplete="new-password" v-model.trim="addOrEditForm.group_name"
                 placeholder="Names"></Input>
        </FormItem>
        <FormItem label="description" prop="description">
          <Input type="text" v-model.trim="addOrEditForm.description" placeholder="Description"></Input>
        </FormItem>
        <FormItem label="group_alias" prop="group_alias">
          <Input
            autocomplete="new-password"
            type="text"
            v-model.trim="addOrEditForm.group_alias"
            placeholder="Group email"
            style="width: 80%;"
          ></Input>
          <span class="remark-text">{{mailType}}</span>
        </FormItem>
        <div class="form-title">Group details</div>
        <FormItem class="has-label" prop="access_type" label="Edit access type" :label-width="180">
          <RadioGroup v-model="addOrEditForm.access_type" @on-change="radioChange">
            <Radio label="0">Public</Radio>
            <Radio label="1">Private</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          class="has-label"
          prop="access_member"
          label="Members of the private"
          :label-width="180"
          v-if="isPrivate"
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
        </FormItem>
        <div class="description">*Indicates a required field</div>
      </Form>
    </Modal>
    <!-- 添加Modal end -->
    <!-- 删除Modal start -->
    <Modal
      v-model="deleteModal"
      title="Delete the group"
      class-name="vertical-center-modal"
      @on-ok="deleteOk()"
      :ok-text="$t('operation.delete')"
      :cancel-text="$t('operation.cancle')"
    >
      <div class="reminder">All group information , including its email addresses and settings, will be deleted.
        Members's
        account aren't deleted
      </div>
      <div class="reminder">
        You can't undo this action
      </div>
    </Modal>
    <!-- 删除Modal end -->
  </div>
</template>
<script>
    import regex from "@/utils/regex";

    export default {
        data() {
            let _this = this;
            //访问成员id集access_type为1时，member不能为空
            const accessMemberRule = (rule, value, callback) => {
                if (_this.addOrEditForm.access_type == "1") {
                    if (value.length > 0) {
                        callback();
                    }
                    value.length > 0
                        ? callback()
                        : callback(
                        new Error("In the private case, members must be selected")
                        );
                } else {
                    callback();
                }
            };
            return {
                Search_name:'',
                loading: true,
                addOrEditModal: false, //添加编辑弹层
                deleteModal: false, //删除提示弹层
                transferDepartment: [], //部门穿梭框右侧数据
                memberTreeData: [], //部门成员树
                selectedMember: [], //穿梭框被选中的成员
                selectedMemberType: 0, //是否只查看enabled用户
                mailType: "", //邮箱后缀
                isEdit: false, //编辑表单
                deleteGroupId: null, //删除群组id
                isPrivate: false,
                //表头
                columns: [
                    {
                        title: "Group name",
                        key: "group_name"
                    },
                    {
                        title: "Email address",
                        key: "position",
                        render: (h, params) => {
                            let text = `${params.row.group_alias}@${params.row.mail_domain}`;
                            return h("span", text);
                        }
                    },
                    {
                        title: "Members",
                        key: "member_count"
                    },
                    {
                        title: "Access type",
                        key: "access_type",
                        render: (h, params) => {
                            let text = params.row.access_type === "0" ? "public" : "private";
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
                //添加或修改部门
                addOrEditForm: {
                    group_name: "",
                    description: "",
                    group_alias: "",
                    access_type: "0",
                    access_member: []
                },
                addOrEditFormRules: {
                    group_name: [
                        {
                            required: true,
                            message: "Please fill in the name",
                            trigger: "blur"
                        }
                    ],
                    description: [
                        {
                            required: true,
                            message: "Please fill in the description.",
                            trigger: "blur"
                        }
                    ],
                    group_alias: [
                        {
                            pattern: regex.ennum_,
                            required: true,
                            message: "Please fill in the description.",
                            trigger: "blur"
                        }
                    ],
                    access_member: [
                        {
                            required: this.isPrivate,
                            validator: accessMemberRule
                        }
                    ]
                }
            };
        },
        created() {
            this.initList();
        },
        methods: {
            radioChange(val) {
                this.isPrivate = val === "1" ? true : false;
                this.isPrivate ? this.initMemberTree() : "";
            },
            //初始化树数据结构
            treeDepthInit(arr) {
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
            //初始化选中树结构
            initTreeCheck(arr, filterId) {
                if (Array.isArray(arr)) {
                    arr.forEach(item => {
                        if (item.id == filterId) {
                            item.checked = true;
                            // console.log(item)
                            this.selectedMember.push(item);
                        } else if (item.children) {
                            this.initTreeCheck(item.children, filterId);
                        }
                    });
                }

                return arr;
            },
            //初始化树
            // initMemberTree(val) {
            //     let _this = this;
            //     let list = [];
            //     if (val) {
            //         list = val.split(",");
            //     }
            //
            //     this.$request
            //         .get("/group/memberList", {
            //             id: this.currentGroupId,
            //             enabled: this.selectedMemberType
            //         })
            //         .then(res => {
            //             if (res.status === 1) {
            //                 let data = _this.treeDepthInit(res.result.list);
            //                 let newData = [];
            //                 list.forEach(item => {
            //                     newData = _this.initTreeCheck(data, item);
            //                 });
            //                 newData.length === 1 ? (newData[0].expand = true) : "";
            //                 _this.memberTreeData = newData;
            //                 // let data = this.treeDepthInit(res.result.list);
            //                 // newData.length === 1 ? (newData[0].expand = true) : "";
            //                 // this.memberTreeData = newData;
            //
            //             } else {
            //                 this.$Message.error(res.message);
            //             }
            //         });
            // },
            initMemberTree(arr) {
                this.$request
                    .get("/group/memberList", {
                        id: this.currentGroupId,
                        enabled: this.selectedMemberType
                    })
                    .then(res => {
                        if (res.status === 1) {
                            let data = this.treeDepthInit(res.result.list);
                            data.length === 1 ? (data[0].expand = true) : "";
                            if (arr) {
                                arr.forEach(item => {
                                    this.initTreeCheck(data, item);
                                });
                            }
                            this.memberTreeData = data;
                        }
                    });
            },
            memberCheckChange(data) {
                this.selectedMember = data.filter(item => {
                    return item.id === -1;
                });
                // console.log(this.selectedMember)
            },
            //是否只查看enabled用户
            selectedMemberTypeChange(val) {
                this.selectedMemberType = val;
                this.initMemberTree();
            },
            //删除穿梭框选中的成员
            deleteMember(item, index) {
                console.log(item);
                this.selectedMember.splice(index, 1);
                this.memberTreeData = this.cancelTreeCheck(this.memberTreeData, item.id);
                // console.log(this.memberTreeData)
            },
            //取消选中的节点
            cancelTreeCheck(arr, filterId) {
                if (Array.isArray(arr)) {
                    arr.forEach(item => {
                        if (item.id == filterId) {
                            item.checked = false;
                        } else if (item.children) {
                            this.cancelTreeCheck(item.children, filterId);
                        }
                    });
                }
                return arr;
            },
            //初始化列表
            initList() {
                let _this = this;
                _this.$request
                    .get("/group/list", {
                        page: _this.pageInfo.page_current,
                        page_size: _this.pageInfo.page_size,
                        search_name:this.Search_name
                    })
                    .then(res => {
                        if (res.status === 1) {
                            _this.dataList = res.result.list;
                            _this.pageInfo = res.result.page_info;
                            _this.loading = false;
                        }
                    });
            },
            //页码切换
            changePage(val) {
                this.pageInfo.page_current = val;
                this.initList();
            },
            //创建群组
            createGroup() {
                this.addOrEditModal = true;
                this.isEdit = false;
                this.addOrEditForm = {
                    group_name: "",
                    description: "",
                    group_alias: "",
                    access_type: "0",
                    access_member: []
                };
                this.selectedMember = [];
                let email = JSON.parse(window.localStorage.userInfo);
                this.mailType = "@" + email.username.split("@")[1];
            },
            //编辑群组
            editGroup(row) {
                this.isPrivate = parseInt(row.access_type);
                this.addOrEditModal = true;
                this.isEdit = true;
                this.addOrEditForm.id = row.id;
                this.addOrEditForm.group_name = row.group_name;
                this.addOrEditForm.description = row.description;
                this.addOrEditForm.group_alias = row.group_alias;
                this.addOrEditForm.access_type = row.access_type;
                this.initMemberTree(row.access_member.split(","));
                // console.log(row);
                this.$request
                    .get("group/member", {
                        id: row.id
                    })
                    .then(res => {
                        console.log(res);
                    });
                // this.addOrEditForm.access_member = row.group_name;
            },
            //确认创建群组
            addOrEditOk(name) {
                let _this = this;
                _this.addOrEditForm.access_type = Number(_this.addOrEditForm.access_type);
                _this.selectedMember.forEach(item => {
                    _this.addOrEditForm.access_member.push(item.member_id);
                });
                _this.$refs[name].validate(valid => {
                    if (valid) {
                        _this.$request
                            .post(
                                _this.isEdit ? "/group/update" : "/group/add",
                                _this.addOrEditForm
                            )
                            .then(res => {
                                if (res.status === 1) {
                                    this.initList();
                                    _this.$Message.success("Success!");
                                    _this.isPrivate = false;
                                } else {
                                    _this.$Message.error(res.message);
                                }
                            });
                    } else {
                        _this.$refs["addOrEditForm"].resetFields();
                        _this.$Message.error("表单验证未通过");
                    }
                });
            },
            //删除群组
            deleteGroup(row) {
                this.deleteModal = true;
                this.deleteGroupId = row.id;
            },
            //确认删除群组
            deleteOk() {
                let _this = this;
                _this.$request
                    .get("/group/delete", {
                        id: _this.deleteGroupId
                    })
                    .then(res => {
                        _this.$Message.success("Success!");
                        _this.initList();
                    });
            },
            //取消添加或修改部门
            cancelEditOrAdd(name) {
                this.$refs[name].resetFields();
                this.isEdit = false;
                this.isPrivate = false;
            },
            //穿梭框部门树点击事件
            treeClick(row) {
                if (row.length <= 0) {
                    return false;
                }
                let obj = {
                    id: "",
                    title: ""
                };
                obj.id = row.id;
                obj.title = row.title;
                let flag = this.transferDepartment.findIndex(value => {
                    return value.id == obj.id;
                });
                flag === -1 ? this.transferDepartment.push(obj) : "";
            },
            //删除选中的部门
            deleteDepartment(item, index) {
                this.transferDepartment.splice(index, 1);
            },
            //详情
            showDetail(row) {
                this.$router.push({
                    path: "groupsmanagedetail",
                    query: {
                        id: row.id
                    }
                });
            }
        }
    };
</script>
