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
				<template v-slot:storeLotNoBottom="slotProps">
					<view class="material-tip">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="storeDict"  :data="storeData"/>	
					</view>
				</template>	
				<template v-slot:feederLotNoBottom="slotProps">
					<view class="material-tip">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="feederDict"  :data="feederData">
						  <!-- <template v-slot:right="slotProps"><u-button v-show="!!slotProps.data.feederCode" size="mini" @click="unloadHandle">卸料</u-button></template> -->
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
					formData:{machineCode:'',feederLotNo:'',storeLotNo:''},
					formItem:[
							{ label: "当前设备", props: "machineCode", type: "exInput",border: true,disabled:true,class:'disabled'},
							{ label: "飞达物料", props: "feederLotNo", type: "exInput",border: true},
							{ label: "边仓物料", props: "storeLotNo", type: "exInput",border: true},
						
					],
					rules: {},
					event:{
						feederLotNo:{
							confirm:async (e)=>{
								if(e) this.feederHandle(e);
							},
							input:(e)=>{
								if(!e){
								  this.resetHandle();
								}
						 }
						},
						storeLotNo:{
							confirm:async (e)=>{
								if(e) this.lotNoHandle(e);
							},
							input:(e)=>{
								if(!e){
									this.$refs.BindForm.formData.storeLotNo='';
									this.clearStore();		
								}
						 }	
						},
					},			
				},
				stationCode:'',
				//批次
				feederDict:{feederCode:'飞达编号', lotNo:'物料批次',qty:'装载数量'},
				feederData:{},
				storeDict:{lotNo:'批次',matCode:'料号',lotQty:'数量'},
				storeData:{},
			}
		},
		computed: {
      ...mapState(["userInfo"]),
    },
		methods: {
			...mapMutations(['clear_storage']),
      async feederHandle(e){
			   const res= await this.feederFetch(e);
					if(res.length){
						  this.feederData=res[0];
					}else{
						this.$refs.BindForm.formData.feederLotNo='';
						this.toast('error',`${e}-该物料批次没安装在飞达`);	
				 }
		 },
		 async lotNoHandle(e){
				const res= await this.lotNoFetch(e);
				const state=res.length? res[0].state:'';
				if(state===0){
						this.installHandle();
				}else if(state===1){
					this.$refs.BindForm.formData.storeLotNo='';
					this.toast('error','物料批次已安装在飞达');
				}else{
					this.$refs.BindForm.formData.storeLotNo='';
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
				const {feederLotNo,storeLotNo}=this.$refs.BindForm.formData;
        if(storeLotNo){
          this.$refs.BindForm.formData.storeLotNo='';
         return void this.clearStore();       
        } 
        if(feederLotNo){
          this.$refs.BindForm.formData.feederLotNo='';
          return void this.clearFeeder();
        }		
			},
			resetHandle(){
				this.$refs.BindForm.clear();
				this.clearStore();
				this.clearFeeder();
			},
			clearStore(){
				this.storeData={};
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
			feederFetch(feederLotNo){
				return this.$http.request({url: '/api/MaterialInFeeder',method: "GET",data: {lotNo:feederLotNo,stationCode:this.stationCode}}); 
			},
			installFetch(){
				const parame={
					stationCode:this.stationCode,
					empCode:this.userInfo.empCode,
					lotNo:this.$refs.BindForm.formData.storeLotNo,
					feederCode:this.feederData.feederCode,
					// ...this.$refs.BindForm.formData,
					isAppend:true
				}
				return this.$http.request({url: '/api/MaterialInFeeder/Install',method: "POST",data: parame})
			},
			// unloadFetch(){
			// 	const parame={
			// 		stationCode:this.stationCode,
			// 		empCode:this.userInfo.empCode,
			// 		...this.$refs.BindForm.formData,
			// 		qty:this.feederData.qty
			// 	}
			// 	return this.$http.request({url: '/api/MaterialInFeeder/Uninstall',method: "POST",data: parame}); 
			// },
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
</style>
