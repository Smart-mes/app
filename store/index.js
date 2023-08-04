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
			icon: "logout",
			title: "物料注销",
			url: "/pages/material/materialLogout",
		},
		{
			icon: "rego",
			title: "物料注册",
			url: "/pages/material/materialRego",
		},
		{
			icon: "bind",
			title: "物料绑定",
			url: "/pages/material/materialBind",
		},
		{
			icon: "receive",
			title: "接料",
			url: "/pages/material/materialCollect",
		},				
	],
	// 常用菜单
	dailyMenu: uni.getStorageSync('dailyMenu')||[] ,
	line:uni.getStorageSync('line')||[],
	stationCode:uni.getStorageSync('stationCode'),
	// 字典
	BLineDict:null,
	// 轮询
	timer:null,
	unreadCount:0,
}
const mutations = {
	login(state, parame) {
		const {token,userInfo} = parame
		state.hasLogin = true
		state.userInfo = userInfo
		uni.setStorage({key: 'userInfo',data: userInfo});
		uni.setStorage({key: 'userToken',data: token});	
	},
	//退出登录
	logout(state) {
		// const obj={hasLogin:false,unreadCount:0,userInfo:'',line:[],dailyMenu:[]}
		// for (let key in obj){	
		// 	state[key]=obj[key]
		// }
		Object.entries(state).forEach(([key,val])=>{
			if(key==='menuList') return;
			if(key==='timer') state.timer=null;

			if(typeof(val)==='object'){
				state[key]=!val? null:Array.isArray(val)?[]:{};
			}else if(typeof(val)==='number'){
        state[key]=0
			}else{
				state[key]=''
			}		
		});
		uni.clearStorageSync();
		// clearTimeout(state.timer)
	},
	clearTimeout(state){
		state.timer=null;
	},
	set_storage(state,parame){
		state[parame.key] = parame.data
		uni.setStorage(parame);
	},
	clear_storage(state,key){
		state[key]='';
		uni.removeStorage({key:key});
	},
	add_dailyMenu(state, parame) {
		state.dailyMenu.push(parame)
		uni.setStorage({key: 'dailyMenu',data: state.dailyMenu});
	},
	del_dailyMenu(i) {
		const { dailyMenu } = state
		dailyMenu.splice(i, 1);
		uni.setStorage({key: 'dailyMenu',data: dailyMenu});
	},
	set_state(state, parame) {
		if (parame && typeof (parame) === 'object') {
			for (const key in parame) {
				state[key] = parame[key]
			}
		}
	},
	set_line(state, parame){
		state.line=parame
		uni.setStorage({key:'line',data: parame});
	},
	set_unreadCount(state, parame){
		state.unreadCount=parame;
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
			data:{empCode:state.userInfo.empCode}
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
