import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/util/http'
Vue.use(Vuex)

const userInfo = uni.getStorageSync('userInfo');
const state = {
	// 登录
	hasLogin: !!userInfo,
	userInfo,
	menuList: [
		{   
			icon: "produce",
			title: "生产详情",
			url: "/pages/product/product",
		},
		{
			icon: "devices",
			title: "设备管理",
			url: "/pages/device/device",
		},
		{
			icon: "analyse",
			title: "效率分析",
			url: "/pages/analyse/analyse",
		},
		{
			icon: "review",
			title: "工艺追溯",
			url: "/pages/retrospect/retrospect",
		},
		{
			icon: "fault",
			title: "设备报障",
			url: "/pages/device/failure",
		},
		{
			icon: "meter",
			title: "效率管理",
			url: "/pages/effect/effect",
		},
		{
			icon: "quality",
			title: "质量管理",
			url: "/pages/quality/quality",
		},
		{
			icon: "scan",
			title: "扫码查询",
			url: "/pages/scanCode/scanCode",
		},
		{
			icon: "info",
			title: "我的消息",
			url: "/pages/info/info",
		},
		{
			icon: "pass",
			title: "直通率",
			url: "/pages/passRate/passRate",
		},
		 {
		 	icon: "pass",
		 	title: "CPH",
		 	url: "/pages/CPH/CPH",
		 } 
	],
	// 菜单navTab
	navTab: {
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
		iconSize: 40,
		activeColor: '#1890ff',
		inactiveolor: '#666',
		// current: 0,
		isMid: false
	},
	// 车间
	workShopList: [],
	// 常用菜单
	usuallyMenu: uni.getStorageSync('usuallyMenu') || [{ icon: 'line-add', title: '添加', url: '/pages/index/addMenu' }]
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
		state.usuallyMenu = [{ icon: 'line-add', title: '添加', url: '/pages/index/addMenu' }];
		uni.clearStorageSync();
	},
	add_usuallyMenu(state, payload) {
		// state
		const { usuallyMenu } = state;
		const index = usuallyMenu.length - 1;
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
