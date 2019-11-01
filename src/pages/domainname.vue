<template>
  <div class="domainname" v-if="userInfoData!==null">
    <header>
      <div class="logo"></div>
      <span class="text">https://www.ecer.com</span>
    </header>
    <div class="article">
      <div class="boxItem">
        <div class="titItem"> Company Profile</div>
      </div>
      <div class="content">
        <div class="item">
          <div class="item_l">Company name:</div>
          <div class="item_r">{{userInfoData.company_name}}</div>
        </div>
        <div class="item">
          <div class="item_l">Number of employees:</div>
          <div class="item_r">{{userInfoData.employee_num}}</div>
        </div>
        <div class="item">
          <div class="item_l">phone number:</div>
          <div class="item_r">+{{userInfoData.country_code}} {{userInfoData.mobile}}</div>
        </div>
        <div class="item">
          <div class="item_l">Industry types:</div>
          <div class="item_r">{{userInfoData.industry}}</div>
        </div>
        <div class="item">
          <div class="item_l">OperationEmail:</div>
          <div class="item_r">{{userInfoData.spare_email}}</div>
        </div>
        <div class="item">
          <div class="item_l">Company Address:</div>
          <div class="item_r"></div>
        </div>
      </div>
    </div>

    <div class="article">
      <div class="boxItem">
        <div class="titItem">Domain Management</div>
      </div>
      <div class="content bottom_line">
        <div class="tips">Please complete the following steps in sequence.</div>
        <div class="item">
          <div class="item_l">
            <Icon v-if="domainflag" class="okimg" type="ios-checkmark"/>
            <Icon v-else class="okimg" style="color: #E92114" type="ios-close"/>
            Step 1 Domain name binding:
          </div>
          <div class="item_r tips" style="margin-top: 0">Please go to the domain name provider to purchase the domain
            name.
          </div>
        </div>
        <div class="item">
          <div class="item_l"></div>
          <div class="item_r">
            <div class="item" style="margin: 0;">
              <div class="item_l" style="width: 174px;line-height: 32px;">Domain name binding:</div>
              <div class="item_r">
                <Input :disabled="inputFlag" v-model="bangding"/>
                <span v-if="!inputFlag" class="span" @click="modify(0)">Binding>></span>
                <span v-else class="span" @click="modify(1)">Modify>></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content bottom_line">
        <div class="item">
          <div class="item_l">
            <Icon v-if="domainflag" class="okimg" type="ios-checkmark"/>
            <Icon v-else class="okimg" style="color: #E92114" type="ios-close"/>
            Step 2 Domain name ownership test:
          </div>
          <div class="item_r tips" style="margin-top: 0">Please go to your domain name provider, login domain name
            management page, add a name alias.
          </div>
        </div>
        <div class="item">
          <div class="item_l"></div>
          <div class="item_r">
            <div class="table ">
              <Table
                ref="selection"
                :columns="columnName"
                :data="columnNamedata"
                :loading="loading"
              ></Table>
            </div>
          </div>
        </div>
      </div>

      <div class="content bottom_line">
        <div class="item">
          <div class="item_l">
            <Icon v-if="mxflag" class="okimg" type="ios-checkmark"/>
            <Icon v-else class="okimg" style="color: #E92114" type="ios-close"/>
            Step 3 MX record text:
          </div>
          <div class="item_r tips" style="margin-top: 0">Please go to your domain name provider, set MX record.
          </div>
        </div>
        <div class="item">
          <div class="item_l"></div>
          <div class="item_r" style="padding-bottom: 10px">
            <div class="table ">
              <Table
                ref="selection"
                :columns="columnMx"
                :data="columnMxdata"
                :loading="loading"
              ></Table>
            </div>
          </div>
        </div>
      </div>
      <div class="content bottom_line">
        <div class="item">
          <div class="item_l">
            <Icon v-if="spfflag" class="okimg" type="ios-checkmark"/>
            <Icon v-else class="okimg" style="color: #E92114" type="ios-close"/>
            Step 4 SPF record test:
          </div>
          <div class="item_r tips" style="margin-top: 0">Please go to your domain name provider, set SPF record.
          </div>
        </div>
        <div class="item">
          <div class="item_l"></div>
          <div class="item_r" style="padding-bottom: 10px">
            <div class="table ">
              <Table
                ref="selection"
                :columns="columnMx"
                :data="columnSPFdata"
                :loading="loading"
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button article">
      <Button @click="modal1 = true" v-if="spfflag">Confirm</Button>
      <Button class="clean" v-else>Confirm</Button>
    </div>

    <Modal
      v-model="modal1"
      :title="'Domain Name : '+bangding"
      @on-ok="ok">
      <p>
        After confirmation, the system will bind the domain name for your enterprise mailbox</p>
    </Modal>
  </div>
</template>

<script>
    export default {
        name: "domainname",
        created() {
            this.getInfo()
        },
        data() {
            return {
                bangding: "",
                loading: false,
                columnName: [
                    {
                        title: "Record Type",
                        key: "1",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "A Record",
                        key: "2",
                        ellipsis: true,
                        tooltip: true
                    }
                    ,
                    {
                        title: "Analytical Lines",
                        key: "3",
                        ellipsis: true,
                        tooltip: true
                    }
                    ,
                    {
                        title: "Recorded Value",
                        key: "4",
                        ellipsis: true,
                        tooltip: true
                    }
                ],
                columnNamedata: [
                    {
                        1: "CNAME",
                        2: "",
                        3: "Default",
                        4: "email.dowindns.com",
                    }
                ],
                inputFlag: false,
                userInfoData: null,
                columnMx: [
                    {
                        title: "Record Type",
                        key: "1",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "A Record",
                        key: "2",
                        ellipsis: true,
                        tooltip: true
                    }
                    ,
                    {
                        title: "Analytical Lines",
                        key: "3",
                        ellipsis: true,
                        tooltip: true
                    }
                    ,
                    {
                        title: "Recorded Value",
                        key: "4",
                        ellipsis: true,
                        tooltip: true
                    }
                    ,
                    {
                        title: "MX Priority",
                        key: "5",
                        ellipsis: true,
                        tooltip: true
                    }
                ],
                columnMxdata: [
                    {
                        1: "Mx",
                        2: "@",
                        3: "Default",
                        4: "mx01.dowindns.com",
                        5: "10"
                    },
                    {
                        1: "Mx",
                        2: "@",
                        3: "Default",
                        4: "mx02.dowindns.com",
                        5: "20"
                    }
                ],
                columnSPFdata: [
                    {
                        1: "TXT",
                        2: "@",
                        3: "Default",
                        4: "v=spf1 include:spf.dowindns.com-all",
                        5: "--"
                    }
                ],
                domainflag: false,
                cnameflag: false,
                mxflag: false,
                spfflag: false,
                modal1: false
            }
        },

        methods: {
            getInfo() {
                this.$request.get("/site/index").then(res => {
                    if (res.status) {
                        this.userInfoData = res.result;
                        if (res.result.domain != "") {
                            this.bangding = res.result.domain;
                            this.inputFlag = true;
                            this.columnNamedata[0][2] = res.result.cname_record;
                            this.domainflag = true;
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            modify(val) {
                if (!val) {
                    this.inputFlag = true;
                    this.$request.post("/site/domainModify", {domain: this.bangding}).then(res => {
                        if (res.status == 1) {
                            this.columnNamedata[0][2] = res.result.cname_record;
                            this.domainflag = true;
                            this.Domain();
                        } else {
                            this.$Message.error(res.message);
                            this.domainflag = false;
                        }
                    });
                } else {
                    this.inputFlag = false;
                }

            },
            Domain() {
                this.$request.post("/site/dnsCheck", {step: 1}).then(res => {
                    // console.log(res)
                    if (res.status === 1) {
                        this.cnameflag = true;
                        this.$request.post("/site/dnsCheck", {step: 2}).then(res => {
                            if (res.status === 1) {
                                this.mxflag = true;
                                this.$request.post("/site/dnsCheck", {step: 3}).then(res => {
                                    if (res.status === 1) {
                                        this.spfflag = true;
                                    } else {
                                        this.spfflag = false;
                                        this.$Message.error(res.message);
                                    }
                                })
                            } else {
                                this.mxflag = false;
                                this.$Message.error(res.message);
                            }
                        })
                    } else {
                        this.cnameflag = false;
                        this.$Message.error(res.message);
                    }

                })
            },
            ok() {
                this.$request.setLocal("dns_status", 1);
                this.$router.push("/")
            }
        },
        watch: {
            domainflag(newData) {
                if (newData) {
                    this.Domain()
                }
            }
        }

    }
</script>

<style lang="scss">
  .domainname {
    header {
      height: 64px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 0px rgba(221, 221, 221, 1);
      width: 100%;
      display: flex;
      align-items: center;

      .logo {
        width: 96px;
        height: 28px;
        background: url(../assets/images/ecer_logo.png) no-repeat;
        margin-left: 28px;
      }

      .text {
        height: 16px;
        font-size: 14px;
        font-weight: 400;
        line-height: 30px;
        color: rgba(119, 119, 119, 1);
        opacity: 1;
        margin-left: 16px;
      }

    }

    .article {
      width: 1000px;
      margin: 1px auto 24px;

      .boxItem {
        margin-bottom: 6px;

        .titItem {
          width: 100%;
          height: 48px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 1px 0px rgba(242, 242, 242, 1);
          font-size: 24px;
          font-weight: 400;
          line-height: 48px;
          color: rgba(17, 17, 17, 1);
          opacity: 1;
          text-indent: 16px;
        }

      }

      .bottom_line {
        border-bottom: 1px solid rgba(242, 242, 242, 1);
        padding-bottom: 16px;
      }

      .content {
        padding-left: 16px;

        .tips {
          height: 16px;
          font-size: 14px;
          font-weight: 400;
          line-height: 16px;
          color: rgba(17, 17, 17, 1);
          opacity: 1;
          margin-top: 16px;
        }

        .item {
          display: flex;
          margin-top: 16px;
          font-size: 14px;
          font-weight: bold;
          line-height: 16px;
          color: rgba(17, 17, 17, 1);
          opacity: 1;
          height: 100%;

          .item_l {
            width: 270px;
            height: 100%;
            position: relative;

            .okimg {
              position: absolute;
              left: -26px;
              top: -6px;
              font-size: 30px;
              color: #4C84FF;
            }
          }

          .item_r {
            height: 100%;
            flex: 1;
            overflow: hidden;

            .ivu-input-wrapper {
              width: 400px;
            }

            .ivu-input {
              height: 32px;
              width: 400px;
              margin-right: 12px;
            }

            .span {
              height: 16px;
              font-size: 14px;
              font-weight: 400;
              line-height: 32px;
              color: rgba(76, 132, 255, 1);
              opacity: 1;
              cursor: pointer;
            }

            .table {
              border: 1px solid #ddd;
              -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              -ms-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              -o-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

              .ivu-table-wrapper {
                border: none;

              }

              .ivu-table-tbody .ivu-table-row:hover {
                -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.32);
                -ms-box-shadow: 0 0 4px rgba(0, 0, 0, 0.32);
                -o-box-shadow: 0 0 4px rgba(0, 0, 0, 0.32);
                box-shadow: 0 0 4px rgba(0, 0, 0, 0.32);
                position: relative;
                z-index: 1;
                font-weight: bold;
              }

              tr {
                border-bottom: 1px solid #ddd;
              }

              th {
                background: #fff;

                .ivu-table-cell {
                  color: #111;
                  font-weight: bold;
                  text-transform: capitalize;
                  white-space: nowrap;
                }
              }
            }
          }
        }
      }
    }

    .button {
      /deep/ button {
        background: rgba(76, 132, 255, 1);
        color: #fff;
      }

      /deep/ .clean {
        background: gray;
        opacity: .6;
      }

      .clean:hover {
        cursor: not-allowed;
      }
    }
  }


</style>
