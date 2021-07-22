<template>
	<view id="passRate">
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
		<view class="u-page" >
			<view class="search-box">
			<view>
			<u-form label-width="100" :model="form">
				<u-form-item label="车间">
				  <u-input v-model="form.ws" type="select" @click="wsShow=true" />
				</u-form-item>
				<u-form-item label="时间">
				<u-row>
				<u-col span="5">
					<u-input
					v-model="form.startDate"
					placeholder="输入开始时间"
					@click="handleTime"
					/>
				</u-col>
				<u-col span="2">至</u-col>
				<u-col span="5">
					<u-input
					v-model="form.endDate"
					placeholder="输入结束时间"
					@click="handleTime"
					/>
				</u-col>
				</u-row>
			</u-form-item>					
			</u-form>
			<view class="btn">
				<u-row gutter="20">
				<u-col span="6">
					<u-button size="medium" @click="clear">清空</u-button>
				</u-col>
				<u-col span="6">
					<u-button type="primary" size="medium" @click="search">查询</u-button>
				</u-col>
				</u-row>
			</view>
			</view>
			</view>
			<!-- 搜索 -->
			<view class="chart-box">
				<view class="chart-title">
					<u-section
						title="齐套分析图"
						font-size="30"
						:show-line="false"
						:right="false"
					/>
				</view>
			<view class="charts-bd">
				  <view class="charts-tip" :style="qiaoStyle" v-show="qiao.length">
					  <view class="tip-item" v-for="(qiaoItem,i) in qiao" :key="i">
						<view class="tip-col tip-name">{{qiaoItem.matCode}}</view>
						<view class="tip-col"><text class="tip-icon"/> {{  Math.round(qiaoItem.qty* 100) / 100}}</view>
						<view class="tip-col"><text class="tip-icon yellow"/>{{ Math.round(qiaoItem.needQty* 100) / 100}}</view>						
					 </view>
					</view>	
				<view 
					class="charts-bar"
					v-show="chartsData.categories.length"  
				>
					<qiun-data-charts
					type="bar"
					:opts="opts" 
					:chartData="chartsData"
					:reshow="!!chartsData.categories.length"
					@getIndex="showOptsTooltip"/>
				</view>
				<u-empty
				v-show="!chartsData.categories.length" 
				margin-top="30" 
				icon-size="100" 
				text="数据为空" 
				mode="data" />
            </view>
			</view>
            <!--饼图-->
		</view>
		<u-action-sheet :list="wsList" @click="wsSheetClick" @close="wsClose" v-model="wsShow"/>
		<!-- sheet -->
		<u-calendar
		v-model="timeVisible"
		mode="medium"
		max-date="2050-12-31"
		@change="timeChange"
		/>
	<!--calendar -->
	</view>
</template>

<script>
   import { mapState } from "vuex";
	export default {
		data() {
			return {
				navbar: {
					title: "齐套分析",
					isBack: true,
					color: "#333",
					size: "36",
					height: "50",
					background: {
					backgroundColor: "#ffffff",
					},
				},
				form:{
					ws:'1车间',
					startDate:'2019-4-5',
					endDate:'2021-7-14'
				},
				wsShow:false,		
				timeVisible:false,
				//bar
				chartsData: {categories: []},
				opts:{
					dataLabel:false,
					fontSize:12,
					xAxis:{max:70},
					extra:{bar:{type:'stack'},tooltip: {"showBox": false}},
					color:["#91cb74","#fac858"]
					},
				qiao:[],
				qiaoStyle:{}	
			}
		},
		computed: {
          ...mapState(["workShopList"]),
		  wsDict(){
			 const obj={}
			 this.workShopList.forEach(({wsName,wsCode}) =>obj[wsName]=wsCode);
			 return obj;  
		  },
		  wsList(){
			 return this.workShopList.map(({wsName:text,wsCode})=>{return {text,wsCode}})
		  }
        },
		methods: {
			wsSheetClick(i) {
				const {text,wsCode}=this.wsList[i];
				this.form.ws=text;
			},
			wsClose(){
				this.form.ws='';
				this.BLList=[];
			},
			clear() {  
				Object.keys(this.form).forEach((key) => {
					this.form[key] = "";
				});
				this.BLList=[];
			},
			handleTime(){
				uni.hideKeyboard();
				this.timeVisible = !this.timeVisible
			},
			timeChange(e) {
				const { startDate, endDate } = e;
				this.form.startDate = startDate;
				this.form.endDate = endDate;
			},
			search() {								
				const {	ws,startDate,endDate}=this.form;
				this.qiao=[];
				this.$http
						.request({
						url: "/api/ProduceReport/CSR",
						method: "GET",
						data:{
							wsCode:this.wsDict[ws],
							startDate:'',
							endDate:''
						}
						})
					 .then(data=>{	

						const dict={};
						const orderNoDict={};
						const chartsData={
							categories: [],
							series: [
								{name: "已备料",dict:{},data: [],color:null},
								{name: "缺料", dict:{},data: [],color:null}
							]};
												
						data.forEach(({orderNo,matCode,needQty,qty})=>{											
							let reduce=needQty-qty;
							reduce=reduce<0?0:reduce;
							// dict
							if(!dict[orderNo]){
								dict[orderNo]={qty:0,needQty:0}
								orderNoDict[orderNo]=[]
							}
							dict[orderNo].qty+=qty
							dict[orderNo].needQty+=reduce
							orderNoDict[orderNo].push({matCode,qty,needQty,reduce})
						});	
                        //排序
						for (let key in orderNoDict){
							orderNoDict[key].sort((a,b)=> a.reduce-a.reduce)
							orderNoDict[key].splice(5,orderNoDict[key].length)
							orderNoDict[key]=orderNoDict[key].map(({matCode,qty,needQty})=>{return {matCode,qty,needQty}})
						}
												
						for (const [key, value] of Object.entries(dict)) {
							let {qty,needQty}=value;
							if(needQty===0){
								qty=100
							}else if(qty===0){
								needQty=100
							}else{
								qty= parseInt(qty/(qty+needQty)*100);
								needQty=100-qty
							};
          
							chartsData.categories.push(key);
							chartsData.series[0].data.push(qty);												
							chartsData.series[1].data.push(needQty);
										  
			            }
						chartsData.series[0].dict=orderNoDict;	
						
						this.chartsData=chartsData;	
					})
			},
			showOptsTooltip(e){
			   const {currentIndex:{index},event:{x,y},opts:{categories,_series_:[{dict}]}}=e
			   this.qiao=!categories[index]?[]:dict[categories[index]];
			   this.qiaoStyle={left:x+'px',top:y+'px'};
			}
	    }
	}
</script>

<style lang="scss" scoped>
// #passRate{overflow: hidden;}
.chart-box{overflow: initial;}
.charts-bar,.charts-bd{
	position: relative;
	margin-top: 20rpx;
	width: 730rpx;
	height: 600rpx;
	background:$white-color;
}
.charts-tip{
	z-index: 99; 
	position: absolute;
	padding: 10rpx; 
	font-size: 24rpx;
	background-color:#000;
	opacity: 0.7;	
	color: #fff;
	.tip-item{
		display: flex;
		white-space: nowrap;
		line-height: 35rpx;
	}
	.tip-col{width:85rpx;}
	.tip-name{width: 160rpx;}
	.tip-icon{
		display: inline-block;
		margin: 5rpx 8rpx;
		width: 10rpx;
		height: 10rpx;
		background:#91cb74;	
		 }
	 .yellow{background: #fac858;}	 
	}
.charts-bar{margin-top: 0;}
</style>
