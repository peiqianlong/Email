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
      <Panel v-if="Accesslist.company_profile" name="1">
        <div class="toggle-item">
          <div class="item-title">Company profile</div>
          <div
            class="item-desc"
          >Change your company name, language, and time zone,and other Settings that apply to the company.
          </div>
        </div>
        <div slot="content" v-if="Companyprofile !== null" class="toggle-content">
          <div class="profileitemlist">
            <div class="text_left" style=" align-self: end;">LOGO:</div>
            <div class="text_right">
              <div class="upload_logo">
                <Icon class="addicon" type="md-add"/>
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button icon="ios-cloud-upload-outline"></Button>
                </Upload>
              </div>
              <div class="tips_text">The recommended size is 430*70, and the recommended size is no more than 500K.
              </div>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Company name:</div>
            <div class="text_right">
              {{Companyprofile.info.company_name}}
              <span class="openbtn">Administrator password reset>></span>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Phone number:</div>
            <div class="text_right">
              {{Companyprofile.info.mobile}}
              <span class="openbtn">Modify phone number>></span>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">OperationEmail:</div>
            <div class="text_right">
              {{Companyprofile.info.mobile}}
            </div>
          </div>
          <div class="line"></div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Sections:</div>
            <div class="text_right">
              {{Companyprofile.info.section}}
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Number of account used/upper limit:</div>
            <div class="text_right">
              {{Companyprofile.info.account_used}}/{{Companyprofile.info.account_num}}
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Number of groups used/upper limit:</div>
            <div class="text_right">
              {{Companyprofile.info.group_used}}/{{Companyprofile.info.group_num}}
            </div>
          </div>
          <div class="line"></div>
          <div class="profileitemlist ">
            <div class="text_left">industry types:</div>
            <div class="text_right">
              {{Companyprofile.info.industry}}
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Company size:</div>
            <div class="text_right">
              {{Companyprofile.info.employee_num}}
            </div>
          </div>
          <div class="line"></div>
          <div class="profileitemlist ">
            <div class="text_left">CreateDate:</div>
            <div class="text_right">
              {{Companyprofile.info.create_date}}
            </div>
          </div>
          <div class="line"></div>
          <div class="profileitemlist ">
            <div class="text_left">Language:</div>
            <div class="text_right">
              <Select @on-change="updatainfo('language')" v-model="Companyprofile.info.language"
                      style="width:120px;height: 32px">
                <Option v-for="item in Companyprofile.languages" :value="item.key" :key="item.key">{{ item.label }}
                </Option>
              </Select>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Timezon:</div>
            <div class="text_right">
              <Select @on-change="updatainfo('language')" v-model="Companyprofile.info.timezone"
                      style="width:320px;height: 32px">
                <Option v-for="item in Companyprofile.zones" :value="item.key" :key="item.key">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
        </div>
      </Panel>
      <Panel v-if="Accesslist.email_info" name="2">
        <div class="toggle-item">
          <div class="item-title">Email information</div>
          <div class="item-desc">Show the basiv information of the mailbox.</div>
        </div>
        <div slot="content" class="toggle-content">
          <div class="profileitemlist">
            <div class="text_left">Email version:</div>
            <div class="text_right">
              free of charge
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Mailbox capacity:</div>
            <div class="text_right">
              1G
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Enterprise domain:</div>
            <div class="text_right">
              test.com
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">CreateDate:</div>
            <div class="text_right">
              2019.1.17
            </div>
          </div>
        </div>
      </Panel>
      <Panel v-if="Accesslist.domain_anagement" name="3">
        <div class="toggle-item">
          <div class="item-title">Domain management</div>
          <div
            class="item-desc"
          >You can set the domain name LOGO, you can also cancel your domain name.
          </div>
        </div>
        <div slot="content" class="toggle-content">
          <div class="profileitemlist">
            <div class="text_left" style=" align-self: end;">LOGO:</div>
            <div class="text_right">
              <div class="upload_logo" style=" align-self: end;">
                <Icon class="addicon" type="md-add"/>
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button icon="ios-cloud-upload-outline"></Button>
                </Upload>
              </div>
              <div class="tips_text">The recommended size is 430*70, and the recommended size is no more than 500K.
              </div>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Enterprise domain:</div>
            <div class="text_right">
              test.com
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left">Enterprise domain:</div>
            <div class="text_right">
              <div class="tips_text">Please make sure to set the following records at the domain name provider to
                realize the server location and ensure the normal use of the mailbox.
              </div>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left"></div>
            <div class="text_right">
              <div class="table">
                <Table
                  ref="selection"
                  :columns="columns"
                  :data="dataList"
                  :loading="loading"
                >
                </Table>
              </div>
              <div class="Logout">Log out</div>
            </div>
          </div>
        </div>
      </Panel>
      <Panel v-if="Accesslist.address_book" name="4">
        <div class="toggle-item">
          <div class="item-title">Address book management</div>
          <div class="item-desc">Set up some members to view the enterprise address book.</div>
        </div>
        <div slot="content" class="toggle-content">
          <div class="profileitemlist">
            <div class="text_left" style="align-self: end">Contact book sharing:</div>
            <div class="text_right">
              <div>
                <Checkbox v-model="single">Enable</Checkbox>
              </div>
              <div class="tips_text">The recommended size is 430*70, and the recommended size is no more than 500K.
              </div>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left" style="align-self: end">Can view address book members:</div>
            <div class="text_right">
              <div style="margin-left: 0" class="openbtn">Add>></div>
              <div class="tips_text">Added members or departments can view the company address book</div>
            </div>
          </div>
          <div class="profileitemlist marignT12">
            <div class="text_left"></div>
            <div class="text_right">
              <div class="table">
                <Table
                  ref="selection"
                  :columns="columns"
                  :data="dataList"
                  :loading="loading"
                >
                </Table>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                Accesslist: {
                    "company_profile": 0,
                    "email_info": 0,
                    "domain_anagement": 0,
                    "address_book": 0,
                },
                Companyprofile: null,
                single: true,
                loading: false,
                columns: [
                    {
                        title: "qqqq",
                        key: "username",
                        ellipsis: true,
                        tooltip: true

                    },
                    {
                        title: "2222",
                        key: "username1",
                        ellipsis: true,
                        tooltip: true

                    },
                ],
                dataList: [{
                    username: 'John Brown',
                    username1: 18,
                }, {
                    username: 'John Brown',
                    username1: 18,
                }]

            };
        },
        created() {
            this.initList();
        },

        methods: {
            //更新信息
            updatainfo(val) {
                if (val === 'language') {
                    this.$request.post("/company/prefsUpdate", {
                        language: this.Companyprofile.info.language,
                        timezone: this.Companyprofile.info.timezone
                    }).then(res => {
                        this.$Message.success(res.message);
                    })
                }
            },
            //获取用户访问权限
            initList() {
                this.$request.get("/company/index").then(res => {
                    //判断永华访问权限
                    if (Array.isArray(res.result.list)) {
                        res.result.list.forEach(item => {
                            this.Accesslist[item] = 1;
                        })
                    }

                });
                //获取用户信息
                this.$request.get("/company/profile").then(res => {
                    if (res.status === 1) {
                        this.Companyprofile = res.result
                    }
                })
            },


        }
    };
</script>
<style lang="scss">
  .management-tool .management-head .left-icon.profile {
    background: url(../../assets/images/menu-icon2.png) no-repeat;

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
    align-items: center;;

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
      }
    }
  }
</style>
