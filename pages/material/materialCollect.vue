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
					<view class="material-w"><u-button type="info" size="mini" class="ml-20" @click="machineChange">切换</u-button></view>
				</template>
				<!-- list -->
				<template v-slot:lotNoBottom="slotProps">
					<view class="material-tip">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="lotNoDict"  :data="lotNoData"/>	
					</view>
				</template>	
				<template v-slot:feederCodeBottom="slotProps">
					<view class="material-tip" >
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="feederDict"  :data="feederData">
						  <template v-slot:right="slotProps"><u-button v-show="!!slotProps.data.feederCode" size="mini" @click="unloadHandle">卸料</u-button></template>
						</ex-describe>		
					</view>
				</template>
				<template v-slot:bottom="slotProps">
           <view class="sanTip">
							<view v-if="!slotProps.data.feederCode">请扫飞达物料</view>
							<view v-else-if="!slotProps.data.lotNo">请扫边仓物料</view>						
					 </view>
				</template>						
			</ex-form>		
		</ex-box>
		<u-toast ref="uToast" />
		<xw-scan/>
		<view class="h-100"></view>
    <view class="fixBtn">
			<u-row gutter="20">
        <u-col span="6"><u-button type="default" @click="rejectHandle">取消</u-button></u-col>
        <u-col span="6"><u-button  type="primary" @click="resetHandle"> 重置 </u-button></u-col>
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
				navBar: {title: "接料",isBack: true},
				formOpts:{
					formData:{machineCode:'',feederCode:'',lotNo:''},
					formItem:[
							{ label: "当前设备", props: "machineCode", type: "exInput",border: true,disabled:true,class:'disabled'},
							{ label: "飞达物料", props: "feederCode", type: "exInput",border: true},
							{ label: "边仓物料", props: "lotNo", type: "exInput",border: true},
						
					],
					rules: {},
					event:{
						feederCode:{
							confirm:async (e)=>{
								if(e) this.feederHandle(e);
							},
							input:(e)=>{
								if(!e){
								  this.resetHandle();
								}
						 }
						},
						lotNo:{
							confirm:async (e)=>{
								if(e) this.lotNoHandle(e);
							},
							input:(e)=>{
								if(!e){
									this.$refs.BindForm.formData.lotNo='';
									this.clearLotNo();		
								}
						 }	
						},
					},			
				},
				stationCode:'',
				//批次
				lotNoDict:{lotNo:'批次',matCode:'料号',lotQty:'数量'},
				lotNoData:{},
				feederDict:{feederCode:'飞达编号', lotNo:'物料批次',qty:'装载数量'},
				feederData:{}
			}
		},
		computed: {
      ...mapState(["userInfo"]),
    },
		methods: {
			...mapMutations(['clear_storage']),
// 			machineChange(){
// 				this.clear_storage('stationCode');
// 				uni.reLaunch({ url:'/pages/index/index' });
// 			},
// 			async lotNoHandle(e){
// 				const res=await this.lotNoFetch(e);
// 				if(res.length){
// 					this.lotNoData=res[0];
// 					if(res[0].state===1){							
// 						const {lotNo}=this.$refs.BindForm.formData			
// 						await	this.getFeederData({lotNo});
// 						this.$refs.BindForm.formData.feederCode=this.feederData.feederCode;		
// 						this.toast('success',`当前批次接料到:${this.feederData.feederCode}`);  						 								
// 					}
// 				}else{
// 					  this.$refs.BindForm.formData.lotNo='';
// 						this.clearLotNo();
// 						this.clearFeeder();
// 						this.toast('error',`${e}-没有注册`);		
// 				}	
//       },
// 			async feederHandle(e){
// 				const toolList=await this.BWorkToolFetch(e);
// 				if(toolList.length){
// 					const feederList=this.getFeederData(this.$refs.BindForm.formData);
// 					if(!feederList.length){
// 				  	await	this.installHandle();
// 					  await	this.resetHandle();		
// 					}							
// 				}else{
// 					this.$refs.BindForm.formData.feederCode='';
// 					this.toast('error',`容器不存在`);		
// 				}
// 			},
// 			async installHandle(){
// 				const {code,message}=  await this.installFetch();
//         if(code==='OK'){
// 					await this.toast('success',message);		
//           await this.getFeederData(this.$refs.BindForm.formData);
// 				}else{
//           await this.toast('error',message);		
// 				}		     
// 			},
// 			async getFeederData(parame){
// 				const feederList=await this.feederFetch(parame); 
//         if(feederList.length){
//           this.feederData=feederList[0];              
//         }
//         return feederList;
// 			},
			async unloadHandle(){
				await	this.unloadFetch();
				await this.clearFeeder();	
				this.resetHandle();		
				await this.toast('success','卸载成功');		
			},
      async feederHandle(e){
			   const res= await this.feederFetch(e);
					if(res.length){
						  this.feederData=res[0];
					}else{
						this.$refs.BindForm.formData.feederCode='';
						this.toast('error',`${e}-该物料批次没安装在飞达`);	
				 }
		 },
		 async lotNoHandle(e){
				const res= await this.lotNoFetch(e);
				const state=res.length? res[0].state:''
				if(state===0){
						this.installHandle();
				}else if(state===1){
					this.$set(this.$refs.BindForm.formData,'lotNo','');
					this.toast('error','物料批次已安装在飞达');
				}else{
					this.$set(this.$refs.BindForm.formData,'lotNo','');
					this.toast('error','物料批次未注册');
				}
		 },		
		 async installHandle(){
				const {code,message}=  await this.installFetch();
        if(code==='OK'){
					await this.toast('success',message);
					this.resetHandle();		
				}else{
          await this.toast('error',message);		
				}		     
			},
			toast(type,msg){
				this.$refs.uToast.show({title:msg,type,position:'bottom'})
			},
			rejectHandle(){
				const {lotNo,feederCode}=this.$refs.BindForm.formData;
        if(lotNo){
          this.$refs.BindForm.formData.lotNo='';
         return void this.clearLotNo();
          
        } 
        if(feederCode){
          this.$refs.BindForm.formData.feederCode='';
          return void this.clearFeeder();
        }		
			},
			resetHandle(){
				this.$refs.BindForm.clear();
				this.clearLotNo();
				this.clearFeeder();
			},
			clearLotNo(){
				this.lotNoData={};
			},
			clearFeeder(){
				this.feederData={};
			},
			BStationFetch(stationCode){
				return this.$http.request({url: '/api/BStationList',method: "GET",data: {stationCode}}); 
			},
			lotNoFetch(lotNo){
				return this.$http.request({url: '/api/PMaterialWip',method: "GET",data: {lotNo}}); 
			},
			// BWorkToolFetch(feederCode){
			// 	return this.$http.request({url: '/api/BWorkTool',method: "GET",data: {workToolCode:feederCode}}); 
			// },
			feederFetch(feederCode){
				return this.$http.request({url: '/api/MaterialInFeeder',method: "GET",data: {feederCode,stationCode:this.stationCode}}); 
			},
			installFetch(){
				const parame={stationCode:this.stationCode,empCode:this.userInfo.empCode,...this.$refs.BindForm.formData,isAppend:true}
				return this.$http.request({url: '/api/MaterialInFeeder/Install',method: "POST",data: parame})
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
			const res=await this.BStationFetch(stationCode);
			if(res.length){
				const [{machineCode}]=res 
				this.formOpts.formData.machineCode=machineCode;
				this.$refs.BindForm.setData({machineCode});
			}

		},
		onUnload() {   
		   uni.$off('xwscan');
		},
		onShow() {
			uni.$off('xwscan') 
			uni.$on('xwscan', (res)=> {
			const code=this.$u.trim(res.code.replace(/\/n/g,''));
			const BindForm=this.$refs.BindForm;
			const {lotNo,feederCode}=BindForm.formData;
				if(!feederCode){
					BindForm.formData.feederCode=code;
					return void this.feederHandle(code);
				}
				if(!lotNo){
					BindForm.formData.lotNo=code;
					return void this.lotNoHandle(code);	
				}
			})
		},
	}
</script>

<style lang="scss" scoped>

	.w{margin-left: 10rpx; width: 100rpx; text-align:center;}
</style>
