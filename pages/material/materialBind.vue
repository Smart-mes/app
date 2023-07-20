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
					<view class="tip" v-show="Object.entries(lotNoData).length&&slotProps.data.lotNo">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="lotNoDict"  :data="lotNoData"/>	
					</view>
				</template>	
				<template v-slot:feederCodeBottom="slotProps">
					<view class="tip">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="feederDict"  :data="feederData">
						  <template v-slot:right><u-button size="mini" @click="unloadHandle">卸载</u-button></template>
						</ex-describe>		
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
							{ label: "物料批次", props: "lotNo", type: "exInput",border: true},
							{ label: "容器编号", props: "feederCode", type: "exInput",border: true},
					],
					rules: {},
					event:{
						lotNo:{
							confirm:async (e)=>{
							const res=await this.lotNoFetch(e);	
								this.lotNoData=res[0];			 
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
										this.feederDict={workToolCode:'工作单号'}
                     this.feederData=toolList[0]
									}
								}
							}
						}
					},			
				},
				stationCode:'',
				//批次
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
			},
			unloadHandle(){
				this.unloadFetch();
				this.feederDict={};
				this.feederData={};
				alert('卸载成功')
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
				const parame={stationCode:this.stationCode,empCode:this.userInfo.empCode,...this.$refs.BindForm.formData}
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
