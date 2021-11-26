<template>
	<view id="asset">
		<u-navbar
		:title="navbar.title"
		:is-back="navbar.isBack"
		:title-color="navbar.color"
		:title-size="navbar.size"
		:height="navbar.height"
		:background="navbar.background"
		title-bold
		/>
		<!-- /nav -->
		<view class="asset-search">
		   <view class="search">
				 <u-search 
				 placeholder="请输入序列号" 
				 bg-color="#ffffff" 
				 height="60" 
				 v-model="searchVal"
				 :show-action="false"
				 />
			 </view>
			 <view class="scan" @click="scan()">扫码</view>
		</view>
		<!-- search -->
		<view class="asset-list" v-show="filterList.length">
			<view class="asset-item"  v-for="(asset,i) in filterList" :key="i" @tap="link(asset.device)">
				<view class="asset-img">
					<image class="img" src="@/static/images/asset/asset.jpg" mode="aspectFit"></image>
				</view>
				<!-- img -->
				<view class="asset-info">
						<view class="info-item">
							 <text class="info-name">设备：</text>
							 <text>{{asset.device}}</text>
						</view>
					  <view class="info-item">
							 <text class="info-name">型号：</text>
							 <text>{{asset.type}}</text>
						</view>
						<view class="info-item">	 
							 <text class="info-name">序列号：</text>
							 <text class="info-text">{{asset.serial}}</text>
						</view>
						<view class="info-item">		 
							 <text class="info-name">说明：</text>
							 <text class="info-text">{{asset.explain}}</text>
						</view>
						<view class="info-item">	 
							 <text class="info-name">位置：</text>
							 <text class="info-text">{{asset.place}}</text>
						</view>	 		
				</view>
				<!-- info -->
			</view>
		</view>
		<view class="none" v-show="!filterList.length">暂无数据</view>
	</view>		
</template>

<script>
	export default {
		data() {
			return {
				name:'Asset',
				navbar: {
					title: "资产管理",
					isBack: true,
					color: "#333",
					size: "36",
					height: "50",
					background: {
					backgroundColor: "#ffffff",
					},
			 },
				assetList:[
					{
					  device:'HEDRICH01',	
						type:'HEDRICH',
						serial:'D001',
						explain:'高压浇注1号机',
						place:''
					},
					{
						device:'HEDRICH02',	
						type:'HEDRICH',
						serial:'D002',
						explain:'高压浇注2号机',
						place:''
					},
					{
						device:'HEDRICH03',	
						type:'HEDRICH',
						serial:'D003',
						explain:'高压浇注3号机',
						place:''
					}
				],
				searchVal: '',
				}
		},
		computed: {
			filterList(){
				if(!this.searchVal){return this.assetList;}
				return this.assetList.filter(asset=>asset.serial.search(this.searchVal)!==-1 )
			}
			
		},
		methods: {
			scan() {		
				//#ifdef H5
				this.searchVal="D001"
				//#endif
				// #ifdef APP-PLUS
				uni.scanCode({
					success: (res) => {
						this.searchVal="D001"
					},
					fail: () => {},
				});
				// #endif	
			},
			link(device) {
				uni.navigateTo({
					url: `/pages/asset/assetDetails?device=${device}`,
				});
    }
		}
	}
</script>

<style lang="scss" scoped>
.asset-search{
	 display: flex;
	 text-decoration: row;
   align-items:center;
	 margin: 20rpx 15rpx;
	.search{
		width: 610rpx;		 
	}
	.scan{padding-left: 20rpx;text-align: right;}
	
}
.asset-list{
   .asset-item{
		 display: flex;
		 flex-direction: row;
		 margin:20rpx 15rpx;
		 padding: 25rpx;
		 background: $white-color;
		 .asset-img{overflow: hidden;border: 1px solid #ddd;}
		 .asset-img{width:300rpx;height: 250rpx;}
		 .asset-img .img{width:300rpx;height: 250rpx;}
		 .asset-info{ padding:10rpx 20rpx;}
		 .info-item{
			 display: flex;flex-direction: row;padding: 3rpx 0;
			 .info-name{width: 120rpx;color: $font-gray;}
			}
	 }
}
.none{padding: 15px;text-align: center;}
</style>
