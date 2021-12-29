import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/util/http'
Vue.use(Vuex)

const userInfo = uni.getStorageSync('userInfo');
// const unreadCount=uni.getStorageSync('unreadCount')||0;
const state = {
	// 登录
	hasLogin: !!userInfo,
	userInfo,

	// 菜单navTab
	navTab: {
		list: [
		{
			iconPath: "home",
			selectedIconPath: "home-fill",
			text: "首页",
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
			count:0,
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
	menuList: [
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
			url: "/pages/qitao/qitao",
		},
		{
			icon: "qualityTest",
			title: "抽检",
			url: "/pages/spotCheck/spotCheck",
		},
		{
			icon: "qualityTest",
			title: "首检",
			url: "/pages/firstCheck/firstCheck",
		},
		{
			icon: "andon",
			title: "安灯管理",
			url: "/pages/andon/andon",
		},
		{
			icon: "maintain",
			title: "设备保养",
			url: "/pages/TPM/TPM",
		},
		{
			icon: "equip",
			title: "设备工装",
			url: "/pages/equip/equip",
		},
	],
	// 常用菜单
	usuallyMenu: uni.getStorageSync('usuallyMenu')||[] ,
	line:uni.getStorageSync('line')||[],
	// 字典
	BLineDict:null,
	// 轮询
	timer:null,
	unreadCount:0,
}
const mutations = {
	login(state, payload) {
		const {token,userInfo} = payload
		state.hasLogin = true
		state.userInfo = userInfo
		uni.setStorage({key: 'userInfo',data: userInfo});
		uni.setStorage({key: 'userToken',data: token});	
	},
	//退出登录
	logout(state) {
		state.hasLogin = false;
		state.userInfo = '';
		state.line=[];
		state.usuallyMenu = [];
		state.unreadCount=0;
		uni.clearStorageSync();
		clearTimeout(state.timer)
	},
	add_usuallyMenu(state, payload) {
		// state
		const { usuallyMenu } = state;
		const index = usuallyMenu.length - 1;
		usuallyMenu.splice(index, 0, payload);
		uni.setStorage({key: 'usuallyMenu',data: usuallyMenu});
	},
	delete_usuallyMenu(i) {
		const { usuallyMenu } = state
		usuallyMenu.splice(i, 1);
		uni.setStorage({key: 'usuallyMenu',data: usuallyMenu});
	},
	set_state(state, payload) {
		if (payload && typeof (payload) === 'object') {
			for (const key in payload) {
				state[key] = payload[key]
			}
		}
	},
	set_line(state, payload){
		state.line=payload
		uni.setStorage({key:'line',data: payload});
	},
	set_unreadCount(state, payload){
		state.unreadCount=payload;
		state.navTab.list[4].count=payload;
	}
};

const actions = {
	unreadPoll({commit,state}){
		// unreadAjax();
		state.timer=setTimeout(()=>{
			actions.getUnread({commit,state})
			.then(()=>actions.unreadPoll({commit,state}));
		},60000);
	},
	getUnread({ commit,state}){
	 return	http.request({
			url:"/api/SNotify/UnreadCount",
			method: "GET", 
			data:{
				empCode:state.userInfo.empCode
			}
		})
		.then(res=>{
			commit('set_unreadCount',res);
		});
	},
	async getLine({ commit,state }){
		const lineList = await http.request({url: "/api/BLine/CascadeOption",method: "GET"});
		if(!state.line.length){
			const {label,value,children}=lineList[0];			
			commit('set_line',[{label,value},{...children[0]}]);
		}
		return lineList;				
	},
	async getDict({ commit },payload){
		return await http.request({url:payload.url,method: "GET", data: payload.data});
	}
}

const store = new Vuex.Store({
	state,
	mutations,
	actions
});
export default store;
