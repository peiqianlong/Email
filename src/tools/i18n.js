import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ViewUI from 'view-design';

Vue.use(VueI18n);
/*import en from 'view-design/dist/locale/en-US';
import zh from 'view-design/dist/locale/zh-CN';

Vue.use(VueI18n);
Vue.use(ViewUI);
Vue.locale = () => {
};
const messages = {
  'zh_CN': Object.assign(require('@/assets/lang/zh'), zh), //中文语言包
  'en_US': Object.assign(require('@/assets/lang/en'), en) //英文语言包
}
*/

const messages = {
  'zh_CN': require('@/assets/lang/zh'), //中文语言包
  'en_US': require('@/assets/lang/en') //英文语言包
}
export default new VueI18n({
  locale: 'en_US', //默认显示中文
  messages
})
