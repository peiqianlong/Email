import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
const messages = {
    'zh_CN':require('@/assets/lang/zh'), //中文语言包
    'en_US':require('@/assets/lang/en') //英文语言包
}
export default new VueI18n({
    locale:'en_US', //默认显示中文
    messages
})