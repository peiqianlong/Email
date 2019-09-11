<template>
  <div>
    <!-- 左侧导航    start -->
    <nav :class="{'on':this.$store.state.menuIsShow}">
      <ul class="menu">
        <li
          v-if="item.isShow"
          v-for="(item,index) in menuList"
          :class="currentIndex===item.id?'on':''"
        >
          <div class="item" @click="toUrl(item,item.id)">
            <i :class="['iconfont',item.icon]"></i>
            <span>{{item.text}}</span>
            <i v-show="item.secondMenu" class="iconfont iconicon_select arrow"></i>
          </div>
          <dl v-if="item.secondMenu&&item.isShow">
            <dt
              v-if="it.isShow"
              v-for="it in item.secondMenu"
              @click="toUrl(it,item.id,it.id)"
              :class="currentSecondIndex===it.id?'on':''"
            >{{it.text}}</dt>
          </dl>
        </li>
      </ul>
    </nav>
    <!-- 左侧导航    end -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentIndex: 0, //当前一级菜单
      currentSecondIndex: 0, //当前二级菜单
      //菜单列表
      menuList: [
        {
          id: 0,
          icon: "iconhome",
          text: this.$t("menu.home"),
          url: "/",
          isShow: true
        },
        {
          id: 1,
          icon: "icondirectory",
          text: this.$t("menu.directory"),
          url: "/users",
          isShow: false,
          secondMenu: [
            {
              id: 11,
              text: this.$t("menu.users"),
              url: "/users",
              isShow: false
            },
            {
              id: 12,
              text: this.$t("menu.units"),
              url: "/unitslist",
              isShow: false
            },
            {
              id: 13,
              text: this.$t("menu.groups"),
              url: "/groupslist",
              isShow: false
            }
          ]
        },
        {
          id: 2,
          icon: "iconmanagement",
          text: this.$t("menu.management_tool"),
          url: "/management-tool",
          isShow: false
        },
        {
          id: 3,
          icon: "iconsystem",
          text: this.$t("menu.system_log"),
          url: "/system-log",
          isShow: false
        },
        {
          id: 4,
          icon: "iconaccount",
          text: this.$t("menu.account"),
          url: "/profile",
          isShow: false,
          secondMenu: [
            {
              id: 41,
              text: this.$t("menu.company_profile"),
              url: "/profile",
              isShow: false
            },
            {
              id: 42,
              text: this.$t("menu.administrator_role"),
              url: "/account2",
              isShow: false
            }
          ]
        },
        {
          id: 5,
          icon: "iconfeedback",
          text: this.$t("menu.feedback"),
          url: "/feedback",
          isShow: false
        }
      ],
      menu: this.$request.getLocal("userInfo").menu
    };
  },
  created() {
    this.setMenu();
  },
  methods: {
    //首页菜单处理
    setMenu() {
      let _this = this;
      _this.menu.forEach(item => {
        switch (item) {
          case "users":
            _this.menuList[1].isShow = true;
            _this.menuList[1].secondMenu[0].isShow = true;
            break;
          case "units":
            _this.menuList[1].isShow = true;
            _this.menuList[1].secondMenu[1].isShow = true;
            break;
          case "groups":
            _this.menuList[1].show = true;
            _this.menuList[1].secondMenu[2].isShow = true;
            break;
          case "management_tool":
            _this.menuList[2].isShow = true;
            break;
          case "system_log":
            _this.menuList[3].isShow = true;
            break;
          case "company":
            _this.menuList[4].isShow = true;
            _this.menuList[4].secondMenu[0].isShow = true;
            break;
          case "administrator":
            _this.menuList[4].isShow = true;
            _this.menuList[4].secondMenu[1].isShow = true;
            break;
          case "feedback":
            _this.menuList[5].isShow = true;
            break;
        }
      });
    },
    //菜单路由跳转
    toUrl(item, id, id2) {
      this.$router.push(item.url);
      this.currentIndex = id ? id : 0;
      this.currentSecondIndex = id2
        ? id2
        : item.secondMenu
        ? item.secondMenu[0].id
        : "";
      this.$store.commit("menuToggle");
    }
  }
};
</script>
<style lang="scss" scoped>
nav {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 255px;
  padding-top: 21px;
  padding-right: 16px;
  z-index: 98;
  background: #fff;
  @include e-transformX($val: -130%);
  @include shadow(
    $h-shadow: 1px,
    $v-shadow: 0,
    $blur: 8px,
    $spread-color: rgba(170, 170, 170, 1)
  );
  @include e-transition();
  .menu {
    li {
      position: relative;
      .item {
        height: 36px;
        line-height: 36px;
        padding: 0 44px 0 28px;
        font-size: 0;
        border-width: 0 0 0 3px;
        border-style: solid;
        border-color: transparent;
        border-radius: 0px 18px 18px 0px;
        cursor: pointer;
        @include e-transition();
      }
      i,
      span {
        display: inline-block;
        vertical-align: middle;
        color: $font-color3;
        @include e-transition();
      }
      i {
        font-size: 18px;
        margin-right: 18px;
      }
      span {
        font-size: $font-size;
        text-transform: capitalize;
      }
      .arrow {
        position: absolute;
        right: 5px;
        font-size: 28px;
      }
      &.on,
      &.on:hover {
        .item {
          background: #e2ebff;
          border-color: $font-color5;
          i,
          span {
            color: $font-color5;
          }
        }
      }
      &:hover .item {
        background: $background-color;
      }
      &:hover dl {
        visibility: visible;
        opacity: 1;
      }
    }
    dl {
      position: absolute;
      width: 180px;
      right: -82px;
      border: $border-style;
      border-radius: $border-radius1;
      overflow: hidden;
      z-index: 10;
      padding: 8px 0;
      visibility: hidden;
      opacity: 0;
      background: #fff;
      @include e-transition();
      @include shadow(
        $h-shadow: 0,
        $v-shadow: 2px,
        $blur: 4px,
        $spread-color: rgba(0, 0, 0, 0.32)
      );
      dt {
        color: $font-color3;
        line-height: 32px;
        padding: 0 19px;
        cursor: pointer;
        text-transform: capitalize;
        @include e-transition($property: background);
        &:hover {
          background: $background-color;
        }
        &.on {
          color: $font-color5;
        }
      }
    }
  }
  &.on {
    visibility: visible;
    opacity: 1;
    @include e-transformX(0);
  }
}
</style>