import Vue from 'vue';
import App from './App';
import store from 'store/index';
import http from '@/api/http';
import mixin from '@/utils/mixin'
// 自定义
import popup from "@/components/popup/popup.vue";
import navBar from "@/components/navBar/navBar.vue";
import customForm from "@/components/form/form.vue";
import bottomNavBar from "@/components/bottomNavBar/index.vue";
import title from "@/components/title/title.vue";

Vue.config.productionTip = false;
Vue.mixin(mixin);
Object.defineProperty(Vue.prototype, '$http', { value: http });
Vue.component('popup', popup);
Vue.component('exTnavBar', navBar);
Vue.component('customForm', customForm);
Vue.component('exBNavBar', bottomNavBar);
Vue.component('exTitle', title);

// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);
App.mpType = 'app';

const app = new Vue({
	store,
    ...App	
});
app.$mount();
