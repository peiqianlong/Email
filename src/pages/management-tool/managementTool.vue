<template>
  <div class="management-tool">
    <div class="management-head">
      <i class="left-icon"></i>
      <div class="text">
        <div class="tool-title">Management Tool</div>
        <div class="tool-desc">nancy</div>
      </div>
    </div>
    <Collapse simple>
      <Panel name="1">
        <div class="toggle-item">
          <div class="item-title">Internal announcement</div>
          <div
            class="item-desc"
          >You can set up notices and announcements to be published within the enterprise.</div>
        </div>
        <div slot="content" class="toggle-content">
          <div class="buttons">
            <button>Publish</button>
            <button>Delete</button>
            <button>Withdraw</button>
          </div>
          <div class="table">
            <Table
              ref="selection"
              :columns="internalColumns"
              :data="internalList"
              @on-selection-change="selectChange"
            ></Table>
          </div>
        </div>
      </Panel>
      <Panel name="2">
        <div class="toggle-item">
          <div class="item-title">Welcome letter</div>
          <div
            class="item-desc"
          >You can set up and select a welcome letter, the new user will receive a welcome letter.</div>
        </div>
        <div slot="content" class="toggle-content">
          <RadioGroup v-model="letterType">
            <div class="radio-item">
              <Radio label="0">System Default</Radio>
              <button>View>></button>
            </div>
            <div class="radio-item">
              <Radio label="1">Custom settings</Radio>
              <button>Custom>></button>
            </div>
            <div class="radio-item">
              <Radio label="2">Close the welcome letter</Radio>
            </div>
          </RadioGroup>
        </div>
      </Panel>
      <Panel name="3">
        <div class="toggle-item">
          <div class="item-title">Mail transfer</div>
          <div
            class="item-desc"
          >Messages sent externally to your corporate mailbox, if the recipient does not exist, are moved to the specified mailbox.</div>
        </div>
        <div slot="content" class="toggle-content">
          <div
            class="desc-text"
          >Messages sent externally to your corporate mailbox, if the recipient does not exist, are moved to the specified mailbox.This mailbox may receive a lot of spam. It is recommended to set it as a non-work mailbox.</div>
          <div class="form">
            <Form :model="mailTransfer" :label-width="60" label-position="left">
              <FormItem label="Email:" prop="mail">
                <Input v-model.trim="mailTransfer.mail"></Input>
                <button class="primary">save</button>
              </FormItem>
            </Form>
          </div>
        </div>
      </Panel>
      <Panel name="4">
        <div class="toggle-item">
          <div class="item-title">Receive limit</div>
          <div
            class="item-desc"
          >You can set up some rules to ensure that you don't get junk mail and important emails don't get lost.</div>
        </div>
        <div slot="content" class="toggle-content">
          <Tabs value="Whitelist">
            <TabPane label="Whitelist" name="Whitelist">
              <div
                class="desc-text"
              >From the whitelist email address or domain name, only affected by user custom rules, ensure that you can receive his mail.For example: zhangsan@example.com or example.com</div>
              <div class="form">
                <Form :model="receiveForm">
                  <FormItem prop="mail">
                    <Input v-model.trim="receiveForm.value"></Input>
                    <button class="primary">add</button>
                    <button class="gray">delete</button>
                  </FormItem>
                </Form>
              </div>
              <div class="table">
                <Table
                  ref="selection"
                  :columns="receiveColumns"
                  :data="receiveList"
                  @on-selection-change="selectChange"
                ></Table>
              </div>
            </TabPane>
            <TabPane label="Blacklist" name="Blacklist">
              <div
                class="desc-text"
              >From the whitelist email address or domain name, only affected by user custom rules, ensure that you can receive his mail.For example: zhangsan@example.com or example.com</div>
              <div class="form">
                <Form :model="receiveForm">
                  <FormItem prop="mail">
                    <Input v-model.trim="receiveForm.value"></Input>
                    <button class="primary">add</button>
                    <button class="gray">delete</button>
                  </FormItem>
                </Form>
              </div>
              <div class="table">
                <Table
                  ref="selection"
                  :columns="receiveColumns"
                  :data="receiveList"
                  @on-selection-change="selectChange"
                ></Table>
              </div>
            </TabPane>
            <TabPane label="Filter" name="Filter">
              <div
                class="desc-text"
              >From the whitelist email address or domain name, only affected by user custom rules, ensure that you can receive his mail.For example: zhangsan@example.com or example.com</div>
              <div class="form">
                <Form :model="receiveForm">
                  <FormItem prop="mail">
                    <Input v-model.trim="receiveForm.value"></Input>
                    <button class="primary">add</button>
                    <button class="gray">delete</button>
                  </FormItem>
                </Form>
              </div>
              <div class="table">
                <Table
                  ref="selection"
                  :columns="receiveColumns"
                  :data="receiveList"
                  @on-selection-change="selectChange"
                ></Table>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //表头
      internalColumns: [
        {
          type: "selection",
          width: 52,
          align: "center"
        },
        {
          title: "Title",
          key: "username",
          ellipsis: true,
          tooltip: true
        },
        {
          title: "Number of people",
          key: "position",
          ellipsis: true,
          tooltip: true
        },
        {
          title: "Time",
          key: "department",
          ellipsis: true,
          tooltip: true
        },
        {
          title: this.$t("userListTableTh.status"),
          key: "status",
          render: (h, params) => {
            let text = params.row.status === "0" ? "Disable" : "Able";
            return h("span", text);
          }
        }
      ],
      //列表数据
      internalList: [],
      letterType: "",
      mailTransfer: {
        mail: ""
      },
      receiveForm: {
        value: ""
      },
      receiveColumns: [
        {
          type: "selection",
          width: 52,
          align: "center"
        },
        {
          title: "address",
          key: "address",
          ellipsis: true,
          tooltip: true
        }
      ],
      receiveList: []
    };
  },
  methods: {
    selectChange() {}
  }
};
</script>
<style lang="scss">
.management-tool {
  .left-icon {
    background: url(../../assets/images/menu-icon3.png) no-repeat;
  }
}
</style>