<template>
	<view id="qualityTest">
    <u-navbar
      :title="navbar.title"
      :is-back="navbar.isBack"
      :title-color="navbar.color"
      :title-size="navbar.size"
      :height="navbar.height"
      :background="navbar.background"
      title-bold
    />
		<!-- nav -->	
		<view class="ad"  @tap="link"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbar: {
					title: "抽检",
					isBack: true,
					color: "#333",
					size: "36",
					height: "50",
					background: {
					backgroundColor: "#ffffff",
					},
				},				
			}
		},
		methods: {
			link() {
			uni.navigateTo({
				url: '/pages/qualityTest/qualityTestDetail',
			});
			}			
		}
	}
</script>

<style lang="scss" scoped>
.ad{
	margin-top: 15rpx;
	width: 750rpx;height: 955rpx;
	background:url(../../static/images/quality.jpg);
	background-size:cover;
	
}
</style>
