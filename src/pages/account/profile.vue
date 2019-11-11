<template>
  <div class="management-tool">
    <div class="management-head">
      <i class="left-icon profile"></i>
      <div class="text">
        <div class="tool-title">Profile</div>
        <div class="tool-desc">nancy</div>
      </div>
    </div>
    <Collapse simple>
      <Panel v-if="Accesslist.company_profile && Companyprofile!== null" name="1">
        <div class="toggle-item">
          <div class="item-title">Company profile</div>
          <div
            class="item-desc"
          >Change your company name, language, and time zone,and other Settings that apply to the company.
          </div>
        </div>
        <div slot="content" v-if="Companyprofile !== null" class="toggle-content">
          <!--          上传图片-->
          <!--<div class="profileitemlist">
            <div class="text_left" style=" align-self: end;">LOGO:</div>
            <div class="text_right">
              <div class="upload_logo">
                <Icon class="addicon" type="md-add" />
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button icon="ios-cloud-upload-outline"></Button>
                </Upload>
              </div>
              <div
                class="tips_text"
              >The recommended size is 430*70, and the recommended size is no more than 500K.</div>
            </div>
          </div>-->
          <div class="profileitemlist marignT12">
            <div class="text_left">Company name:</div>
            <div class="text_right">
              {{Companyprofile.info.company_name}}
              <span
                @click="pswModel = true"
                class="openbtn"
              >Administrator password reset>></span>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Phone number:</div>
            <div class="text_right">
              {{Companyprofile.info.mobile}}
              <span
                class="openbtn"
                @click="ModilPhone = true"
              >Modify phone number>></span>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">OperationEmail:</div>
            <div class="text_right">
              {{Companyprofile.info.spare_email}}
              <span
                class="openbtn"
                @click="ModifyEmailDlo = true"
              >Modify Email>></span>
            </div>
          </div>
          <div class="line"></div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Sections:</div>
            <div class="text_right">{{Companyprofile.info.section}}</div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Number of account used/upper limit:</div>
            <div
              class="text_right"
            >{{Companyprofile.info.account_used}}/{{Companyprofile.info.account_num}}
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Number of groups used/upper limit:</div>
            <div
              class="text_right"
            >{{Companyprofile.info.group_used}}/{{Companyprofile.info.group_num}}
            </div>
          </div>
          <div class="line"></div>
          <div class="profileitemlist">
            <div class="text_left">industry types:</div>
            <div class="text_right">{{Companyprofile.info.industry}}</div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Company size:</div>
            <div class="text_right">{{Companyprofile.info.employee_num}}</div>
          </div>
          <div class="line"></div>
          <div class="profileitemlist">
            <div class="text_left">CreateDate:</div>
            <div class="text_right">{{Companyprofile.info.create_date}}</div>
          </div>
          <div class="line"></div>
          <div class="profileitemlist">
            <div class="text_left">Language:</div>
            <div class="text_right">
              <Select
                @on-change="updatainfo('language')"
                v-model="Companyprofile.info.language"
                style="width:120px;height: 32px"
              >
                <Option
                  v-for="item in Companyprofile.languages"
                  :value="item.key"
                  :key="item.key"
                >{{ item.label }}
                </Option>
              </Select>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Timezon:</div>
            <div class="text_right">
              <Select
                @on-change="updatainfo('language')"
                v-model="Companyprofile.info.timezone"
                style="width:320px;height: 32px"
              >
                <Option
                  v-for="item in Companyprofile.zones"
                  :value="item.key"
                  :key="item.key"
                >{{ item.label }}
                </Option>
              </Select>
            </div>
          </div>
        </div>
      </Panel>
      <Panel v-if="Accesslist.email_info && CompanyEmail!== null" name="2">
        <div class="toggle-item">
          <div class="item-title">Email information</div>
          <div class="item-desc">Show the basiv information of the mailbox.</div>
        </div>
        <div slot="content" class="toggle-content">
          <div class="profileitemlist">
            <div class="text_left">Email version:</div>
            <div class="text_right">{{CompanyEmail.version}}</div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Mailbox capacity:</div>
            <div class="text_right">{{CompanyEmail.capacity}}</div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Enterprise domain:</div>
            <div class="text_right">{{CompanyEmail.domain}}</div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">CreateDate:</div>
            <div class="text_right">{{CompanyEmail.create_date}}</div>
          </div>
        </div>
      </Panel>
      <Panel v-if="Accesslist.domain_anagement && CompanyDomain!== null" name="3">
        <div class="toggle-item">
          <div class="item-title">Domain management</div>
          <div
            class="item-desc"
          >You can set the domain name LOGO, you can also cancel your domain name.
          </div>
        </div>
        <div slot="content" class="toggle-content">
          <!--          上传图片-->
          <!--<div class="profileitemlist">
            <div class="text_left" style=" align-self: end;">LOGO:</div>
            <div class="text_right">
              <div class="upload_logo" style=" align-self: end;">
                <Icon class="addicon" type="md-add" />
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button icon="ios-cloud-upload-outline"></Button>
                </Upload>
              </div>
              <div
                class="tips_text"
              >The recommended size is 430*70, and the recommended size is no more than 500K.</div>
            </div>
          </div>-->
          <div class="profileitemlist marignT12">
            <div class="text_left">Enterprise domain:</div>
            <div class="text_right">{{CompanyDomain.domain}}</div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Total DNS:</div>
            <div class="text_right"></div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_right">
              <div class="tips_text">
                Please make sure to set the following records at the domain name provider to
                realize the server location and ensure the normal use of the mailbox.
              </div>
              <div class="table marignT12">
                <Table
                  ref="selection"
                  :columns="columns"
                  :data="CompanyDomain.dns_item"
                  :loading="loading"
                ></Table>
              </div>
              <div class="Logout" @click="LogOut">Log out</div>
            </div>
          </div>
        </div>
      </Panel>
      <Panel v-if="Accesslist.address_book && CompanyAdd!== null" name="4">
        <div class="toggle-item">
          <div class="item-title">Address book management</div>
          <div class="item-desc">Set up some members to view the enterprise address book.</div>
        </div>
        <div slot="content" class="toggle-content">
          <div class="profileitemlist">
            <div class="text_left" style="align-self: end">Contact book sharing:</div>
            <div class="text_right">
              <div>
                <Checkbox @on-change="change" v-model="CompanyAdd.enable_share">Enable</Checkbox>
              </div>
              <div
                class="tips_text"
              >The recommended size is 430*70, and the recommended size is no more than 500K.
              </div>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left" style="align-self: end">Can view address book members:</div>
            <div class="text_right">
              <div style="margin-left: 0" @click="openadd" class="openbtn">Add>></div>
              <div class="tips_text">Added members or departments can view the company address book</div>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_right">
              <div class="table">
                <Table
                  ref="selection"
                  :columns="columnAasssress"
                  :data="CompanyAdd.list"
                  :loading="loading"
                >
                  <template slot-scope="{ row, index }" slot="action">
                    <IconPoptip
                      :disabled="row.status"
                      iconName="icondel"
                      title="Del"
                      @popClick="Del(row)"
                    ></IconPoptip>
                  </template>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </Collapse>
    <Modal
      v-model="pswModel"
      title="Change Password"
      :ok-text="$t('operation.yes')"
      :cancel-text="$t('operation.cancle')"
      @on-ok="handleSubmit('formInline')"
    >
      <div class="form-content">
        <Form ref="formInline" :model="formItem" :rules="ruleInline">
          <FormItem label="Password:" prop="password">
            <Input
              v-model.trim="formItem.password"
              type="password"
              :maxlength="16"
              placeholder="Enter Password"
            ></Input>
          </FormItem>
          <FormItem label="Verify Password" prop="password_verify">
            <Input
              v-model.trim="formItem.password_verify"
              type="password"
              placeholder="Enter Verify Password"
            ></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
    <!-- 手机号码修改 -->
    <Modal
      v-model="ModilPhone"
      title="Change Phone"
      :ok-text="$t('operation.yes')"
      :cancel-text="$t('operation.cancle')"
      @on-ok="okModily('phone')"
    >
      <div class="form-content">
        <Form ref="phone" :model="formItem" :rules="ruleInline" inline label-position="top">
          <div>
            <FormItem label="Phone Number:" prop="phone" style="width:100%">
              <Select v-model="formItem.country_code" style="width:76px">
                <Option v-for="(item,index) in countryList" :key="index" :value="JSON.stringify(item)">+{{item.code}}
                  {{item.text}}
                </Option>
              </Select>
              <Input
                style="width: 300px"
                v-model.trim="formItem.phone"
                placeholder="Enter New Phone Number"
              ></Input>
            </FormItem>
          </div>
          <FormItem label="Verification Code:" style="width:50%">
            <Input v-model.trim="formItem.phoneyzm" placeholder="Enter code"/>
          </FormItem>
          <FormItem style="margin-top:40px">
            <Button
              style="width:170px"
              size="large"
              type="primary"
              @click.stop.prevent="handleSubmitPhoneCode"
              :disabled="sendDisable"
            >{{sendDisable ? 'place wite '+ daojishi+'s' : 'Send Verification Code'}}
            </Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
    <!-- 邮箱修改 -->
    <Modal
      v-model="ModifyEmailDlo"
      title="Change Email"
      :ok-text="$t('operation.yes')"
      @on-ok="okModily('email')"
      :cancel-text="$t('operation.cancle')"
    >
      <div class="form-content">
        <Form ref="email" :model="formItem" :rules="ruleInline" inline label-position="top">
          <div>
            <FormItem label="Email:" prop="email" style="width:100%">
              <Input
                style="width: 300px"
                v-model.trim="formItem.email"
                placeholder="Enter New Email"
              />
            </FormItem>
          </div>
          <FormItem label="verify_code:" style="width:50%">
            <Input v-model.trim="formItem.emailyzm" placeholder="Enter code"/>
          </FormItem>
          <FormItem style="margin-top:40px">
            <Button
              :disabled="sendDisable"
              style="width:170px"
              size="large"
              type="primary"
              @click.stop.prevent="handleSubmitEmailCode"
            >{{sendDisable ?'place wite '+ daojishi+'s' : 'Send Verification Code'}}
            </Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
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
  </div>
</template>
<script>
    import regex from "@/utils/regex";

    export default {
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
                if (value === _this.formItem.password) {
                    callback();
                } else {
                    callback(new Error("密码不一致"));
                }
            };
            return {
                sendDisable: false,
                timer: null,
                daojishi: 60,
                ModifyEmailDlo: false, //邮箱修改
                ModilPhone: false, //手机修改
                pswModel: false, //密码弹框
                Accesslist: {
                    company_profile: 0,
                    email_info: 0,
                    domain_anagement: 0,
                    address_book: 0
                },
                Companyprofile: null,
                CompanyEmail: null,
                CompanyDomain: null,
                CompanyAdd: null,
                loading: false,
                columns: [
                    {
                        title: "Record Type",
                        key: "record_type",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "A Record",
                        key: "record",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Analytical Lines",
                        key: "Analytical",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Recorded Value",
                        key: "record_value",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "MX Priority",
                        key: "mx_priority",
                        ellipsis: true,
                        tooltip: true
                    }
                ],
                formItem: {
                    password: "",
                    password_verify: "",
                    phone: "",
                    phoneyzm: "",
                    country_code: "",
                    email: "",
                    emailyzm: ""
                },
                ruleInline: {
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
                    phone: [
                        {
                            required: true,
                            pattern: regex.phone,
                            message: "请输入11手机号码",
                            trigger: "blur"
                        }
                    ],
                    email: [
                        {
                            required: true,
                            pattern: regex.email,
                            message: "请输入正确邮箱",
                            trigger: "blur"
                        }
                    ]
                },
                columnAasssress: [
                    {
                        title: "Name",
                        key: "username",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Title",
                        key: "country_code",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Section",
                        key: "section",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Phone Number",
                        key: "mobile",
                        ellipsis: true,
                        tooltip: true
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
                        ellipsis: true,
                        tooltip: true,
                        render: (h, params) => {
                            let text = params.row.active === "0"
                                ? "Disabled"
                                : "Enabled";
                            return h("span", text);
                        }
                    },
                    {
                        width: 80,
                        title: " ",
                        align: "center",
                        slot: "action"
                    }
                ],
                addMemberModal: false, //添加成员弹层
                selectedMember: [], //穿梭框被选中的成员
                selectedMemberType: 0, //是否只查看enabled用户
                memberTreeData: [],
                removeMember: [],//移除成员
                countryList: []

            };
        },
        created() {
            this.initList();
            this.codeinfo();
        },

        methods: {
            codeinfo() {
                this.$request.post("/site/countryCode").then(res => {
                    this.countryList = res.result.country
                })
            },
            //修改手机号
            handleSubmitPhoneCode() {
                let phone = this.formItem.phone;
                let country_code = JSON.parse(this.formItem.country_code).code;
                console.log(country_code, phone)
                if (phone === "") {
                    this.$Message.info("请输入正确手机号");
                } else if (country_code === "") {
                    this.$Message.info("请选择正确区号");
                } else {
                    this.$request
                        .post("/company/phoneCode", {country_code, phone})
                        .then(res => {
                            if (res.status) {
                                this.$Message.success("success");
                                this.sendDisable = true;
                                this.timer = setInterval(() => {
                                    if (this.daojishi == 0) {
                                        clearInterval(this.timer);
                                        this.timer = null;
                                        this.sendDisable = false;
                                        this.daojishi = 60;
                                    } else {
                                        --this.daojishi;
                                    }
                                }, 1000);
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                }
            },
            //修改邮箱
            handleSubmitEmailCode() {
                let email = this.formItem.email;
                if (email === "") {
                    this.$Message.info("请输入正确Email");
                } else {
                    this.$request.post("/company/emailCode", {email}).then(res => {
                        if (res.status === 1) {
                            this.$Message.success(res.message);
                            this.sendDisable = true;
                            this.timer = setInterval(() => {
                                if (this.daojishi == 0) {
                                    clearInterval(this.timer);
                                    this.timer = null;
                                    this.sendDisable = false;
                                    this.daojishi = 60;
                                } else {
                                    --this.daojishi;
                                }
                            }, 1000);
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            //修改邮箱和手机号
            okModily(val) {
                if (val === "phone") {
                    this.$refs[val].validate(valid => {
                        if (valid) {
                            let phone = this.formItem.phone;
                            let m = JSON.parse(this.formItem.country_code);
                            let country_code = m.code;
                            let country = m.id;
                            let code = this.formItem.phoneyzm;
                            this.$request
                                .post("/company/phoneChange", {phone, country_code, code, country})
                                .then(res => {
                                    if (res.status === 1) {
                                        this.$Message.info(res.message);
                                        this.initList();
                                    } else {
                                        this.$Message.error(res.message);
                                    }
                                });
                        } else {
                            this.$Message.info("Information error");
                        }
                    });
                } else {
                    this.$refs[val].validate(valid => {
                        if (valid) {
                            let email = this.formItem.email;
                            let code = this.formItem.emailyzm;
                            this.$request
                                .post("/company/emailChange", {email, code})
                                .then(res => {
                                    if (res.status) {
                                        this.$Message.success("success");
                                        this.initList();
                                    } else {
                                        if (res.status) {
                                            this.$Message.error("error");
                                        }
                                    }
                                });
                        } else {
                            this.$Message.info("Information error");
                        }
                    });
                }
            },
            //提交修改密码
            handleSubmit(name) {
                let _this = this;
                this.$refs[name].validate(valid => {
                    if (valid) {
                        let prams = {
                            pass: _this.formItem.password,
                            pass_confirm: _this.formItem.password_verify
                        };
                        _this.$request.post("/company/passChange", prams).then(res => {
                            this.$Message.success(res.message);
                        });
                    } else {
                        this.$Message.error("Fail!");
                    }
                });
            },
            //更新信息
            updatainfo(val) {
                if (val === "language") {
                    this.$request
                        .post("/company/prefsUpdate", {
                            language: this.Companyprofile.info.language,
                            timezone: this.Companyprofile.info.timezone
                        })
                        .then(res => {
                            this.$Message.success(res.message);
                        });
                }
            },
            //获取用户访问权限
            initList() {
                this.$request.get("/company/index").then(res => {
                    //判断永华访问权限
                    if (Array.isArray(res.result.list)) {
                        res.result.list.forEach(item => {
                            this.Accesslist[item] = 1;
                        });
                        this.getinfo();
                    }
                });
            },
            //获取信息
            getinfo() {
                //获取用户信息
                if (this.Accesslist.company_profile) {
                    this.$request.get("/company/profile").then(res => {
                        if (res.status === 1) {
                            this.Companyprofile = res.result;
                        }
                    });
                }
                //获取邮箱信息
                if (this.Accesslist.email_info) {
                    this.$request.get("/company/email").then(res => {
                        if (res.status === 1) {
                            this.CompanyEmail = res.result;
                        }
                    });
                }
                //获取域名信息
                if (this.Accesslist.domain_anagement) {
                    this.$request.get("/company/domain").then(res => {
                        if (res.status === 1) {
                            res.result.dns_item.forEach(item => {
                                item.Analytical = "default";
                            });
                            this.CompanyDomain = res.result;
                        }
                    });
                }
                if (this.Accesslist.address_book) {
                    this.$request.get("company/bookView").then(res => {
                        if (res.status === 1) {
                            this.CompanyAdd = res.result;
                            this.CompanyAdd.enable_share =
                                res.result.enable_share == 1 ? true : false;
                        }
                    });
                }
            },
            //注销
            LogOut() {
                this.$Modal.confirm({
                    title: "confirm deletion",
                    content:
                        "<p>Click yes to cancel the account</p><p>Click Cancel to Return</p>",
                    okText: "yes",
                    cancelText: "cancel",
                    onOk: () => {
                        this.$request.get("/company/logout").then(res => {
                            if (res.status) {
                                this.$Message.info("success");
                                this.$router.push("/nologin");
                            }
                        });
                    },
                    onCancel: () => {
                        this.$Message.info("cancel");
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
            //初始化树
            initMemberTree() {
                this.$request
                    .get("/group/memberList", {
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
                this.addMemberModal = true;
                this.initMemberTree();
            },
            // 取消添加成员
            addMemberCancle() {
                this.selectedMember = [];
                this.selectedMemberType = 0;
            },
            memberCheckChange(data) {
                console.log(data);
                this.selectedMember = data.filter(item => {
                    return item.id === -1;
                });
            },
            //却认添加成员
            addMemberOk() {
                let arr = [];
                this.selectedMember.forEach(item => {
                    arr.push(item.member_id);
                });
                this.$request.post("/company/bookAdd", {member_id: arr}).then(res => {
                    if (res.status) {
                        this.$Message.success(res.message);
                        this.initList();
                    }
                });
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
                            });
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
                    item.parent_id
                );
                this.memberTreeData = arr;
            },
            //选择切换
            selectedMemberTypeChange(val) {
                this.selectedMemberType = val;
                this.initMemberTree();
            },
            //change配置更新
            change() {
                this.$request
                    .post("/company/bookShare", {
                        share_address_book: this.CompanyAdd.enable_share ? 1 : 0
                    })
                    .then(res => {
                        if (res.status) {
                            this.$Message.success(res.message);
                        }
                    });
            },
            //删除
            Del(val) {
                this.$request
                    .post("/company/bookDelete", {member_id: [val.member_id]})
                    .then(res => {
                        if (res.status) {
                            this.$Message.success(res.message);
                            this.initList();
                        }
                    });
            }
        }
    };
</script>
<style lang="scss">
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
    color: #111
  }

  .management-tool .management-head .left-icon.profile {
    background: url(../../assets/images/menu-icon2.png) no-repeat;
  }

  .management-tool
  .ivu-collapse
  > .ivu-collapse-item.ivu-collapse-item-active
  > .ivu-collapse-header
  > i {
    transform: rotate(90deg);
    top: 58px;
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: $background-color;
    margin-top: 17px;
    margin-bottom: 16px;
  }

  .marignT12 {
    margin-top: 12px;
  }

  .profileitemlist {
    @include flex();
    align-items: center;

    .text_left {
      font-weight: bold;
      color: $font-color1;
      width: 270px;
      margin-right: 20px;
      display: inline-block;
      line-height: 17px;
      vertical-align: top;
      flex-shrink: 0;
    }

    .text_right {
      display: inline-block;
      font-weight: bold;
      color: $font-color1;
      flex: 1;

      .upload_logo {
        width: 100px;
        height: 80px;
        border-radius: 4px;
        overflow: hidden;
        background: $background-color;
        border: $border-style2;
        cursor: pointer;
        position: relative;

        .addicon {
          @include center();
          font-size: 20px;
        }
      }

      .tips_text {
        color: $font-color1;
        line-height: 17px;
        margin-top: 8px;
        font-weight: 400;
      }

      .openbtn {
        margin-left: 40px;
        cursor: pointer;
        color: $font-color5;
        font-weight: 400;
        line-height: 17px;
      }

      .ivu-select-single .ivu-select-selection {
        height: 100%;

        .ivu-select-selected-value {
          height: 100%;
          line-height: 32px;
        }
      }

      .Logout {
        color: $font-color5;
        margin-top: 29px;
        cursor: pointer;
        text-align: center;
      }
    }
  }
</style>
