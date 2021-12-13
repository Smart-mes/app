import Vue from 'vue';
import App from './App';
import store from 'store/index';
import http from '@/util/http';
// 自定义
import popup from "@/components/popup.vue";
import navBar from "@/components/navBar.vue";
import customForm from "@/components/form.vue";

Vue.config.productionTip = false;
Object.defineProperty(Vue.prototype, '$http', { value: http });
Vue.component('popup', popup);
Vue.component('navBar', navBar);
Vue.component('customForm', customForm);

// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);
App.mpType = 'app';

const app = new Vue({
	store,
    ...App	
});
app.$mount();
