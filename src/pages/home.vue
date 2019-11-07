<template>
  <div>
    <div class="lists">
      <ul class="fn-clear">
        <li :key="item.id" v-for="(item,index) in menuList">
          <div class="item fn-clear" @click="toUrl(item)">
            <i :class="'menu-icon'+index"></i>
            <div class="text">
              <div class="title">{{item.title}}</div>
              <div class="remark">{{item.text}}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="email-info">
      <div class="title">{{$t('homeMessage.email_info_title')}}</div>
      <div class="lists">
        <ul>
          <li>
            <div class="item">
              <div class="data-show">
                <span class="num">{{emailInfo.capacity_total.match(/\d+\.?\d*/)[0]}}</span>
                <span class="unit">{{emailInfo.capacity_total.match(/[a-zA-Z]+/)[0]}}</span>
              </div>
              <div class="remark">{{$t('homeMessage.email_info.total_capacity')}}</div>
            </div>
          </li>
          <li>
            <div class="item">
              <div class="data-show">
                <span class="num">{{emailInfo.capacity_used.match(/\d+\.?\d*/)[0]}}</span>
                <span class="unit">{{emailInfo.capacity_used.match(/[a-zA-Z]+/)[0]}}</span>
              </div>
              <div class="remark">{{$t('homeMessage.email_info.used_capacity')}}</div>
            </div>
          </li>
          <li>
            <div class="item">
              <div class="data-show">
                <span class="num">{{emailInfo.capacity_used_ratio.match(/\d+\.?\d*/)[0]}}</span>
                <span class="unit">%</span>
              </div>
              <div class="remark">{{$t('homeMessage.email_info.used_ratio')}}</div>
            </div>
          </li>
          <li>
            <div class="item">
              <div class="data-show">
                <span class="num">{{emailInfo.member_total}}</span>
              </div>
              <div class="remark">{{$t('homeMessage.email_info.total_of_members')}}</div>
            </div>
          </li>
          <li>
            <div class="item">
              <div class="data-show">
                <span class="num">{{emailInfo.department?emailInfo.department:0}}</span>
              </div>
              <div class="remark">{{$t('homeMessage.email_info.total_of_sectors')}}</div>
            </div>
          </li>
          <li>
            <div class="item">
              <div class="data-show">
                <span class="num">{{emailInfo.mail_send}}</span>
              </div>
              <div class="remark">{{$t('homeMessage.email_info.sent_mail')}}</div>
            </div>
          </li>
          <li>
            <div class="item">
              <div class="data-show">
                <span class="num">{{emailInfo.mail_received}}</span>
              </div>
              <div class="remark">{{$t('homeMessage.email_info.received_mail')}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                //首页菜单
                menuList: [],
                //菜单入口
                menu: this.$request.getLocal("userInfo").menu,
                //邮箱信息
                emailInfo: this.$request.getLocal("userInfo").email_info
            };
        },
        created() {
            this.setMenu();
        },
        methods: {
            //首页菜单处理
            setMenu() {
                let _this = this;
                _this.menu.forEach((item, index) => {
                    let obj = {
                        id: null,
                        title: "",
                        text: "",
                        url: ""
                    };
                    switch (item) {
                        case "users":
                            obj.id = index;
                            obj.title = _this.$t("menu.users");
                            obj.text = _this.$t("homeMessage.menu.users_info");
                            obj.url = "/users";
                            _this.menuList.push(obj);
                            break;
                        case "groups":
                            obj.id = index;
                            obj.title = _this.$t("menu.groups");
                            obj.text = _this.$t("homeMessage.menu.groups_info");
                            obj.url = "/groupslist";
                            _this.menuList.push(obj);
                            break;
                        case "units":
                            obj.id = index;
                            obj.title = _this.$t("menu.units");
                            obj.text = _this.$t("homeMessage.menu.units_info");
                            obj.url = "/unitslist";
                            _this.menuList.push(obj);
                            break;
                        case "management_tool":
                            obj.id = index;
                            obj.title = _this.$t("menu.management_tool");
                            obj.text = _this.$t("homeMessage.menu.management_tools_info");
                            obj.url = "management-tool";
                            _this.menuList.push(obj);
                            break;
                        case "system_log":
                            obj.id = index;
                            obj.title = _this.$t("menu.system_log");
                            obj.text = _this.$t("homeMessage.menu.system_log");
                            obj.url = "";
                            _this.menuList.push(obj);
                            break;
                        case "company":
                            obj.id = index;
                            obj.title = _this.$t("menu.company_profile");
                            obj.text = _this.$t("homeMessage.menu.company_profile_info");
                            obj.url = "/profile";
                            _this.menuList.push(obj);
                            break;
                        case "administrator":
                            obj.id = index;
                            obj.title = _this.$t("menu.administrator_role");
                            obj.text = _this.$t("homeMessage.menu.administrator_role");
                            obj.url = "/account2";
                            _this.menuList.push(obj);
                            break;
                    }
                });


                this.$request.get("/user/info").then(res => {
                    console.log(res)
                    res.status === 1 ? this.$request.setLocal("userInfo", res.result) : "";
                    // next()
                });
            },
            //首页菜单路由跳转
            toUrl(item) {
                this.$router.push(item.url);
                if (this.$store.state.menuIsShow) {
                    this.$store.commit("menuToggle");
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
  .lists {
    padding: 4px 0;
    margin: 0 -8px;

    ul li {
      float: left;
      width: 25%;
      margin-bottom: 20px;
    }

    .item {
      padding: 30px 24px;
      margin: 0 8px;
      border: $border-style;
      @include shadow($v-shadow: 1px);
      border-radius: $border-radius1;
      cursor: pointer;
      @include e-transition();
      position: relative;

      i {
        float: left;
        width: 100px;
        height: 100px;
      }

      @for $i from 0 through 6 {
        .menu-icon#{$i} {
          background: url(../assets/images/menu-icon#{$i}.png) no-repeat;
        }
      }

      .text {
        margin-left: 134px;
        color: $font-color1;
        padding-top: 15px;
        height: 100px;

        .title {
          font-size: 24px;
          font-weight: bold;
          line-height: 28px;
          text-transform: capitalize;
        }

        .remark {
          line-height: 16px;
          margin-top: 12px;
        }
      }

      &:hover {
        z-index: 1;
        @include shadow($v-shadow: 2px, $blur: 20px);
      }
    }

    .data-show {
      color: $font-color2;
      font-weight: bold;
      font-size: 0;

      .num {
        font-size: 56px;
      }

      .unit {
        font-size: 16px;
      }
    }
  }

  .email-info {
    text-align: center;
    margin-top: 61px;

    .title {
      font-size: 24px;
      font-weight: bold;
      color: $font-color1;
      line-height: 28px;
      text-align: left;
      text-transform: capitalize;
      margin-bottom: 10px;
    }

    .lists ul li {
      width: 14.2857143%;

      .item {
        cursor: initial;
      }
    }

    .remark {
      height: 34px;
      font-size: 14px;
      line-height: 16px;
    }
  }

  @media screen and (max-width: 1730px) {
    .lists ul li {
      width: 33.333333%;
    }
    .email-info .lists ul li {
      width: 16.666667%;
    }
  }

  @media screen and (max-width: 1400px) {
    .email-info .lists ul li {
      width: 25%;
    }
  }

  @media screen and (max-width: 1330px) {
    .lists ul li {
      width: 50%;
    }
  }
</style>


