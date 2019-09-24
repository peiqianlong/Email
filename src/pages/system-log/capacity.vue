<template>
  <div class="flex-content">
    <div class="main-ctc">
      <div class="content-header">
        <div class="item title">{{$t('log.nameemail')}}</div>
      </div>
      <!--    操作区域-->
      <div class="content-log">
        <p class="tips">You can check each member's usage of mailbox capacity</p>
        <div class="div" style="margin-top: 8px">
          <div class="tit" style="width:70px">Account:</div>
          <Input style="width:240px;" v-model="searchvalue" :placeholder="$t('message.search')"/>
          <div class="searchBtn" style="margin-left: 8px">Search</div>
        </div>
        <div class="table" style="margin-top: 24px">
          <Table
            ref="selection"
            :columns="internalColumns"
            :data="internalList"
          >
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "capacity",
        data() {
            return {
                startdta: '',
                datalist: [],
                searchvalue: "",
                //表头
                internalColumns: [
                    {
                        title: "Name",
                        key: "Name",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Account",
                        key: "Account",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Used capacity",
                        key: "Used capacity",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "surplus capacity",
                        key: "surplus capacity",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Personal account for than",
                        key: "Personal account for than",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Overall proportion",
                        key: "Overall proportion",
                        ellipsis: true,
                        tooltip: true
                    },

                ],
                //列表数据
                internalList: [],
            }
        }
    }
</script>

<style scoped>

</style>
