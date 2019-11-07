<template>
  <div class="flex-content">
    <div class="main-ctc">
      <!-- 顶部操作区   start -->
      <div class="content-header">
        <div class="item title">{{isEdit === 1 ? 'edit user' : 'Add New user'}}</div>
      </div>
      <!-- 顶部操作区   end -->
      <!-- form表单   start -->
      <div class="form-content">
        <Form
          ref="formData"
          :model="formData"
          :rules="formRule"
          label-position="left"
          :label-width="258"
        >
          <FormItem label="Name:" prop="username">
            <Input autofocus v-model.trim="formData.username" autocomplete="new-password" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="Account:" prop="account">
            <Input v-model.trim="formData.account" style="width: 240px"></Input>
            <span class="remark-text">{{mailType}}</span>
          </FormItem>
          <div style="margin-bottom: 26px;display:flex" v-if="pswedit">
            <div style="width:258px;color: #111;font-size: 14px;font-weight: bold;">Password:
            </div>
            <div @click="psweditfun" style="font-size:14px;color:rgba(76,132,255,1);cursor: pointer">Modify password>>
            </div>
          </div>
          <div v-else>
            <FormItem label="Password:" :prop="isEdit === 0 ? 'password' : ''">
              <Input
                v-model.trim="formData.password"
                type="password"
                :maxlength="16"
                style="width: 520px"
              ></Input>
              <button class="primary" @click.prevent="ResetNum">Reset</button>
            </FormItem>
            <FormItem label="Verify Password:" prop="password_verify">
              <Input :maxlength="16" v-model.trim="formData.password_verify" type="password"
                     style="width: 520px"></Input>
            </FormItem>
          </div>

          <FormItem label="gender:" prop="sex">
            <RadioGroup v-model="formData.sex">
              <Radio label="1">Male</Radio>
              <Radio label="2">Female</Radio>
            </RadioGroup>
          </FormItem>
          <Divider/>
          <div>
            <FormItem label="phone number:" prop="mobile">
              <Select v-model="formData.country_code" style="width: 76px">
                <Option v-for="(item,index) in countryList" :key="index" :value="JSON.stringify(item)">+{{item.code}}
                  {{item.text}}
                </Option>
              </Select>
              <Input v-model="formData.mobile" style="width: 200px"></Input>
            </FormItem>
          </div>
          <div>
            <FormItem label="Tel:" prop="tel">
              <Select v-model="formData.tel_code" style="width: 76px">
                <Option v-for="(item,index) in countryList" :key="index" :value="JSON.stringify(item)">+{{item.code}}
                  {{item.text}}
                </Option>
              </Select>
              <Input v-model="formData.tel" style="width: 200px"></Input>
            </FormItem>
          </div>
          <FormItem label="Address:" prop="address">
            <Input v-model.trim="formData.address" style="width: 520px"></Input>
          </FormItem>
          <Divider/>
          <FormItem label="Section:" prop="dept_id">
            <Input
              v-model="formData.dept_id"
              disabled
              style="width: 200px;visibility:hidden;opacity:0"
            ></Input>
            <Input
              class="disabled-value"
              v-model="selectedDepartmentStr"
              disabled
              style="width: 200px"
            ></Input>
            <button @click.prevent="changeSection">Change</button>
          </FormItem>
          <FormItem label="Title:" prop="position">
            <Input v-model="formData.position" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="Identity:" prop="identity">
            <RadioGroup v-model="formData.identity">
              <Radio label="0">普通用户</Radio>
              <Radio label="1">上级</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="Group:" prop="group_id">
            <Input v-model="selectedGroupStr" style="width: 200px" disabled></Input>
            <button @click.prevent="changeGroup">Change</button>
          </FormItem>
          <div>
            <FormItem label="logon rights:" prop="logon_rights">
              <CheckboxGroup v-model="formData.logon_rights">
                <Checkbox label="1">imap/smtp</Checkbox>
                <Checkbox label="2">pop/smtp</Checkbox>
                <Checkbox label="3">secure login</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </div>
          <Divider/>
          <FormItem class="operations">
            <button
              class="primary"
              :disabled="stopclick"
              @click.prevent="handleSubmit('formData')"
            >Save changes
            </button>
            <button
              class="gray"
              @click.prevent="handleReset('formData')"
              style="margin-left: 8px"
            >Cancel
            </button>
          </FormItem>
        </Form>
      </div>
      <!-- form表单   end -->
    </div>
    <!-- 部门穿梭框弹层  start -->
    <Modal
      v-model="ShuttleSectionModal"
      title="Please Select Units"
      class-name="vertical-center-modal"
      @on-cancel="sectionCancle"
      @on-ok="sectionOk"
    >
      <div class="transfer fn-clear">
        <div class="item float-left">
          <div class="item-content">
            <Tree
              :data="departmentData"
              show-checkbox
              @on-check-change="departmentCheckChange"
              check-strictly
              @on-select-change="handleSelect"
            ></Tree>
          </div>
        </div>
        <div class="item float-right">
          <ul class="results-list">
            <li v-for="(item,index) in transferDepartment">
              <span>{{item.title}}</span>
              <i class="iconfont icondel" @click="deleteDepartment(item,index)"></i>
            </li>
          </ul>
        </div>
        <span class="arrow-group">>></span>
      </div>
    </Modal>
    <!-- 部门穿梭框弹层  end -->
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
            <li v-for="(item,index) in transferGroup">
              <span>{{item.group_name}}</span>
              <i class="iconfont icondel" @click="deleteGroup(item,index)"></i>
            </li>
          </ul>
        </div>
        <span class="arrow-group">>></span>
      </div>
    </Modal>
    <!-- 部门穿梭框弹层  end -->
    <!-- 密码弹出 -->
    <Modal v-model="pwsmo" title="您的密码是">
      <p @click.stop="copytext(formData.password)" style="cursor:pointer">{{formData.password}}</p>
    </Modal>
    <!--密码弹出  -->
  </div>
</template>
<script>
    import regex from "@/utils/regex";

    export default {
        props: ["rowData"],
        data() {
            let _this = this;
            //密码长度验证
            const passwordRule = (rule, value, callback) => {
                if (value.length >= 8 && value.length <= 16) {
                    callback();
                } else {
                    callback(new Error("The password contains Numbers and letters, 8-16 bits"));
                }
            };
            //再次确认密码是否一致
            const passwordVerifyRule = (rule, value, callback) => {
                if (value === _this.formData.password) {
                    callback();
                } else {

                    callback(new Error("密码不一致"));
                }
            };
            return {
                pwsmo: false, //密码弹框
                stopclick: false, //防止用户点击多次
                mailType: "", //邮箱后缀
                ShuttleSectionModal: false, //部门穿梭框弹层
                ShuttleGroupModal: false, //群组穿梭框弹层
                departmentData: [], //部门树
                selectedDepartment: [], //选中的部门
                transferDepartment: [], //部门穿梭框右侧数据
                selectedGroup: [], //选中的群组
                transferGroup: [], //群组穿梭框右侧数据
                formData: {
                    username: "", //用户名
                    account: "", //邮箱账号
                    password: "", //邮箱密码
                    password_verify: "", //邮箱确认密码
                    sex: "2", //性别 1:男；2:女
                    country_code: "86", //手机号码国家区号
                    mobile: "", //手机号码
                    tel_code: "86", //座机/手机号码国家区号
                    tel: "", //座机/手机号码
                    address: "", //联系地址
                    dept_id: "", //部门ID
                    position: "", //职务
                    identity: "0", //身份  0:普通用户；1:上级
                    group_id: "", //邮件群组ID
                    logon_rights: ["1"], //登录权限  1: imap/smtp；2: pop/smtp；3:secure login
                    country: "",
                    tel_country: ""
                },
                formRule: {
                    username: [
                        {
                            required: true,
                            message: "The name cannot be empty",
                            trigger: "blur"
                        }
                    ],
                    account: [
                        {
                            required: true,
                            pattern: regex.ennum_,
                            message: "Illegal input",
                            trigger: "blur"
                        }
                    ],
                    password: [
                        {
                            required: true,
                            validator: passwordRule,
                            trigger: "blur"
                        },
                        {
                            pattern: regex.numenpassword,
                            message: "The password contains Numbers and letters, 8-16 bits",
                            trigger: "blur"
                        }
                    ],
                    password_verify: [
                        {
                            required: true,
                            validator: passwordVerifyRule,
                            trigger: "blur"
                        }
                    ],
                    mobile: [
                        {
                            required: true,
                            message: "请输入11手机号码",
                            trigger: "blur"
                        }
                    ],
                    tel: [
                        {
                            pattern: regex.telephone,
                            message: "请输入正确的座机号码",
                            trigger: "blur"
                        }
                    ],
                    dept_id: [
                        {
                            required: true,
                            message: "请选择部门",
                            trigger: "blur"
                        }
                    ]
                },
                isEdit: 0, //编辑或新增
                pswedit: 0,
                groupList: [],
                countryList: []
            };
        },
        computed: {
            //部门值
            selectedDepartmentStr() {
                return this.arrToStr(this.selectedDepartment, "title");
            },
            //群组值
            selectedGroupStr() {
                return this.arrToStr(this.selectedGroup, "group_name");
            }
        },
        created() {
            this.isEdit = this.$route.query.isEdit;
            this.pswedit = this.$route.query.isEdit;
            //初始化邮箱后缀
            this.codeinfo();
            let email = JSON.parse(window.localStorage.userInfo);
            this.mailType = email.domain;
            if (this.isEdit !== "0") {
                this.getDetail();
            } else {
                if (this.rowData.length === 0) {
                    return false;
                } else {
                    this.selectedDepartment = [this.rowData];
                    this.selectedDepartment.forEach(item => {
                        item.title = item.title.replace(/\([0-9]+\)/, "");
                    });
                    this.formData.dept_id = this.arrToStr(this.selectedDepartment, "id");
                }
            }

        },
        methods: {
            handleSelect(selectedList) {
                var ele = selectedList[selectedList.length - 1]; //当前选中的树节点
                ele.expand = true; //设置为展开
            },
            codeinfo() {
                this.$request.post("/site/countryCode").then(res => {
                    this.countryList = res.result.country
                })
            }
            ,
            arrToStr(arr, name) {
                let str = "";
                arr.forEach(item => {
                    str += `${item[name].replace(/\([0-9]+\)/, "")},`;
                });
                return str.slice(0, str.length - 1);
            }
            ,
            //生成随机密码
            ResetNum() {
                let psw =
                    "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
                let str = "";
                for (let index = 0; index < 16; index++) {
                    let num = parseInt(Math.random() * 61);
                    str += psw[num];
                }
                this.formData.password = str;
                this.pwsmo = true;
            }
            ,
            //点击复制密码
            copytext(psw) {
                document.execCommand(psw);
            }
            ,
            //获取详情信息
            getDetail() {
                let _this = this;
                _this.$request
                    .get("/member/detail", {id: _this.$route.query.id})
                    .then(res => {
                        if (res.status === 1) {
                            let obj = res.result;
                            for (const key in obj) {
                                switch (key) {
                                    case "department":
                                        _this.formData.dept_id = _this.arrToStr(obj[key], "id");
                                        _this.selectedDepartment = obj[key];
                                        break;
                                    case "group":
                                        _this.formData.group_id = _this.arrToStr(obj[key], "id");
                                        _this.selectedGroup = obj[key];
                                        break;
                                    case "mail_name":
                                        _this.formData.account = obj[key].split("@")[0];
                                        break;
                                    default:
                                        _this.formData[key] = obj[key];
                                }
                            }
                            let countrycode = this.formData.country_code;
                            let tel_code = this.formData.tel_code;
                            if (countrycode !== '') {
                                this.countryList.forEach((item, index) => {
                                    if (item.code == countrycode) {
                                        this.formData.country_code = JSON.stringify(this.countryList[index])
                                    }
                                })
                            }
                            if (tel_code !== '') {
                                this.countryList.forEach((item, index) => {
                                    if (item.code == tel_code) {
                                        this.formData.tel_code = JSON.stringify(this.countryList[index])
                                    }
                                })
                            }

                        }
                    });
            }
            ,
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
            }
            ,
            //初始化默认选中节点
            initTreeCheck(arr, filterId) {
                if (Array.isArray(arr)) {
                    arr.forEach(item => {
                        if (item.id === filterId) {
                            item.checked = true;
                        } else if (item.children) {
                            this.initTreeCheck(item.children, filterId);
                        }
                    });
                }
                return arr;
            }
            ,
            //取消选中的节点
            cancelTreeCheck(arr, filterId) {
                if (Array.isArray(arr)) {
                    arr.forEach(item => {
                        if (item.id === filterId) {
                            item.checked = false;
                        } else if (item.children) {
                            this.cancelTreeCheck(item.children, filterId);
                        }
                    });
                }
                return arr;
            }
            ,
            //初始化树
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

                            if (_this.isEdit != 0) {
                                let newData = [];
                                _this.selectedDepartment.forEach(item => {
                                    newData = _this.initTreeCheck(data, item.id);
                                });
                                newData.length === 1 ? (newData[0].expand = true) : "";
                                _this.departmentData = newData;
                            } else {
                                data.length === 1 ? (data[0].expand = true) : "";
                                _this.departmentData = data;
                            }
                        } else {
                            _this.$Message.error(res.message);
                        }
                    });
            }
            ,
            //穿梭框部门树点击事件
            departmentCheckChange(row) {
                console.log(row);
                this.transferDepartment = row;
            }
            ,
            //删除选中的部门
            deleteDepartment(item, index) {
                console.log(item);
                this.transferDepartment.splice(index, 1);
                this.departmentData = this.cancelTreeCheck(this.departmentData, item.id);
            }
            ,
            //显示部门弹层
            changeSection() {
                this.ShuttleSectionModal = true;
                this.initTree();
                this.transferDepartment = [...this.selectedDepartment];
            }
            ,
            //部门穿梭框确认
            sectionOk() {
                this.selectedDepartment = [...this.transferDepartment];
                this.formData.dept_id = this.arrToStr(this.selectedDepartment, "id");
            }
            ,
            //部门穿梭框取消
            sectionCancle() {
                this.transferDepartment = [];
            }
            ,
            //显示群组弹层
            changeGroup() {
                this.groupListGet();
                this.ShuttleGroupModal = true;
                this.transferGroup = [...this.selectedGroup];
            }
            ,
            //获取群组信息
            groupListGet() {
                let _this = this;
                _this.$request.get("/group/list").then(res => {
                    if (res.status === 1) {
                        _this.groupList = res.result.list;
                    }
                });
            }
            ,
            //选中群组
            groupItemClick(item) {
                let obj = {
                    id: "",
                    group_name: ""
                };
                obj.id = item.id;
                obj.group_name = item.group_name;
                let flag = this.transferGroup.findIndex(value => {
                    return value.id == obj.id;
                });
                flag === -1 ? this.transferGroup.push(obj) : "";
            }
            ,
            //群组穿梭框确认
            groupOk() {
                this.selectedGroup = [...this.transferGroup];
                this.formData.group_id = this.arrToStr(this.selectedGroup, "id");
            }
            ,
            groupCancle() {
                this.transferGroup = [];
            }
            ,
            //群组穿梭框删除
            deleteGroup(item, index) {
                this.transferGroup.splice(index, 1);
            }
            ,
            //表单保存
            handleSubmit(name) {
                let _this = this;
                _this.stopclick = true;
                _this.$refs[name].validate(valid => {
                    if (valid) {
                        let {...obj} = _this.formData;
                        debugger


                        obj.dept_id = obj.dept_id.split(",");
                        obj.group_id = obj.group_id.length > 0 ? obj.group_id.split(",") : [];

                        if (_this.formData.country_code != '') {
                            let info = JSON.parse(_this.formData.country_code);
                            obj.country_code = info.code;
                            obj.country = info.id;
                        }
                        if (_this.formData.tel_code != '') {
                            let info2 = JSON.parse(_this.formData.tel_code);
                            obj.tel_code = info2.code;
                            obj.tel_country = info2.id;
                        }
                        if (_this.isEdit) {


                        } else {
                            // let info = JSON.parse(_this.formData.country_code);
                            // let info2 = JSON.parse(_this.formData.tel_code);
                            // obj.country_code = info.code;
                            // obj.country = info.id;
                            // obj.tel_code = info2.code;
                            // obj.tel_country = info2.id;
                            if (!obj.country) {
                                _this.$Message.error("fail!");
                                return
                            }
                        }


                        _this.$request
                            .post(_this.isEdit ? "/member/update" : "/member/add", obj)
                            .then(res => {
                                _this.stopclick = false;
                                if (res.status === 1) {
                                    _this.$Message.success(res.message);
                                    _this.$router.push("/users");
                                } else {
                                    _this.$Message.error(res.message);
                                }
                                this.$emit("shuaxin");
                            });
                    } else {
                        _this.stopclick = false;
                        this.$Message.error("Fail!");
                    }
                });
            }
            ,
            //重置
            handleReset(name) {
                this.$refs[name].resetFields();
                this.$router.push("/users");
            },
            //密码切换  编辑和新增
            psweditfun() {
                this.pswedit = !this.pswedit;
            }
        }
    }
    ;
</script>
