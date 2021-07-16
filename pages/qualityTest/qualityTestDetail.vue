<template>
	<view id="qualityTestDetail">
    <u-navbar
      :title="navbar.title"
      :height="navbar.height"
      :is-back="navbar.isBack"
      :background="navbar.background"
    />
		<!-- nav -->	
		<view class="ad"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbar: {
					title:'质检详情',
					height:50,
					background: {
					backgroundColor: "#ffffff",
					},
					isBack: true,
				}			
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.ad{
	margin-top: 15rpx;
	width: 750rpx;height: 900rpx;
	background:url(../../static/images/quality2.jpg);
	background-size:cover;
	
}
</style>
