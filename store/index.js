import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/util/http'
Vue.use(Vuex)

const userInfo = uni.getStorageSync('userInfo');
const state = {
	// 登录
	hasLogin: !!userInfo,
	userInfo,
	// 菜单
	nav: {
		list: [{
			iconPath: "home",
			selectedIconPath: "home-fill",
			text: "首页",
			count: 2,
			isDot: true,
			customIcon: false,
			pagePath: "/pages/index/index"
		},
		{
			iconPath: "file-text",
			selectedIconPath: "file-text-fill",
			text: "生产",
			customIcon: false,
			pagePath: "/pages/product/product"
		},
		{
			iconPath: "calendar",
			selectedIconPath: "calendar-fill",
			text: "设备",
			customIcon: false,
			pagePath: "/pages/device/device"
		},
		{
			iconPath: "play-right",
			selectedIconPath: "play-right-fill",
			text: "工艺",
			customIcon: false,
			pagePath: "/pages/retrospect/retrospect"
		},
		{
			iconPath: "account",
			selectedIconPath: "account-fill",
			text: "我的",
			count: 23,
			isDot: false,
			customIcon: false,
			pagePath: "/pages/my/my"
		},
		],
		activeColor: '#1890ff',
		// current: 0,
		isMid: false
	},
	// 车间
	workShopList: [],
	// 常用菜单
	usuallyMenu: uni.getStorageSync('usuallyMenu') || [{ icon: 'plus-circle', title: '添加',url:'/pages/index/addMenu' }]
}
const mutations = {
	login(state, provider) {
		const {
			token,
			userInfo
		} = provider

		state.hasLogin = true
		state.userInfo = userInfo

		uni.setStorage({
			key: 'userInfo',
			data: userInfo
		});
		uni.setStorage({
			key: 'userToken',
			data: token
		});
	},
	//退出登录
	logout(state) {
		state.hasLogin = false;
		state.userInfo = '';
		state.usuallyMenu = [{ icon: 'plus-circle', title: '添加' }];
		uni.clearStorageSync();
	},
	add_usuallyMenu(state, payload) {
		// state
		const { usuallyMenu } = state;
		const index = usuallyMenu.length-1;
		usuallyMenu.splice(index, 0, payload);

		uni.setStorage({
			key: 'usuallyMenu',
			data: usuallyMenu
		});
	},
	delete_usuallyMenu(i) {
		const { usuallyMenu } = state
		usuallyMenu.splice(i, 1);
		uni.setStorage({
			key: 'usuallyMenu',
			data: usuallyMenu
		});
	},
	set_state(state, payload) {
		if (payload && typeof (payload) === 'object') {
			for (const key in payload) {
				state[key] = payload[key]
			}
		}
	},
};

const actions = {
	async getWorkShop({ commit }) {
		const workShopList = await http.request({
			url: "/api/BWorkShop",
			method: "GET"
		});
		commit('set_state', { workShopList })
	}
}

const store = new Vuex.Store({
	state,
	mutations,
	actions
});
export default store;
