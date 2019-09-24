<template>
  <div class="flex-layout">
    <!-- 左侧内容   start -->
    <div class="flex-side">
      <div class="main-ctc">
        <Tree :data="departmentTree" @on-select-change="selcetclick"></Tree>
      </div>
    </div>
    <!-- 左侧内容   end -->
    <!-- 右侧内容   start -->
    <router-view></router-view>
    <!-- 右侧内容   end -->
  </div>
</template>
<script>
    export default {
        data() {
            return {
                departmentTree: [
                    {
                        title: 'Highlights',
                        expand: true,
                        selected: true,
                        path: '/system-log'
                    }, {
                        title: 'Usage Activity',
                        expand: true,
                        path: '/system-log/emaillog',
                        children: [
                            {
                                title: 'Email',
                                expand: true,
                                path: '/system-log/emaillog'
                            },
                            {
                                title: 'Capacity',
                                expand: true,
                                path: '/system-log/capacity'

                            }
                        ]
                    }, {
                        title: 'Systeminfo',
                        expand: true,
                        path: '/system-log/systeminfo'
                    }, {
                        title: 'Operation Log',
                        expand: true,
                        path: '/system-log/operatuion'
                    },
                ]
            }
        },
        methods: {
            selcetclick(val) {
                if (val.length <= 0) {
                    return
                }
                this.$router.push(val[0].path)
            }
        }
    }
</script>
