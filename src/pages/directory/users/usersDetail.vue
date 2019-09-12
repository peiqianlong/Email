<template>
  <div class="flex-content">
    <div class="main-ctc">
      <!-- 顶部操作区   start -->
      <div class="content-header">
        <div class="item title">User detail</div>
      </div>
      <!-- 顶部操作区   end -->
      <ul class="details-list">
        <li>
          <label class="column">name:</label>
          <div class="text">{{formData.username}}</div>
        </li>
        <li>
          <label class="column">account:</label>
          <div class="text">{{formData.mail_name}}</div>
        </li>
        <li>
          <label class="column">sex:</label>
          <div class="text">
            <span v-if="formData.sex==='1'">男</span>
            <span v-if="formData.sex==='2'">女</span>
          </div>
        </li>
        <li>
          <label class="column">phone number:</label>
          <div class="text">{{`+${formData.country_code}${formData.mobile}`}}</div>
        </li>
        <li>
          <label class="column">tel:</label>
          <div class="text">{{`+${formData.tel_code}${formData.tel}`}}</div>
        </li>
        <li>
          <label class="column">address:</label>
          <div class="text">{{formData.address}}</div>
        </li>
        <li>
          <label class="column">section:</label>
          <div class="text">
            <span
              v-for="(item,index) in formData.department"
              :key="item.id"
            >{{index==formData.department.length-1?item.title:`${item.title},`}}</span>
          </div>
        </li>
        <li>
          <label class="column">title:</label>
          <div class="text">{{formData.position}}</div>
        </li>
        <li>
          <label class="column">identity:</label>
          <div class="text">
            <span v-if="formData.identity==='0'">普通用户</span>
            <span v-if="formData.identity==='1'">上级</span>
          </div>
        </li>
        <li>
          <label class="column">group:</label>
          <div class="text">
            <span
              v-for="(item,index) in formData.group"
              :key="item.id"
            >{{index==formData.group.length-1?item.group_name:`${item.group_name},`}}</span>
          </div>
        </li>
        <li>
          <label class="column">logon_rights:</label>
          <div class="text">
            <span v-for="(item,index) in formData.logon_rights" :key="item.id">
              <span v-if="item==='1'">imap/smtp</span>
              <span v-if="item==='2'">pop/smtp</span>
              <span v-if="item==='3'">secure login</span>
              {{index===formData.logon_rights.length-1?"":","}}
            </span>
          </div>
        </li>
        <li>
          <label class="column">active:</label>
          <div class="text">
            <span v-if="formData.active==='1'">启用</span>
            <span v-if="formData.active==='0'">禁用</span>
          </div>
        </li>
        <li>
          <label class="column">status:</label>
          <div class="text">
            <span v-if="formData.status==='1'">是</span>
            <span v-if="formData.status==='0'">否</span>
          </div>
        </li>
        <li>
          <button class="primary" @click="cancle">Cancel</button>
        </li>
      </ul>
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
        .get("/member/detail", { id: _this.$route.query.id })
        .then(res => {
          if (res.status === 1) {
            _this.formData = res.result;
          }
        });
    },
    cancle() {
      this.$router.push("/users");
    }
  }
};
</script>
