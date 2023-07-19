<template>
	<view>
    <ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold/>
    <!-- nav -->
		<ex-box :radius="false">
				<ex-form 
				ref="BindForm"
				:borderBottom="false"
				:formOpts="formOpts"
				:isBtn="false"
				>
				<template v-slot:machineCodeRight="slotProps">
					<view class="w"><u-button type="info" size="mini" class="ml-20">切换</u-button></view>
				</template>
				<!-- list -->
				<template v-slot:lotNoBottom="slotProps">
					<view class="tip">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="lotNoDict"  :data="lotNoData"/>	
					</view>
				</template>	
				<template v-slot:feederCodeBottom="slotProps">
					<view class="tip">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="feederCodeDict"  :data="feederCodeData"/>	
					</view>
				</template>						
			</ex-form>		
		</ex-box>
		<view class="h-100"></view>
    <view class="fixBtn">
			<u-row gutter="20">
        <u-col span="6"><u-button type="default">重置</u-button></u-col>
        <u-col span="6"><u-button  type="primary" @click="installHandle"> 装入 </u-button></u-col>
      </u-row> 			
		</view>
	</view>
</template>

<script>
  import { mapState } from "vuex";
	export default {
		name:"MaterialRego",
		data() {
			return {
				navBar: {
        title: "物料绑定",
        isBack: true
        },
				formOpts:{
					formData:{machineCode:'',lotNo:'',feederCode:''},
					formItem:[
							{ label: "当前设备", props: "machineCode", type: "exInput",border: true,disabled:true},
							{ label: "物料批次", props: "lotNo", type: "exInput",border: true},
							{ label: "容器编号", props: "feederCode", type: "exInput",border: true},
					],
					rules: {},
					event:{
						lotNo:{
							confirm:async (e)=>{
							const res=await this.lotNoFetch(e);	
								this.lotNoData=res;			 
							}
						},
						feederCode:{
							confirm:async (e)=>{
							  const res=await this.BWorkToolFetch(e);
								if(res.length) await this.feederFetch(); 
							}
						}
					},			
				},
				stationCode:'',
				//批次
				lotNoDict:{lotNo:'批次',matCode:'料号',lotQty:'数量'},
				lotNoData:{},
				feederCodeDict:{},
				feederCodeData:{}
			}
		},
		computed: {
    ...mapState(["userInfo"])
    },
		methods: {
			installHandle(){
				this.installFetch();
			},
			BStationFetch(stationCode){
				return this.$http.request({url: '/api/BStationList',method: "GET",data: {stationCode}}); 
			},
			lotNoFetch(lotNo){
				return this.$http.request({url: '/api/MaterialInFeeder/PMaterialWip',method: "GET",data: {lotNo}}); 
			},
			BWorkToolFetch(feederCode){
				return this.$http.request({url: '/api/BWorkTool',method: "GET",data: {workToolCode:feederCode}}); 
			},
			feederFetch(){
				const {lotNo,feederCode}=this.$refs.BindForm.formData;
				return this.$http.request({url: '/api/MaterialInFeeder/PMatInFeeder',method: "GET",data: {lotNo,feederCode}}); 
			},
			installFetch(){
				const parame={stationCode:this.stationCode,empCode:this.userInfo.empCode,...this.$refs.BindForm.formData}
				return this.$http.request({url: '/api/MaterialInFeeder/Install',method: "POST",data: parame}); 
			},
		},
		async onLoad({stationCode}){
			this.stationCode=stationCode;
			const [{machineCode}] =await this.BStationFetch(stationCode);
			this.formOpts.formData.machineCode=machineCode;
      this.$refs.BindForm.init();
		},
	}
</script>

<style lang="scss" scoped>
  .tip{
		 margin-bottom: 20rpx;
		 padding: 10rpx;
		 background-color:#f9fdede0;
		 border: 1px solid #eee;
		 }
	.w{margin-left: 10rpx; width: 100rpx; text-align:center;}	 
</style>
