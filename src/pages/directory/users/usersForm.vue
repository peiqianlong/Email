<template>
  <div class="flex-content">
    <div class="main-ctc">
      <!-- 顶部操作区   start -->
      <div class="content-header">
        <div class="item title">Add New user</div>
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
            <Input v-model.trim="formData.username" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="Account:" prop="account">
            <Input v-model.trim="formData.account" style="width: 240px"></Input>
            <span class="remark-text">{{mailType}}</span>
          </FormItem>
          <FormItem label="Password:" prop="password">
            <Input
              v-model.trim="formData.password"
              type="password"
              :maxlength="16"
              style="width: 520px"
            ></Input>
          </FormItem>
          <FormItem label="Verify Password:" prop="password_verify">
            <Input v-model.trim="formData.password_verify" type="password" style="width: 520px"></Input>
          </FormItem>
          <FormItem label="gender:" prop="sex">
            <RadioGroup v-model="formData.sex">
              <Radio label="1">Male</Radio>
              <Radio label="2">Female</Radio>
            </RadioGroup>
          </FormItem>
          <Divider />
          <div>
            <FormItem label="phone number:" prop="mobile">
              <Select v-model="formData.country_code" style="width: 76px">
                <Option value="86">+86</Option>
                <Option value="86">+86</Option>
                <Option value="86">+86</Option>
              </Select>
              <Input v-model="formData.mobile" style="width: 200px"></Input>
            </FormItem>
          </div>
          <div>
            <FormItem label="Tel:" prop="tel">
              <Select v-model="formData.tel_code" style="width: 76px">
                <Option value="86">+86</Option>
                <Option value="86">+86</Option>
                <Option value="86">+86</Option>
              </Select>
              <Input v-model="formData.tel" style="width: 200px"></Input>
            </FormItem>
          </div>
          <FormItem label="Address:" prop="address">
            <Input v-model.trim="formData.address" style="width: 520px"></Input>
          </FormItem>
          <Divider />
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
          <Divider />
          <FormItem class="operations">
            <button class="primary" @click.prevent="handleSubmit('formData')">Save changes</button>
            <button
              class="gray"
              @click.prevent="handleReset('formData')"
              style="margin-left: 8px"
            >Cancel</button>
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
                >{{item.group_name}}</li>
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
        callback(new Error("The password contains 8-16 bits"));
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
      mailType: "@gia.com", //邮箱后缀
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
        sex: "", //性别 1:男；2:女
        country_code: "86", //手机号码国家区号
        mobile: "", //手机号码
        tel_code: "86", //座机/手机号码国家区号
        tel: "", //座机/手机号码
        address: "", //联系地址
        dept_id: "", //部门ID
        position: "", //职务
        identity: "", //身份  0:普通用户；1:上级
        group_id: "", //邮件群组ID
        logon_rights: [] //登录权限  1: imap/smtp；2: pop/smtp；3:secure login
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
            message: "输入不合法",
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
            message: "The password contains Numbers and letters",
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
            pattern: regex.phone,
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
      groupList: []
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
    if (this.isEdit) {
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
    arrToStr(arr, name) {
      let str = "";
      arr.forEach(item => {
        str += `${item[name].replace(/\([0-9]+\)/, "")},`;
      });
      return str.slice(0, str.length - 1);
    },
    //获取详情信息
    getDetail() {
      let _this = this;
      _this.$request
        .get("/member/detail", { id: _this.$route.query.id })
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
                  _this.formData.account = obj[key].replace(/@gia.com/, "");
                  break;
                default:
                  _this.formData[key] = obj[key];
              }
            }
          }
        });
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
    },
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
    },
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
            let newData = [];
            _this.selectedDepartment.forEach(item => {
              newData = _this.initTreeCheck(data, item.id);
            });
            newData.length === 1 ? (newData[0].expand = true) : "";
            _this.departmentData = newData;
          } else {
            _this.$Message.error(res.message);
          }
        });
    },
    //穿梭框部门树点击事件
    departmentCheckChange(row) {
      console.log(row);
      this.transferDepartment = row;
    },
    //删除选中的部门
    deleteDepartment(item, index) {
      console.log(item);
      this.transferDepartment.splice(index, 1);
      this.departmentData = this.cancelTreeCheck(this.departmentData, item.id);
    },
    //显示部门弹层
    changeSection() {
      this.ShuttleSectionModal = true;
      this.initTree();
      this.transferDepartment = [...this.selectedDepartment];
    },
    //部门穿梭框确认
    sectionOk() {
      this.selectedDepartment = [...this.transferDepartment];
      this.formData.dept_id = this.arrToStr(this.selectedDepartment, "id");
    },
    //部门穿梭框取消
    sectionCancle() {
      this.transferDepartment = [];
    },
    //显示群组弹层
    changeGroup() {
      this.groupListGet();
      this.ShuttleGroupModal = true;
      this.transferGroup = [...this.selectedGroup];
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
    },
    //群组穿梭框确认
    groupOk() {
      this.selectedGroup = [...this.transferGroup];
      this.formData.group_id = this.arrToStr(this.selectedGroup, "id");
    },
    groupCancle() {
      this.transferGroup = [];
    },
    //群组穿梭框删除
    deleteGroup(item, index) {
      this.transferGroup.splice(index, 1);
    },
    //表单保存
    handleSubmit(name) {
      let _this = this;
      _this.$refs[name].validate(valid => {
        if (valid) {
          let { ...obj } = _this.formData;
          obj.dept_id = obj.dept_id.split(",");
          obj.group_id = obj.group_id.length > 0 ? obj.group_id.split(",") : [];
          _this.$request
            .post(_this.isEdit ? "/member/update" : "/member/add", obj)
            .then(res => {
              res.status === 1
                ? _this.$Message.success(res.message)
                : _this.$Message.error(res.message);
              _this.$router.push("/users");
            });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    //重置
    handleReset(name) {
      this.$refs[name].resetFields();
      this.$router.push("/users");
    }
  }
};
</script>