import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/util/http'
Vue.use(Vuex)

const userInfo = uni.getStorageSync('userInfo');
const farm= uni.getStorageSync('farm')||[];
const state = {
	// 登录
	hasLogin: !!userInfo,
	userInfo,
	menuList: [
		// {   
		// 	icon: "produce",
		// 	title: "生产详情",
		// 	url: "/pages/product/product",
		// },
		// {
		// 	icon: "devices",
		// 	title: "设备管理",
		// 	url: "/pages/device/device",
		// },
		// {
		// 	icon: "review",
		// 	title: "工艺追溯",
		// 	url: "/pages/retrospect/retrospect",
		// },
		{
			icon: "analyse",
			title: "效率分析",
			url: "/pages/analyse/analyse",
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
			icon: "through",
			title: "直通率",
			url: "/pages/passRate/passRate",
		},
		 {
			icon: "product",
		 	title: "小时产量",
		 	url: "/pages/UPH/UPH",
		 },
		  {
		  	icon: "pass",
		  	title: "计划达成",
		  	url: "/pages/PAR/PAR",
		  },
		  {
			  icon: "qitao",
			  title: "齐套分析",
			  url:"/pages/qitao/qitao"
		  },
		{
			icon: "qualityTest",
			title: "抽检",
			// url:'/pages/andon/addAndon'
			url: "/pages/qualityTest/qualityTest"
		},
		{
			icon: "qualityTest",
			title: "首检",
			url: "/pages/firstCheck/firstCheck"
		},
		{
			icon: "qualityTest",
			title: "安灯管理",
			url: "/pages/andon/andon"
		},
		// {
		// 	icon: "qualityTest",
		// 	title: "添加安灯",
		// 	url: "/pages/andon/addAndon"
		// }
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
	usuallyMenu: uni.getStorageSync('usuallyMenu') || [{ icon: 'line-add', title: '添加', url: '/pages/index/addMenu' }],
  farmList:[],
	farm:farm,
	// 字典
	BLineDict:null,
}
const mutations = {
	login(state, provider) {
		const {token,userInfo} = provider
		state.hasLogin = true
		state.userInfo = userInfo
		uni.setStorage({key: 'userInfo',data: userInfo});
		uni.setStorage({key: 'userToken',data: token});
	},
	//退出登录
	logout(state) {
		state.hasLogin = false;
		state.userInfo = '';
		state.farm=[];
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
	}
	,set_farm(state, payload){
		state.farm=payload
		uni.setStorage({key: 'farm',data: payload});
	}
};

const actions = {
	async getWorkShop({ commit }) {
		const workShopList = await http.request({url: "/api/BWorkShop",method: "GET"});
		commit('set_state', { workShopList })
	},
	async getFarm({ commit }){
		const farmList = await http.request({url: "/api/BLine/CascadeOption",method: "GET"});

		commit('set_state', { farmList });
		if(farm.length===0){
			const {label,value,children}=farmList[0]			
			commit('set_state',{farm:[{label,value},{...children[0]}]})
		}		
	},
	async getDict({ commit },payload){
		return await http.request({url:payload.url,method: "GET", data: payload.parame});
		// commit('set_state',{BLineDict:{BLine}})
	}
}

const store = new Vuex.Store({
	state,
	mutations,
	actions
});
export default store;
