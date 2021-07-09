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
						title="每小时产量线图"
						font-size="30"
						:show-line="false"
						:right="false"
					/>
				</view>
			<view class="charts-pie">
			<view class="charts-box">
			<qiun-data-charts
				type="tline"
				:ontouch="true"
				:chartData="chartData"
				background="none"
			/>
			</view>
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
					ws:'',
					line:'',
					startDate:'',
					endDate:''
				},
				BLList:[],
				wsShow:false,
				BLShow:false,
				timeVisible:false,
				//pie
				chartData:{
					series:[]
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
				this.procedureFetch();
				// 
				const {	ws,line,startDate,endDate}=this.form
				this.$http
						.request({
						url: "/api/ProduceReport/UPH",
						method: "GET",
						data:{
							wsCode:this.wsDict[ws],
							lineCode:this.BLDict[line],
							processCode:'',
							startDate,
							endDate
						}
						})
					 .then(data=>{
						 const obj={}
						 const resList=[]

						 data.map(item=>{
							 const {processCode,date}=item
							 item.name=this.procedureDict[processCode]
							 return item
						 })
						 .sort((a,b)=>a.date-b.date)
						
						const maxTime =data.slice(-1)[0].date;
						const preTime =moment( +new Date(maxTime)-1000*60*60*24).format();
						


				
					

					
                         

						//  data.map(item=>{
						// 	 const {processCode,date}=item
						// 	 item.name=this.procedureDict[processCode]
						// 	 item.date=moment(date).valueOf()
						// 	 return item
						//  })
						//  .sort((a,b)=>a.date-b.date)
						//  .forEach(({name,date,qty})=>{
						// 	 if(!obj[name]){obj[name]=[]};
						// 	obj[name].push([date,qty])
						//  })
						
						
						// for (const [key, value] of Object.entries(obj)) {
						//    value.sort((a,b)=>a.date-b.date)
					
						   
						//    resList.push({name:key,data:value})
						// }
 
						// this.chartData.series=resList


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
		//    console.log(moment('2019-12-12T14:00:00').valueOf())
        //    console.log(moment(1576130400000).format())


			this.procedureFetch()
		
		}
	}
</script>

<style lang="scss" scoped>
#passRate{overflow: hidden;}
.charts-pie{
	margin-top: 20rpx;
	width: 730rpx;
	height: 500rpx;
	background:$white-color;
}
</style>
