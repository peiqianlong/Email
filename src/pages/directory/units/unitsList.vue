<template>
  <div class="flex-layout">
    <div class="flex-content">
      <div class="main-ctc">
        <!-- 顶部操作区   start -->
        <div class="content-header">
          <div class="item title">{{$t('title.units')}}</div>
          <button @click="createUnit">{{$t('operation.create_unit')}}</button>
        </div>
        <!-- 顶部操作区   start -->
        <div class="content-search">
          <div class="search iconfont iconsearch">
            <Input v-model="serchValue" @on-blur="blur" @on-enter="search" :placeholder="$t('message.search')"/>
          </div>
        </div>
        <div class="table">
          <TreeGrid :items="dataList" :columns="columns" @on-row-click="rowClick"></TreeGrid>
        </div>
      </div>
      <div class="btm-footer">
        <!-- <Page
          :current="5"
          :total="18"
          @prevPage="prevPage"
          @nextPage="nextPage"
          @goFirstPage="goFirstPage"
          @goLastPage="goLastPage"
        ></Page>-->
      </div>
    </div>
    <!-- 添加Modal start -->
    <Modal
      v-model="addOrEditModal"
      title="Create new organizational unit"
      class-name="vertical-center-modal"
      @on-ok="addOrEditOk('addOrEditForm')"
      @on-cancel="cancelEditOrAdd('addOrEditForm')"
      :ok-text="$t('operation.yes')"
      :cancel-text="$t('operation.cancle')"
    >
      <div
        class="description"
      >Creat new organizational unit for users who need specific features and settings..
      </div>
      <Form
        ref="addOrEditForm"
        :model="addOrEditForm"
        :rules="addOrEditFormRules"
        label-position="left"
        :label-width="12"
      >
        <FormItem label="title" prop="title">
          <Input
            type="text"
            v-model.trim="addOrEditForm.title"
            placeholder="Name of organizational unit"
          ></Input>
        </FormItem>
        <FormItem label="description" prop="description">
          <Input type="text" v-model.trim="addOrEditForm.description" placeholder="Description"></Input>
        </FormItem>
        <div style="font-size: 14px;line-height: 17px;color: #777;">Parent organzational unit*</div>
        <FormItem v-if="isCreatUnit" prop="parent_id">
          <div class="tree-select">
            <Tree :data="unitsTree" @on-select-change="createUnitTreeClick"></Tree>
          </div>
        </FormItem>
      </Form>
    </Modal>
    <!-- 添加Modal end -->
    <!-- 移动Modal  start -->
    <Modal
      v-model="moveModal"
      title="Move organizational unit"
      class-name="vertical-center-modal"
      @on-ok="moveUnitOk"
      @on-cancel="cancelMoveUnit"
      :ok-text="$t('operation.move')"
      :cancel-text="$t('operation.cancle')"
    >
      <div class="tree-select">
        <Tree :data="unitsTree" @on-select-change="moveUnitTreeClick"></Tree>
      </div>
    </Modal>
    <!-- 移动Modal  end -->
    <!-- 删除Modal start -->
    <Modal
      v-model="deleteModal"
      title="Delete organizational unit"
      class-name="vertical-center-modal"
      @on-ok="deleteOk()"
      :ok-text="$t('operation.delete')"
      :cancel-text="$t('operation.cancle')"

    >
      <div class="reminder">You are about to delete organizational unit. This organization can'tbe deleted if it has usere</div>
    </Modal>
    <!-- 删除Modal end -->
  </div>
</template>
<script>
    import TreeGrid from "./TreeGrid.vue";

    export default {
        components: {
            TreeGrid
        },
        data() {
            let _this = this;
            return {
                searchinfo: [],//搜索时候的tree
                serchValue: "",//搜索值
                loading: false,
                addOrEditModal: false, //添加编辑
                isCreatUnit: false, //创建
                moveModal: false, //移动
                deleteModal: false, //删除
                deleteUnitId: null, //要删除unit的id
                isEdit: false,
                departmentData: [],
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
                //表头
                columns: [
                    {
                        title: _this.$t("unitsTableTh.name"),
                        key: "title"
                    },
                    {
                        title: _this.$t("unitsTableTh.discription"),
                        key: "description"
                    },
                    {
                        title: "操作",
                        type: "action",
                        actions: [
                            {
                                iconName: "iconedit",
                                title: _this.$t("popbutton.edit"),
                                type: "edit"
                            },
                            {
                                iconName: "iconmove",
                                title: _this.$t("popbutton.move"),
                                type: "move"
                            },
                            {
                                iconName: "iconicon_add",
                                title: _this.$t("popbutton.add"),
                                type: "add"
                            },
                            {
                                iconName: "icondel",
                                title: _this.$t("popbutton.delete"),
                                type: "delete"
                            }
                        ]
                    }
                ],
                id: 0, //部门id
                dataList: [], //列表数据
                //添加或修改部门
                addOrEditForm: {
                    id: "",
                    parent_id: "",
                    title: "",
                    description: ""
                },
                addOrEditFormRules: {
                    title: [
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
                    ]
                },
                unitsTree: [], //部门树
                unitsMoveInfo: {
                    id: "",
                    parent_id: ""
                },
                unitsMoveParentId: null, //要移动至父级部门信息
                //分页信息
                pageInfo: {}
            };
        },
        created() {
            this.initList();
        },
        methods: {
            //失焦
            blur() {
                if (this.serchValue == '') {
                    this.initList();
                }
            },
            //搜索、search
            search() {
                let _this = this;
                _this.loading = true;
                _this.$request
                    .get("/department/index", {
                        id: _this.id
                    })
                    .then(res => {
                        if (res.status === 1) {
                            _this.dataList = res.result.list;
                            _this.dataList.forEach(item => {
                                _this.addDisableExpand(item);
                            });

                            this.searchinfo = [];
                            let val = this.serchValue;
                            let tree = this.dataList;
                            if (val !== '') {
                                this.datalist(val, tree);
                                this.dataList = this.searchinfo;
                                _this.loading = false;
                            }
                        } else {
                            _this.$Message.err(res.message);
                        }
                    });
            },
            //选出合适数据
            datalist(val, tree) {
                if (Array.isArray(tree)) {
                    tree.forEach(item => {
                        if (item.title.includes(val)) {
                            this.searchinfo.push(item)
                        } else if (item.children) {
                            this.datalist(val, item.children);
                        }
                    })
                }
            },
            rowClick(data, type) {
                switch (type) {
                    //编辑
                    case "edit":
                        this.addOrEditModal = true;
                        this.isEdit = true;
                        this.addOrEditForm.id = data.id;
                        this.addOrEditForm.title = data.title;
                        this.addOrEditForm.description = data.description;
                        break;
                    //移动
                    case "move":
                        this.moveModal = true;
                        this.unitsMoveInfo.id = data.id;
                        this.unitsTreeGet();
                        break;
                    //添加
                    case "add":
                        this.addOrEditModal = true;
                        this.isEdit = false;
                        this.addOrEditForm.parent_id = data.id;
                        this.addOrEditForm.title = "";
                        this.addOrEditForm.description = "";
                        break;
                    //删除
                    case "delete":
                        this.deleteModal = true;
                        this.deleteUnitId = data.id;
                        break;
                }
            },
            //取消最后一级展开事件
            addDisableExpand(data) {
                if (data.children) {
                    data.children.forEach(item => {
                        this.addDisableExpand(item);
                    });
                } else {
                    data._disableExpand = true;
                }
                return data;
            },
            //获取列表
            initList(id = null) {
                let _this = this;
                _this.loading = true;
                _this.$request
                    .get("/department/index", {
                        id: _this.id
                    })
                    .then(res => {
                        if (res.status === 1) {
                            _this.dataList = res.result.list;
                            _this.dataList.forEach(item => {
                                _this.addDisableExpand(item);
                            });
                            _this.loading = false;
                        } else {
                            _this.$Message.error(res.message);
                        }
                    });
            },
            //添加或修改部门确认
            addOrEditOk(name) {
                let _this = this;
                _this.$refs[name].validate(valid => {
                    if (valid) {
                        if (_this.isEdit) {
                            let data = {
                                id: "",
                                title: "",
                                description: ""
                            };
                            data.id = _this.addOrEditForm.id;
                            data.title = _this.addOrEditForm.title;
                            data.description = _this.addOrEditForm.description;
                            _this.$request.post("/department/update", data).then(res => {
                                if (res.status === 1) {
                                    _this.$Message.success("Success!");
                                    _this.initList(_this.addOrEditForm.id);
                                } else {
                                    _this.$Message.error(res.message);
                                }
                            });
                        } else {
                            let data = {
                                parent_id: "",
                                title: "",
                                description: ""
                            };
                            if (_this.addOrEditForm.parent_id == '') {
                                _this.$Message.error("Please choose the legitimate department.");
                                return
                            }
                            data.parent_id = _this.addOrEditForm.parent_id;
                            data.title = _this.addOrEditForm.title;
                            data.description = _this.addOrEditForm.description;
                            _this.$request.post("/department/add", data).then(res => {
                                if (res.status === 1) {
                                    _this.$Message.success("Success!");
                                    _this.isCreatUnit = false;
                                    _this.initList();
                                } else {
                                    _this.$Message.error(res.message);
                                }
                            });
                        }
                    } else {
                        _this.$refs["addOrEditForm"].resetFields();
                        _this.$Message.error("Fail!");
                    }
                });
            },
            //创建部门
            createUnit() {
                this.unitsTreeGet();
                this.addOrEditModal = true;
                this.isEdit = false;
                this.isCreatUnit = true;
            },
            createUnitTreeClick(row) {
                this.addOrEditForm.parent_id = row.length > 0 ? row[0].id : "";
            },
            //取消添加或修改部门
            cancelEditOrAdd(name) {
                this.$refs[name].resetFields();
                this.isCreatUnit = false;
            },
            //确认删除部门
            deleteOk() {
                let _this = this;
                _this.$request
                    .get("/department/delete", {
                        id: _this.deleteUnitId
                    })
                    .then(res => {
                        if(res.status === 1){
                            _this.$Message.success(res.message);
                        }else {
                            _this.$Message.error(res.message);
                        }

                        _this.initList();
                    });
            },
            //初始化树数据结构
            treeDepthInit(arr, filterId = null) {
                if (Array.isArray(arr)) {
                    arr.forEach(item => {
                        item.selected = false;
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
            //初始化移动弹层树
            unitsTreeGet() {
                let _this = this;
                _this.$request
                    .get("/department/index", {
                        id: 0
                    })
                    .then(res => {
                        if (res.status === 1) {
                            let data = _this.treeDepthInit(res.result.list);
                            data.length === 1 ? (data[0].expand = true) : "";
                            _this.unitsTree = data;
                        } else {
                            _this.$Message.error(res.message);
                        }
                    });
            },
            moveUnitTreeClick(row) {
                if (row.length !== 0) {
                    this.unitsMoveParentId = row[0].id;
                    this.unitsMoveInfo.parent_id = this.unitsMoveParentId;
                } else {
                    this.unitsTree = this.initTreeCheck(
                        this.unitsTree,
                        this.unitsMoveParentId
                    );
                }
            },
            //确认移动部门
            moveUnitOk() {
                let _this = this;
                if (_this.unitsMoveInfo.parent_id === "") {
                    return false;
                }
                _this.$request.post("/department/move", this.unitsMoveInfo).then(res => {
                    if (res.status === 1) {
                        _this.$Message.success("移动成功");
                        _this.initList();
                    } else {
                        _this.$Message.error(res.message);
                    }
                });
            },
            //取消移动部门
            cancelMoveUnit() {
                this.unitsMoveInfo.id = "";
                this.unitsMoveInfo.parent_id = "";
            },
            prevPage() {
            },
            nextPage() {
            },
            goFirstPage() {
            },
            goLastPage() {
            }
        }
    };
</script>
<style>
  .ivu-tree ul li{padding: 0 5px !important;}
</style>
