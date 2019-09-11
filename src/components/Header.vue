<template>
  <div>
    <!-- 头部内容   start -->
    <header>
      <!-- 头部左侧内容  start -->
      <div class="float-left">
        <i class="iconfont iconmenu icon-button menu-btn" @click="toggleMenu"></i>
        <a href class="logo"></a>
        <div class="search iconfont iconsearch">
          <Input :placeholder="this.$t('message.search')" />
        </div>
      </div>
      <!-- 头部左侧内容  end -->
      <!-- 头部右侧内容  start -->
      <div class="float-right">
        <!-- 帮助  start -->
        <div class="help">
          <i class="iconfont iconhelp icon-button"></i>
          <ul class="poptip-content">
            <li>
              <i class="iconfont iconhelp"></i>
              <span>{{$t('head.help')}}</span>
            </li>
            <li>
              <i class="iconfont iconfeedback"></i>
              <span>{{$t('head.feedback')}}</span>
            </li>
          </ul>
        </div>
        <!-- 帮助  end -->
        <!-- 应用  start -->
        <div class="application">
          <i class="iconfont iconall icon-button"></i>
          <ul class="poptip-content fn-clear">
            <li v-for="item in applicationList">
              <div class="image-box">
                <img :src="item.imageUrl" alt />
              </div>
              <div class="text">{{item.text}}</div>
            </li>
          </ul>
        </div>
        <!-- 应用  end -->
        <!-- 用户  start -->
        <div class="user">
          <div class="head-portrait">
            <img src alt />
          </div>
          <div class="poptip-content fn-clear">
            <div class="float-left">
              <img src alt />
            </div>
            <div class="info">
              <div class="name">
                <span>{{userInfo.name}}</span>
                <i class="iconfont iconordinary_user"></i>
              </div>
              <div class="email">{{userInfo.username}}</div>
              <div class="phone">{{userInfo.mobile}}</div>
              <button class="primary" @click="signOut">{{$t('operation.sign_out')}}</button>
            </div>
          </div>
        </div>
        <!-- 用户  end -->
      </div>
      <!-- 头部右侧内容  end -->
    </header>
    <!-- 头部内容   end -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      applicationList: [
        {
          imageUrl: "",
          text: "Account"
        },
        {
          imageUrl: "",
          text: "Admin"
        },
        {
          imageUrl: "",
          text: "maoyitong"
        },
        {
          imageUrl: "",
          text: "Account"
        },
        {
          imageUrl: "",
          text: "Admin"
        },
        {
          imageUrl: "",
          text: "maoyitong"
        }
      ],
      userInfo: this.$request.getLocal("userInfo")
    };
  },
  methods: {
    //左侧菜单显示隐藏
    toggleMenu() {
      this.$store.commit("menuToggle");
    },
    //注销
    signOut() {
      this.$request.removeLocal("sid");
      window.location.href = "http://mail.phrmg.org";
    }
  }
};
</script>
<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  min-width: 1200px;
  padding: 0 28px;
  z-index: 99;
  background: #fff;
  @include shadow(
    $h-shadow: 0,
    $v-shadow: 0,
    $blur: 4px,
    $spread-color: rgba(0, 0, 0, 0.2)
  );
  .float-left,
  .float-right {
    line-height: 64px;
    font-size: 0;
  }
  .menu-btn,
  .logo,
  .search {
    display: inline-block;
    vertical-align: middle;
  }

  .menu-btn {
    cursor: pointer;
  }
  .logo {
    width: 96px;
    height: 28px;
    background: url(../assets/images/ecer_logo.png) no-repeat;
    margin-left: 16px;
  }

  .help,
  .application,
  .user {
    display: inline-block;
    vertical-align: middle;
    margin-left: 18px;
    position: relative;
    .iconfont {
      font-size: 18px;
    }
    &:hover .poptip-content {
      visibility: visible;
      opacity: 1;
    }
    &:hover .icon-button {
      background: $background-color;
    }
  }
  .user .head-portrait {
    cursor: pointer;
    @include image-show($width: 36px, $height: 36px);
  }
  .poptip-content {
    position: absolute;
    top: 51px;
    right: -20px;
    border: $border-style;
    visibility: hidden;
    opacity: 0;
    border-radius: $border-radius1;
    overflow: hidden;
    background: #fff;
    @include e-transition();
    @include shadow(
      $h-shadow: 0,
      $v-shadow: 2px,
      $blur: 4px,
      $spread-color: rgba(0, 0, 0, 0.32)
    );
    z-index: 2;
  }
  .help .poptip-content {
    width: 178px;
    padding: 8px 0;
    li {
      font-size: 0;
      color: $font-color3;
      padding: 0 13px;
      line-height: 32px;
      cursor: pointer;
      @include e-transition($property: background);
      i,
      span {
        display: inline-block;
        vertical-align: middle;
      }
      i {
        margin-right: 9px;
      }
      span {
        font-size: $font-size;
      }
      &:hover {
        background: $background-color;
      }
    }
  }
  .application .poptip-content {
    width: 320px;
    padding: 24px 28px;
    li {
      float: left;
      width: 33.333333%;
      height: 88px;
      padding: 12px;
      border: 1px solid transparent;
      margin: 8px 0;
      cursor: pointer;
      .image-box {
        @include image-show();
        margin: 0 auto;
      }
      &:hover {
        border: $border-style;
        border-radius: 4px;
      }
      .text {
        font-size: $font-size;
        line-height: 17px;
        color: $font-color1;
        text-align: center;
        margin-top: 4px;
      }
    }
  }
  .user .poptip-content {
    padding: 20px 24px 20px 20px;
    height: 140px;
    .float-left {
      @include image-show($width: 96px, $height: 96px);
    }
    .info {
      margin-left: 112px;
      color: $font-color3;
      font-size: $font-size;
      line-height: 17px;
      min-width: 140px;
      .name {
        font-size: 0;
        i,
        span {
          display: inline-block;
          vertical-align: middle;
        }
        i {
          font-size: 16px;
          margin-left: 10px;
        }
        span {
          font-size: $font-size;
          color: $font-color1;
        }
      }
      .email {
        display: inline-block;
        margin: 4px 0;
        color: $font-color3;
      }
      button {
        padding: 5px 40px 6px;
        margin-top: 4px;
      }
    }
  }
}
</style>