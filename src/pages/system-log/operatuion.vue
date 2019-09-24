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
          <div class="tit">Starting and ending time:</div>
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
          <div style="margin-left: 32px;width: 46px" class="tit">Role:</div>
          <div class="type">
            <div class="enddata height32" style="width: 120px">
              <Select v-model="startdta">
                <Option v-for="item in datalist" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div style="margin-left: 32px;width: 133px" class="tit">Operating record:</div>
          <div class="type">
            <div class="enddata height32" style="width: 120px">
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
        name: "operatuion",
        data() {
            return {
                startdta: '',
                datalist: [],
                searchvalue: "",
                //表头
                internalColumns: [
                    {
                        title: "Operator",
                        key: "Operator",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Role",
                        key: "Role",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Operating record",
                        key: "Operating record",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Operation time",
                        key: "Operation time",
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
