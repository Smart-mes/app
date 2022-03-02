<script>
	import {mapState} from "vuex";
	export default {
		onLaunch: function() {
			this.init();
		},
		onShow: function() {},
		onHide: function() {},
		computed: {
			...mapState(["hasLogin", "userInfo"]),
		},
		methods: {
			init() {
				// 锁定竖屏
				// #ifdef APP-PLUS  
				plus.screen.lockOrientation("portrait-primary");
			   // #endif
				if (this.hasLogin) {
					uni.reLaunch({url: "/pages/index/index"});				
				}else{
					uni.reLaunch({url: "pages/login/login"});
				}		
			}
		}
	};
</script>

<style lang="scss">
	@import "static/style/font/iconfont.css";
	@import "static/style/style.scss";
	@import "uview-ui/index.scss";
	@import "components/ly-tree/ly-tree.css";
</style>
