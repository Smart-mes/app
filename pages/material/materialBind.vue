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
					<view class="w"><u-button type="info" size="mini" class="ml-20" @click="machineChange">切换</u-button></view>
				</template>
				<!-- list -->
				<template v-slot:lotNoBottom="slotProps">
					<view class="tip" v-show="Object.entries(lotNoData).length">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="lotNoDict"  :data="lotNoData"/>	
					</view>
				</template>	
				<template v-slot:feederCodeBottom="slotProps">
					<view class="tip" v-show="Object.entries(feederData).length">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="feederDict"  :data="feederData">
						  <template v-slot:right="slotProps"><u-button v-show="!!slotProps.data.feederCode" size="mini" @click="unloadHandle">卸载</u-button></template>
						</ex-describe>		
					</view>
				</template>						
			</ex-form>		
		</ex-box>
		<view class="h-100"></view>
    <view class="fixBtn">
			<u-row gutter="20">
        <u-col span="6"><u-button type="default" @click="resetHandle">重置</u-button></u-col>
        <u-col span="6"><u-button  type="primary" :disabled="isLoad" @click="installHandle"> 装入 </u-button></u-col>
      </u-row> 			
		</view>
	</view>
</template>

<script>
 import { mapState ,mapMutations} from "vuex";
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
							{ label: "物料批次", props: "lotNo", type: "exInput",border: true,change:true},
							{ label: "容器编号", props: "feederCode", type: "exInput",border: true,change:true},
					],
					rules: {},
					event:{
						lotNo:{
							confirm:async (e)=>{
							const res=await this.lotNoFetch(e);
							if(res.length) this.lotNoData=res[0];	
										 
							},
							input:(e)=>{							
								if(!e){
									this.clearLotNo();
									this.clearFeeder();
								}
							}
						},
						feederCode:{
							confirm:async (e)=>{
							  const toolList=await this.BWorkToolFetch(e);
								if(toolList.length){
									const feederList=await this.feederFetch(); 
									if(feederList.length){
										this.feederDict={feederCode:'飞达编号', lotNo:'物料批次',qty:'装载数量'}
										this.feederData=feederList[0]
							
									}else{
										this.feederDict={workToolCode:'工作编号',modelCode:'飞达型号'};
                     this.feederData=toolList[0];
										 this.isLoad=false;
									}
								}
							},
							input:(e)=>{
								if(!e) this.clearFeeder();
							}
						}
					},			
				},
				stationCode:'',
				//批次
				isLoad:true,
				lotNoDict:{lotNo:'批次',matCode:'料号',lotQty:'数量'},
				lotNoData:{},
				feederDict:{},
				feederData:{}
			}
		},
		computed: {
    ...mapState(["userInfo"])
    },
		methods: {
			...mapMutations(['clear_storage']),
			machineChange(){
				this.clear_storage();
				uni.reLaunch({ url:'/pages/index/index' });
			},
			async installHandle(){
				await this.installFetch();
				alert('装入成功')
			},
			async unloadHandle(){
				await	this.unloadFetch();
				await this.clearFeeder();	
				this.isLoad=true;	
				alert('卸载成功')
			},
			resetHandle(){
				this.$refs.BindForm.clear();
			},
			clearLotNo(){
				this.$refs.BindForm.formData.lotNo='';		
				this.lotNoData={};
			},
			clearFeeder(){
				this.$refs.BindForm.formData.feederCode='';		
				this.feederDict={};
				this.feederData={};
			},
			BStationFetch(stationCode){
				return this.$http.request({url: '/api/BStationList',method: "GET",data: {stationCode}}); 
			},
			lotNoFetch(lotNo){
				return this.$http.request({url: '/api/PMaterialWip',method: "GET",data: {lotNo}}); 
			},
			BWorkToolFetch(feederCode){
				return this.$http.request({url: '/api/BWorkTool',method: "GET",data: {workToolCode:feederCode}}); 
			},
			feederFetch(){
				const {lotNo,feederCode}=this.$refs.BindForm.formData;
				return this.$http.request({url: '/api/MaterialInFeeder',method: "GET",data: {lotNo,feederCode,stationCode:this.stationCode}}); 
			},
			installFetch(){
				const parame={stationCode:this.stationCode,empCode:this.userInfo.empCode,...this.$refs.BindForm.formData}
				return this.$http.request({url: '/api/MaterialInFeeder/Install',method: "POST",data: parame}); 
			},
			unloadFetch(){
				const parame={
					stationCode:this.stationCode,
					empCode:this.userInfo.empCode,
					...this.$refs.BindForm.formData,
					qty:this.feederData.qty
				}
				return this.$http.request({url: '/api/MaterialInFeeder/Uninstall',method: "POST",data: parame}); 
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
