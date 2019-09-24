<template>
  <div class="flex-content">
    <div class="main-ctc">
      <div class="content-header">
        <div class="item title">{{$t('log.nameemail')}}</div>
      </div>
      <!--    操作区域-->
      <div class="content-log">
        <p class="tips">You can only check emails for the last three months.</p>
        <div class="div">
          <div class="tit" style="width:70px">Title:</div>
          <Input style="width:240px;" v-model="searchvalue" :placeholder="$t('message.search')"/>
          <div class="tit" style="margin-left: 16px">Starting and ending time:</div>
          <div class="datepikere">
            <div class="startdata height32">
              <Select v-model="startdta">
                <Option v-for="item in datalist" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="fuhao">-</div>
            <div class="enddata height32">
              <Select v-model="startdta">
                <Option v-for="item in datalist" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
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
        name: "Systeminfo",
        data() {
            return {
                startdta: '',
                datalist: [],
                searchvalue: "",
                //表头
                internalColumns: [
                    {
                        title: "Title",
                        key: "Title",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Receipt time",
                        key: "Receipt time",
                        ellipsis: true,
                        tooltip: true
                    }

                ],
                //列表数据
                internalList: [],
            }
        }
    }
</script>

<style scoped>

</style>
