<template>
	<view>
		<u-navbar title="添加常用" :is-back="navbar.isBack" :background="navbar.background" />
		<!-- nav -->
		<view class="menu">
			<view class="menu-title">
				<u-section 
				title="常用" 
				font-size="30"
				:show-line="false" 
				:right="false" />
			</view>
			<u-grid :col="4">
				<u-grid-item v-for="(item,i) in len" :key="i">
					<view class="menu-icon" @tap="deleteMenu(i)">
						<!-- <u-icon slot="icon" name="close" custom-prefix="custom-icon" size="28" color="#999" /> -->
						<text class="custom-icon custom-icon-close" />
					</view>
					<u-icon :name="usuallyMenu[i].icon" color="#3ba7f6" size="50" />
					<view class="grid-text">{{usuallyMenu[i].title}}</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 常用菜单 -->
		<!-- <u-gap height="20" /> -->
		<view class="menu">
			<view class="menu-title">
				<u-section 
				title="全部" 
				font-size="30"
				:show-line="false" 
				:right="false"  />
			</view>
			<u-grid :col="4">
				<u-grid-item v-for="(menuItem,i) in menuList" :key="i">
					<view class="menu-icon" @tap="addMenu(menuItem)">
						<!-- <u-icon slot="icon" name="add" custom-prefix="custom-icon" size="28" color="#1699f8" /> -->
						<text class="custom-icon custom-icon-add" />
					</view>
					<u-icon :name="menuItem.icon" color="#3ba7f6" size="50" />
					<view class="grid-text">{{menuItem.title}}</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 新增菜单 -->
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		name: "addMenu",
		data() {
			return {
				navbar: {
					background: {
						backgroundColor: "#fff",
					},
					isBack: true,
				},
				//   菜单
				menuList: [{
						icon: "file-text-fill",
						title: "生产详情",
						url: "/pages/product/product",
					},
					{
						icon: "calendar-fill",
						title: "设备管理",
						url: "/pages/device/device",
					},
					{
						icon: "coupon-fill",
						title: "效率分析",
						url: "/pages/analyse/analyse",
					},
					{
						icon: "play-right-fill",
						title: "工艺追溯",
						url: "/pages/retrospect/retrospect",
					},
					{
						icon: "info-circle-fill",
						title: "设备报障",
						url: "/pages/device/failure",
					},
					{
						icon: "hourglass-half-fill",
						title: "效率管理",
						url: "/pages/effect/effect",
					},
					{
						icon: "integral-fill",
						title: "质量管理",
						url: "/pages/quality/quality",
					},
					{
						icon: "scan",
						title: "相关查询",
						url: "/pages/search/search",
					},
					{
						icon: "chat-fill",
						title: "我的消息",
						url: "/pages/info/info",
					}
				],
			};
		},
		computed: {
			...mapState(["usuallyMenu"]),
			len() {
				return this.usuallyMenu.length ?
					this.usuallyMenu.length - 1 :
					this.usuallyMenu.length;
			},
		},
		methods: {
			...mapMutations(["add_usuallyMenu", "delete_usuallyMenu"]),
			addMenu(item) {
				const isHas = this.check(item);
				if (isHas) {
					this.$refs.uToast.show({
						title: "不可以重复添加",
						type: "error",
					});
				}

				if (this.len === 7) {
					this.$refs.uToast.show({
						title: "添加不能超过7个",
						type: "error",
					});
					return false;
				}!isHas && this.add_usuallyMenu(item);
			},
			deleteMenu(i) {
				this.delete_usuallyMenu(i);
			},
			check(el) {
				const validator = this.usuallyMenu.some((item) => {
					return item.title === el.title;
				});
				return validator;
			},
		},
	};
</script>
<style lang="scss" scoped>
	.menu {	
		margin:20rpx 15rpx 0 15rpx ;
		padding: 25rpx 0;
		border-radius: 10rpx;
		background-color: $white-color;
		.menu-title {
			padding: 0 25rpx 20rpx 25rpx;
		}
		.menu-icon {
			position: absolute;
			top: 10rpx;
			right: 15rpx;

			.custom-icon {
				font-size: 28rpx;
			}

			.custom-icon-close {
				color: #999;
			}

			.custom-icon-add {
				color: #1699f8;
			}
		}

		/deep/ .u-grid-item-box {
			padding: 50rpx 0;
		}
	}
	.grid-text {
		margin-top: 10rpx;
		color: #444;
	}
</style>
