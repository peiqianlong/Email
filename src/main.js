// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import request from './utils/axios.js';
import store from './store/store.js';
import i18n from './tools/i18n';
import "babel-polyfill"
import Es6Promise from 'es6-promise'
import 'iview/dist/styles/iview.css';
import './assets/style/index.scss';

import {
  Input,
  Content,
  Select,
  Option,
  Table,
  Tree,
  Upload,
  Modal,
  Message,
  Form,
  FormItem,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Divider,
  Collapse,
  Panel,
  Tabs,
  TabPane,
  Icon,
  DatePicker
} from 'iview';
import IconPoptip from './components/IconPoptip.vue';
import EMPage from './components/EMPage.vue'

Es6Promise.polyfill();
Vue.config.productionTip = false;
Vue.prototype.$request = request;
import "./utils/router"
// require('./mock/mock.js');
//通用组件全局注册
Vue.component('Input', Input);
Vue.component('Content', Content);
Vue.component('DatePicker', DatePicker);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('Table', Table);
Vue.component('Tree', Tree);
Vue.component('Upload', Upload);
Vue.component('Modal', Modal);
Vue.component('Message', Message);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);
Vue.component('CheckboxGroup', CheckboxGroup);
Vue.component('Checkbox', Checkbox);
Vue.component('Divider', Divider);
Vue.component('Checkbox', Checkbox);
Vue.component('Divider', Divider);
Vue.component('Collapse', Collapse);
Vue.component('Panel', Panel);
Vue.component('Tabs', Tabs);
Vue.component('TabPane', TabPane);
Vue.component('IconPoptip', IconPoptip);
Vue.component('EMPage', EMPage);
Vue.component('Icon', Icon);
Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;
/* eslint-disable no-new */
//表格导出导入
import Blob from "./utils/Blob"
import Export2Excel from "./utils/Export2Excel"

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  i18n, //挂载i18n
  store,
});
