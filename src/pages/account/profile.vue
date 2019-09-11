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
      <Panel name="1">
        <div class="toggle-item">
          <div class="item-title">Company profile</div>
          <div
            class="item-desc"
          >Change your company name, language, and time zone,and other Settings that apply to the company.</div>
        </div>
        <div slot="content" class="toggle-content"></div>
      </Panel>
      <Panel name="2">
        <div class="toggle-item">
          <div class="item-title">Email information</div>
          <div class="item-desc">Show the basiv information of the mailbox.</div>
        </div>
        <div slot="content" class="toggle-content"></div>
      </Panel>
      <Panel name="3">
        <div class="toggle-item">
          <div class="item-title">Domain Management</div>
          <div
            class="item-desc"
          >You can set the domain name LOGO, you can also cancel your domain name.</div>
        </div>
        <div slot="content" class="toggle-content"></div>
      </Panel>
      <Panel name="4">
        <div class="toggle-item">
          <div class="item-title">Address book management</div>
          <div class="item-desc">Set up some members to view the enterprise address book.</div>
        </div>
        <div slot="content" class="toggle-content"></div>
      </Panel>
    </Collapse>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss">
.management-tool .management-head .left-icon.profile {
  background: url(../../assets/images/menu-icon2.png) no-repeat;
}
</style>