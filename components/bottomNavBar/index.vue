<template>
   <u-tabbar v-model="current" :list="list" height="100rpx" active-color='#1890ff'></u-tabbar>
</template>
<script>
export default {
  name: "bottomNavBar",
  props: {
    active:{
      type:Number,
      default:0
    }
  },
  data() {
    return{
      list: [
        {
            iconPath: "/static/images/tabbar/home.png",
						selectedIconPath: "/static/images/tabbar/home-active.png",
            pagePath: "/pages/index/index",
						text: '首页',
						isDot: true,
						customIcon: false,
					},
					{
						iconPath: "/static/images/tabbar/pro.png",
						selectedIconPath: "/static/images/tabbar/pro-active.png",
            pagePath: "/pages/product/product",
						text: '生产',
						customIcon: false,
					},
					// {
					// 	iconPath: "/static/images/tabbar/device.png",
					// 	selectedIconPath: "/static/images/tabbar/device-active.png",
          //   pagePath: "/pages/device/device",
					// 	text: '设备',
					// 	midButton: true,
					// 	customIcon: false,
					// },
					// {
					// 	iconPath: "/static/images/tabbar/retrace.png",
					// 	selectedIconPath: "/static/images/tabbar/retrace-active.png",
          //   pagePath: "/pages/retrospect/retrospect",
					// 	text: '工艺',
					// 	customIcon: false,
					// },
					{
						iconPath: "/static/images/tabbar/user.png",
						selectedIconPath: "/static/images/tabbar/user-active.png",
            pagePath: "/pages/my/my",
						text: '我的',
						customIcon: false,
					},
				],
				current: 0 
    }
  },
  mounted () {
    this.current=this.active
  }
}
</script>