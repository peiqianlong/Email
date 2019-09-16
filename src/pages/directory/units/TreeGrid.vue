<template>
  <div class="tree-table">
    <ul class="tree-table-header">
      <li v-for="(column,index) in cloneColumns" :key="column.index" v-if="column.type!=='action'">
        <div>{{ renderHeader(column, index) }}</div>
      </li>
    </ul>
    <ul class="tree-table-body">
      <li
        v-for="(item,index) in initItems"
        :key="item.id"
        v-show="show(item)"
        :class="{'child-tr':item.parent}"
      >
        <div
          v-for="(column,snum) in columns"
          :key="column.key"
          :style="tdStyle(column)"
          :class="column.type === 'action'?'action':'item'"
        >
          <div @click="toggle(index,item)" v-if="!column.type">
            <span v-if="snum==iconRow()">
              <i v-html="item.spaceHtml"></i>
              <i
                v-if="item.children&&item.children.length>0"
                class="iconfont iconicon_select"
                :class="{'ios-arrow-down':item.expanded }"
              ></i>
              <i v-else class="ms-tree-space"></i>
            </span>
            {{renderBody(item,column) }}
          </div>
          <div v-if="column.type === 'action'">
            <IconPoptip
              @popClick="RowClick(item,action.type)"
              v-for="action in (column.actions)"
              :key="action.id"
              :iconName="action.iconName"
              :title="action.title"
            ></IconPoptip>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
    export default {
        name: "treeGrid",
        props: {
            columns: Array,
            items: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                initItems: [], //处理后数据数组
                cloneColumns: [], //处理后的表头数据
                screenWidth: document.body.clientWidth, //自适应宽
                tdsWidth: 0, //td总宽
                timer: false, //控制监听时长
                dataLength: 0 //树形数据长度
            };
        },
        computed: {
            tableWidth() {
                return this.tdsWidth > this.screenWidth && this.screenWidth > 0
                    ? this.screenWidth + "px"
                    : "100%";
            }
        },
        watch: {
            screenWidth(val) {
                if (!this.timer) {
                    this.screenWidth = val;
                    this.timer = true;
                    setTimeout(() => {
                        this.timer = false;
                    }, 400);
                }
            },
            items() {
                if (this.items) {
                    this.dataLength = this.Length(this.items);
                    this.initData(this.deepCopy(this.items), 1, null);
                }
            }
        },
        mounted() {
            if (this.items) {
                this.dataLength = this.Length(this.items);
                this.initData(this.deepCopy(this.items), 1, null);
            }
            // 绑定onresize事件 监听屏幕变化设置宽
            this.$nextTick(() => {
                this.screenWidth = document.body.clientWidth;
            });
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth;
                    this.screenWidth = window.screenWidth;
                })();
            };
        },
        methods: {
            // 有无多选框折叠位置优化
            iconRow() {
                return 0;
            },
            // 设置td宽度,td的align
            tdStyle(column) {
                var style = {};
                if (column.align) {
                    style["text-align"] = column.align;
                }
                if (column.width) {
                    style["min-width"] = column.width + "px";
                }
                return style;
            },

            // 点击某一行事件
            RowClick(data, type) {
                let result = this.makeData(data);
                this.$emit("on-row-click", result, type);
            },
            // 点击事件 返回数据处理
            makeData(data) {
                const t = this.type(data);
                let o;
                if (t === "array") {
                    o = [];
                } else if (t === "object") {
                    o = {};
                } else {
                    return data;
                }
                if (t === "array") {
                    for (let i = 0; i < data.length; i++) {
                        o.push(this.makeData(data[i]));
                    }
                } else if (t === "object") {
                    for (let i in data) {
                        if (
                            i != "spaceHtml" &&
                            i != "parent" &&
                            i != "level" &&
                            i != "expanded" &&
                            i != "isShow" &&
                            i != "load"
                        ) {
                            o[i] = this.makeData(data[i]);
                        }
                    }
                }
                return o;
            },
            // 处理表头数据
            makeColumns() {
                let columns = this.deepCopy(this.columns);
                this.tdsWidth = 0;
                columns.forEach((column, index) => {
                    column._index = index;
                    column._width = column.width ? column.width : "";
                    column._sortType = "normal";
                    this.tdsWidth += column.width ? parseFloat(column.width) : 0;
                });
                return columns;
            },
            // 数据处理 增加自定义属性监听
            initData(items, level, parent) {
                this.initItems = [];
                let spaceHtml = "";
                for (var i = 1; i < level; i++) {
                    spaceHtml += "<i class='ms-tree-space'></i>";
                }
                items.forEach((item, index) => {
                    item = Object.assign({}, item, {
                        parent: parent,
                        level: level,
                        spaceHtml: spaceHtml
                    });
                    if (typeof item.expanded == "undefined") {
                        item = Object.assign({}, item, {
                            expanded: false
                        });
                    }
                    item = Object.assign({}, item, {
                        load: item.expanded ? true : false
                    });
                    this.initItems.push(item);
                    if (item.children && item.expanded) {
                        this.initData(item.children, level + 1, item);
                    }
                });
                if(this.initItems.length==1){
                    this.toggle(0,this.initItems[0])
                }
            },
            //  隐藏显示
            show(item) {
                return (
                    item.level == 1 || (item.parent && item.parent.expanded && item.isShow)
                );
            },
            toggle(index, item) {
                let level = item.level + 1;
                let spaceHtml = "";
                for (var i = 1; i < level; i++) {
                    spaceHtml += "<i class='ms-tree-space'></i>";
                }
                if (item.children) {
                    if (item.expanded) {
                        item.expanded = !item.expanded;
                        this.close(index, item);
                    } else {
                        item.expanded = !item.expanded;
                        if (item.load) {
                            this.open(index, item);
                        } else {
                            item.load = true;
                            item.children.forEach((child, childIndex) => {
                                this.initItems.splice(index + childIndex + 1, 0, child);
                                //设置监听属性
                                this.$set(this.initItems[index + childIndex + 1], "parent", item);
                                this.$set(this.initItems[index + childIndex + 1], "level", level);
                                this.$set(
                                    this.initItems[index + childIndex + 1],
                                    "spaceHtml",
                                    spaceHtml
                                );
                                this.$set(this.initItems[index + childIndex + 1], "isShow", true);
                                this.$set(
                                    this.initItems[index + childIndex + 1],
                                    "expanded",
                                    false
                                );
                            });
                        }
                    }
                }
            },
            open(index, item) {
                if (item.children) {
                    item.children.forEach((child, childIndex) => {
                        child.isShow = true;
                        if (child.children && child.expanded) {
                            this.open(index + childIndex + 1, child);
                        }
                    });
                }
            },
            close(index, item) {
                if (item.children) {
                    item.children.forEach((child, childIndex) => {
                        child.isShow = false;
                        child.expanded = false;
                        if (child.children) {
                            this.close(index + childIndex + 1, child);
                        }
                    });
                }
            },
            // 数组去重
            getArray(a) {
                var hash = {},
                    len = a.length,
                    result = [];
                for (var i = 0; i < len; i++) {
                    if (!hash[a[i]]) {
                        hash[a[i]] = true;
                        result.push(a[i]);
                    }
                }
                return result;
            },

            // 返回树形数据长度
            Length(data) {
                let length = data.length;
                data.forEach(child => {
                    if (child.children) {
                        length += this.Length(child.children);
                    }
                });
                return length;
            },
            // 返回表头
            renderHeader(column, $index) {
                if ("renderHeader" in this.columns[$index]) {
                    return this.columns[$index].renderHeader(column, $index);
                } else {
                    return column.title || "#";
                }
            },
            // 返回内容
            renderBody(row, column, index) {
                return row[column.key];
            },

            // 深度拷贝函数
            deepCopy(data) {
                var t = this.type(data),
                    o,
                    i,
                    ni;
                if (t === "array") {
                    o = [];
                } else if (t === "object") {
                    o = {};
                } else {
                    return data;
                }
                if (t === "array") {
                    for (i = 0, ni = data.length; i < ni; i++) {
                        o.push(this.deepCopy(data[i]));
                    }
                    return o;
                } else if (t === "object") {
                    for (i in data) {
                        o[i] = this.deepCopy(data[i]);
                    }
                    return o;
                }
            },
            type(obj) {
                var toString = Object.prototype.toString;
                var map = {
                    "[object Boolean]": "boolean",
                    "[object Number]": "number",
                    "[object String]": "string",
                    "[object Function]": "function",
                    "[object Array]": "array",
                    "[object Date]": "date",
                    "[object RegExp]": "regExp",
                    "[object Undefined]": "undefined",
                    "[object Null]": "null",
                    "[object Object]": "object"
                };
                return map[toString.call(obj)];
            }
        },
        beforeDestroy() {
            window.onresize = null;
        }
    };
</script>
<style lang="scss">
  .tree-table {
    .tree-table-header,
    .tree-table-body li {
      @include flex();
    }

    .tree-table-body li .item {
      @include ellipsis();

      > div {
        @include ellipsis();
      }
    }

    .tree-table-body li .item,
    .tree-table-header li {
      @include box-flex();
      line-height: $td-lineheight;
      height: $td-height;
    }

    .tree-table-body li .item:first-of-type,
    .tree-table-header li:first-of-type {
      width: 20%;
      @include box-flex($num: 0);
    }

    .tree-table-header li:first-of-type {
      padding-left: 84px;
    }

    .tree-table-body li .item:first-of-type {
      padding-left: 16px;
    }

    .tree-table-body li .item:nth-last-child(2) {
      padding-right: 160px;
    }

    .tree-table-header li {
      height: $th-height;
      line-height: $th-lineheight;
      background: $background-color;
      color: $font-color1;
      font-weight: bold;
      text-transform: capitalize;

      & > div {
        background: $background-color;
      }
    }

    .tree-table-body li {
      position: relative;
      border-bottom: $border-style;
      @include shadow(
        $v-shadow: 1px,
        $blur: 0,
        $spread-color: rgba(242, 242, 242, 1)
      );

      &.child-tr {
        background: $background-color3;

        .item,
        .item *,
        .action {
          background: transparent;
        }
      }

      .action {
        position: absolute;
        right: 16px;
        @include v-center();
        visibility: hidden;
        opacity: 0;
        @include e-transition();
        height: $td-height;
        line-height: $td-lineheight;
      }

      &:hover {
        @include shadow($spread-color: rgba(0, 0, 0, 0.32));
        z-index: 1;

        .action {
          visibility: visible;
          opacity: 1;
        }
      }
      &:first-child:hover {
        .action {
          opacity: 0;
        }
      }
    }

    .ms-tree-space {
      position: relative;
      top: 1px;
      display: inline-block;
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      width: 10px;
      height: 10px;
      margin-left: 9px;

    }

    .ms-tree-space::before {
      content: "";
    }

    .iconicon_select {
      font-size: 20px;
      color: $font-color4;
      cursor: pointer;
      vertical-align: middle;
      display: inline-block;
      @include e-transformAll($rotate: rotate(-90deg));

    }

    .ios-arrow-down {
      display: inline-block;
      @include e-transformAll($rotate: rotate(0));
    }
  }
</style>
