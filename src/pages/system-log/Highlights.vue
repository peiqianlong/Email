<template>
  <div class="flex-content">
    <div class="main-ctc">
      <div class="content-header">
        <div class="item title">{{$t('log.name')}}</div>
      </div>
      <!--    操作区域-->
      <div class="content-log">
        <div class="div">
          <div class="tit">Starting and ending time:</div>
          <div class="datepikere" style="margin-right: 16px">
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
          <button>{{$t('log.7')}}</button>
          <button>{{$t('log.30')}}</button>
          <button>{{$t('log.Refresh')}}</button>
        </div>
      </div>
      <div style="position: relative">
        <div id="main" class="contenttable" style="height:386px;">
        </div>
        <div class="tips">
          <div class="Send_mail">
            <div class="line"></div>
            Send mail
          </div>
          <div class="Receive_email">
            <div class="line"></div>
            Receive email
          </div>
        </div>
      </div>

      <div class="tablist">
        <div class="content-sel">
          <div @click="selline(1)" class="meber" :class="[line == 1 ? 'selcolor':'']">Members</div>
          <div @click="selline(0)" class="right" :class="[line == 0 ? 'selcolor':'']">Rights</div>
          <div class=" line
          " :style="{'transform':line ==1 ?' translateX(16px)' : 'translateX(99px)','width':line ==1 ?' 83px' : '64px'
          }">
          </div>
        </div>
      </div>
      <div class="contenttable">
        <div class="table">
          <Table
            ref="selection"
            :columns="internalColumns"
            :data="internalList"
          ></Table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    // 引入 ECharts 主模块
    var echarts = require('echarts/lib/echarts');
    // 引入折现统计图
    require('echarts/lib/chart/bar');
    require("echarts/lib/chart/line");
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    export default {

        data() {
            return {
                line: 1,//选中的
                startdta: '',
                datalist: [],
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
                        title: "Total",
                        key: "Total",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "In the domain",
                        key: "domain",
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: "Exterior domain",
                        key: "Exterior",
                        ellipsis: true,
                        tooltip: true
                    }

                ],
                //列表数据
                internalList: [],
            }
        },
        mounted() {
            this.echartsinit()
        },
        methods: {
            //初始化图表
            echartsinit() {

                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: ''
                    },
                    grid: {
                        left: 50,
                        right: 306,
                        bottom: 65,
                    },
                    xAxis: {
                        type: 'category',
                        data: ['2019-01-01', '2019-01-01', '2019-01-01', '2019-01-01', '2019-01-01', '2019-01-01', '2019-01-01'],
                        boundaryGap: true,
                        axisTick: {
                            show: false,
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: false,
                        }
                    },
                    series: [{
                        data: [820, 932, 901, 934, 932, 901, 934,],
                        type: 'line',
                        symbol: "circle",
                        symbolSize: "8",
                        color: "#4C84FF",
                        lineStyle: {
                            type: "dotted",

                        }
                    }, {
                        data: [1320, 1330, 1290, 934, 1320, 1330, 1290,],
                        type: 'line',
                        symbol: "circle",
                        symbolSize: "8",
                        color: "#FFC51E",
                    },
                    ]
                });
            },
            //tab切换
            selline(val) {
                this.line = val
            },
        }
    }
</script>
<style lang="scss">
  .datepikere {
    /*margin-right: 16px;*/
  }

  .tablist {
    margin-bottom: 24px;

    .content-sel {
      width: 100%;
      position: absolute;
      left: -16px;
      top: 0;
    }


  }

</style>
