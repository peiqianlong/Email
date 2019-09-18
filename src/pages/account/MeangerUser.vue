<template>
  <div class="flex-layout">
    <div class="flex-content">
      <div class="main-ctc">
        <!-- 顶部操作区   start -->
        <div class="content-header">
          <div class="item title">Administrator role</div>
          <button @click="createRole">Creat Role</button>
          <button @click="delRole">Delete Role</button>
        </div>
        <!-- 顶部操作区   start -->
        <div class="content-search">
          <div class="search iconfont iconsearch">
            <Input v-model="search" @on-enter="initList" :placeholder="$t('message.search')"/>
          </div>
          <div class="searchBtn" @click="initList">Search</div>
        </div>
        <div class="table">
          <Table
            ref="selection"
            :columns="internalColumns"
            :data="internalList"
            @on-selection-change="selectChange"
          ></Table>
        </div>
      </div>
    </div>
    <!-- 添加Modal start -->
    <Modal
      width="520"
      v-model="addOrEditModal"
      title="Creat New Role"
      class-name="vertical-center-modal"
      :ok-text="$t('operation.yes')"
      :cancel-text="$t('operation.cancle')"
      @on-ok="addRoleOk('formValidate')"
    >
      <Form :model="formItem" :rules="ruleValidate" ref="formValidate">
        <FormItem prop="input">
          <Input v-model="formItem.input" placeholder="Name"></Input>
        </FormItem>
        <FormItem>
          <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 5,maxRows: 5}"
                 placeholder="Description"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 添加Modal end -->
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
    import regex from "@/utils/regex";

    export default {
        data() {
            return {
                loading: true,
                addOrEditModal: false, //添加编辑弹层
                deleteModal: false, //删除提示弹层
                formItem: {
                    input: "",
                    textarea: ""
                },
                ruleValidate: {
                    i: [
                        {required: true, message: 'The name cannot be empty', trigger: 'blur'}
                    ],
                },
                internalColumns: [
                    {
                        type: "selection",
                        width: 52,
                        align: "center"
                    }, {
                        title: "Role Name",
                        key: "title",
                        width: 320,
                        ellipsis: true,
                        tooltip: true
                    }
                    , {
                        title: "Member Number",
                        key: "member_num",
                        ellipsis: true,
                        tooltip: true
                    },
                ],
                internalList: [],
                selectInfo: [],
                search: ""


            };
        },
        created() {
            this.initList();
        },
        methods: {
            //表格选择
            selectChange(val) {
                this.selectInfo = val
            },
            //初始化列表
            initList() {
                let _this = this;
                _this.$request
                    .get("/role/list", {search_name: this.search})
                    .then(res => {
                        if (res.status === 1) {
                            _this.loading = false;
                            this.internalList = res.result.list
                        }
                    });
            },
            //页码切换
            changePage(val) {
                this.pageInfo.page_current = val;
                this.initList();
            },
            //创建弹窗
            createRole() {
                this.addOrEditModal = true
            },
            //创建确认弹窗
            addRoleOk(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let prams = {
                            title: this.formItem.input,
                            description: this.formItem.textarea
                        }
                        this.$request.post("/role/add", prams).then(res => {
                            if (res.status) {
                                this.initList();
                                this.$Message.success('Success!');
                            }

                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            delRole() {
                if (this.selectInfo.length === 0) {
                    this.$Message.warning("Please add members")
                } else {
                    this.deleteModal = true
                }
            },
            //确认删除
            deleteOk() {
                let arr = []
                this.selectInfo.forEach(item => {
                    arr.push(item.id)
                })
                this.$request.post("/role/delete", {id: arr}).then(res => {
                    if (res.status) {
                        this.$Message.error(res.message);
                        this.initList();
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            }
        }
    };
</script>
