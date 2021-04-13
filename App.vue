<script>
	import {
		mapState,
		mapActions
	} from "vuex";
	export default {
		onLaunch: function() {
			this.cid();
			this.init();
		},
		onShow: function() {},
		onHide: function() {},
		computed: {
			...mapState(["hasLogin", "userInfo"]),
		},
		methods: {
			...mapActions(["getWorkShop"]),
			init() {
				// 锁定竖屏
				// #ifdef APP-PLUS  
				plus.screen.lockOrientation("portrait-primary");
				// #endif
				if (this.hasLogin) {
					this.getWorkShop();
					// #ifdef APP-PLUS 
					uni.reLaunch({
						url: "pages/index/index"
					});
					// #endif
				}
			},
			cid() {
				// #ifdef APP-PLUS
				console.log('执行手机编译的内容')
				var pinf = plus.push.getClientInfo();
				console.log(pinf)
				var cid = pinf.clientid; //客户端标识
				console.log('cid：' + cid);

				plus.push.addEventListener('click', function(msg) {
					console.log('click:', msg);
				}, false);
				plus.push.addEventListener('receive', function(msg) {
					plus.runtime.setBadgeNumber(8);
					console.log('receive:', msg);
					plus.push.createMessage('receive', msg);
				}, false);
				// #endif
			}
			// //#ifdef H5
			// skipH5() {
			// 	if (!this.hasLogin) {
			// 		uni.reLaunch({
			// 			url: '/'
			// 		})
			// 	} else {
			// 		if (window.location.hash === '#/') {
			// 			uni.reLaunch({
			// 				url: '/pages/index/index'
			// 			})
			// 		}
			// 	}
			// }
			// //#endif
		}
	};
</script>

<style lang="scss">
	@import "static/style/iconfont.css";
	@import "static/style/style.scss";
	@import "uview-ui/index.scss";
	@import url("components/ly-tree/ly-tree.css");
</style>
