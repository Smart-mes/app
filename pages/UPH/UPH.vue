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
				<u-form-item label="产线">
				  <u-input v-model="form.line" type="select" @click="BLShow=true"/>
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
						title="每小时产量图"
						font-size="30"
						:show-line="false"
						:right="false"
					/>
				</view>
             <view class="charts-bd">
				<view class="charts-line" v-show="chartData.series[0]!==null">
				<qiun-data-charts 		 
					type="line" 
					:echartsH5="true" 
					:echartsApp="true" 
					:eopts="eopts" 
					:chartData="chartData"
					:reshow="chartData.series[0]!==null"	
					/>
				</view>
				<u-empty 
				v-show="chartData.series[0]===null"  
				margin-top="30" 
				icon-size="100" 
				text="数据为空" 
				mode="data" />
           </view> 
			</view>
            <!--饼图-->
		</view>
		<u-action-sheet :list="wsList" @click="wsSheetClick" @close="wsClose" v-model="wsShow"/>
		<u-action-sheet :list="BLList" @click="BLSheetClick" @close="BLClose" v-model="BLShow"/>
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
   import moment from 'moment';
	export default {
		data() {
			return {
				navbar: {
					title: "每小时产量",
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
					line:'',
					startDate:'2019-4-5',
					endDate:'2021-7-14'
				},
				BLList:[],
				wsShow:false,
				BLShow:false,
				timeVisible:false,
				//pie
				chartData:{series:[null]},
				eopts:{						
					notMerge:true,
					grid: {top:10,left:40,right: 30,bottom:60},					
					xAxis: {type:'time'},
				},
				// 工序
				procedureList:[]
			}
		},
		computed: {
          ...mapState(["workShopList"]),
		  wsDict(){
			 const obj={}
			 this.workShopList.forEach(({wsName,wsCode}) =>obj[wsName]=wsCode);
			 return obj;  
		  },
		  BLDict(){
			  const obj={}
			  this.BLList.forEach(({text,lineCode}) =>obj[text]=lineCode);
			  return obj;
		  },
		  wsList(){
			 return this.workShopList.map(({wsName:text,wsCode})=>{return {text,wsCode}})
		  },
		  procedureDict(){
			  let obj ={}
			  this.procedureList.forEach(({processCode,processName})=>obj[processCode]=processName);
			  return obj;
		  }
        },
		methods: {
			wsSheetClick(i) {
				const {text,wsCode}=this.wsList[i];
				this.form.ws=text;
				this.form.line='';
				this.BLFetch(wsCode);

			},
			BLSheetClick(i){
				this.form.line=this.BLList[i].text
			},
			wsClose(){
				this.form.ws='';
				this.form.line='';
				this.BLList=[];
			},
			BLClose(){
				this.form.line='';
			},
			BLFetch(wsCode){
				this.$http
					.request({
						url: "/api/BLine",
						method: "GET",
						data: {wsCode},
					})
					.then((data) =>
					this.BLList=data.map(({lineName:text,lineCode})=>{return {text,lineCode}})
					)
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
				const {	ws,line,startDate,endDate}=this.form
				this.$http
						.request({
						url: "/api/ProduceReport/UPH",
						method: "GET",
						data:{
							wsCode:this.wsDict[ws],
							lineCode:this.BLDict[line],
							processCode:'',
							startDate:'',
							endDate:''
						},
						errorMessage:'暂无数据'
						})
					 .then(data=>{					 
						 if(!data.length){
							 this.chartData.series=[null];
							  return false;
						 }

						 const dict={};
						 const resList=[];
						data= data.map(item => {
                              item.date = new Date(item.date)
							  item.name=this.procedureDict[item.processCode]
							  item.time=+item.date;
                              return item;
                          }).sort((a,b)=>a.date-b.date)
 
                        const maxTime=Math.max(...data.map(x => x.date));
						const maxDate=new Date(maxTime);
						const preDate=new Date(maxTime-1000*60*60*24);
										
						data.filter(({date})=>preDate<=date&&date<=maxDate)
						.forEach(({name,time,qty}) => {	
													
							 if(!dict[name]){dict[name]=[]};
							 dict[name].push([time,qty])
							
						});
					
					   for (const [key, value] of Object.entries(dict)) {						   
						   resList.push({type: 'line',name:key,data:value})
						}
						
						this.chartData.series=resList;
					 })
					
	        },
			procedureFetch() {
				this.$http.request({
					url: "/api/BProcessList",
					method: "GET",
				})
				.then((data)=>{
				this.procedureList =data
				})
			}
	    },
	   onLoad(){
			this.procedureFetch()		
		}
	}
</script>

<style lang="scss" scoped>
#passRate{overflow: hidden;}
.charts-line,.charts-bd{
	margin-top: 20rpx;
	width: 730rpx;
	height: 550rpx;
	background:$white-color;
}
.charts-line{margin-top: 0;}

</style>
