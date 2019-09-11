<template>
  <div class="flex-layout">
    <div class="flex-content">
      <div class="main-ctc">
        <!-- 顶部操作区   start -->
        <div class="content-header">
          <div class="item title">GroupsManage detail</div>
        </div>
        <!-- 顶部操作区   end -->
        <ul class="details-list">
          <li>
            <label class="column">group name:</label>
            <div class="text">{{formData.group_name}}</div>
          </li>
          <li>
            <label class="column">description:</label>
            <div class="text">{{formData.description}}</div>
          </li>
          <li>
            <label class="column">group alias:</label>
            <div class="text">{{`${formData.group_alias}@${formData.mail_domain}`}}</div>
          </li>
          <li>
            <label class="column">access type:</label>
            <div class="text">{{formData.access_type===0?"public":"private"}}</div>
          </li>
          <li>
            <label class="column">member count:</label>
            <div class="text">{{formData.member_count}}</div>
          </li>

          <li>
            <button class="primary" @click="cancle">Cancel</button>
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
      formData: {}
    };
  },

  created() {
    this.getDetail();
  },

  methods: {
    //获取详情信息
    getDetail() {
      let _this = this;
      _this.$request
        .get("/group/detail", { id: _this.$route.query.id })
        .then(res => {
          if (res.status === 1) {
            _this.formData = res.result;
          }
        });
    },
    cancle() {
      this.$router.push("/groupsmanage");
    }
  }
};
</script>