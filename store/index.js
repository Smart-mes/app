import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/api/http'
Vue.use(Vuex)

const userInfo = uni.getStorageSync('userInfo');
const state = {
	// 登录
	hasLogin: !!userInfo,
	userInfo,
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
	dailyMenu: uni.getStorageSync('dailyMenu')||[] ,
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
		const obj={hasLogin:false,unreadCount:0,userInfo:'',line:[],dailyMenu:[]}
		for (let key in obj){	
			state[key]=obj[key]
		}
		uni.clearStorageSync();
		clearTimeout(state.timer)
	},
	add_dailyMenu(state, payload) {
		state.dailyMenu.push(payload)
		uni.setStorage({key: 'dailyMenu',data: state.dailyMenu});
	},
	del_dailyMenu(i) {
		const { dailyMenu } = state
		dailyMenu.splice(i, 1);
		uni.setStorage({key: 'dailyMenu',data: dailyMenu});
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
	},
	minus_unreadCount(state){
		state.unreadCount--;
	}
};
const actions = {
	unreadPoll({commit,state}){
		state.timer=setTimeout(()=>{
			actions.getUnread({commit,state})
			.then(()=>actions.unreadPoll({commit,state}));
		},60000);
	},
	getUnread({commit,state}){
	 return	http.request({
			url:"/api/SNotify/UnreadCount",
			method: "GET", 
			data:{
				empCode:state.userInfo.empCode
			}
		})
		.then(res=>commit('set_unreadCount',res));
	},
	async getLine({ commit,state }){
		const lineList = await http.request({url: "/api/BLine/CascadeOption",method: "GET"});
		if(!state.line.length){
			const {label,value,children}=lineList[0];			
			commit('set_line',[{label,value},{...children[0]}]);
		}
		return lineList;				
	},
}
const store = new Vuex.Store({
	state,
	mutations,
	actions
});
export default store;
