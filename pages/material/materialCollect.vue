<template>
	<view>
    <ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold/>
    <!-- nav -->
		<ex-box :radius="false">
				<ex-form 
				ref="collectForm"
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
 import radio from "@/utils/radio.js"
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
								if(!e) this.resetHandle();
						 }
						},
						storeLotNo:{
							confirm:async (e)=>{
								if(e) this.storeHandle(e);
							},
							input:(e)=>{
								if(!e){
									this.$refs.collectForm.formData.storeLotNo='';
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
			toast(type,msg){
				this.$refs.uToast.show({title:msg,type,position:'bottom'})
			},
			errorTip(msg){
				uni.vibrateLong({
					success: ()=>this.toast('error',msg)					
				});	
			},
			machineChange(){
				this.clear_storage('stationCode');
				uni.reLaunch({ url:'/pages/index/index' });
			},
      async feederHandle(e){
			   const res= await this.feederFetch(e);
					if(res.length){
						  this.feederData=res[0];
					}else{
						this.errorTip(`${e}-该物料批次没安装在飞达`);
						this.$refs.collectForm.formData.feederLotNo='';
				 }
		 },
		 async storeHandle(e){
				const res= await this.lotNoFetch(e);
				const state=res.length? res[0].state:'';
				this.storeData=res[0];
				if(state===0){
						this.installHandle();
				}else if(state===1){
					this.errorTip('物料批次已安装在飞达');
					this.rejectHandle();
				}else{
					this.errorTip('物料批次未注册');
					this.rejectHandle();
				}
		 },		
		 async installHandle(){
				const {code,message}=await this.$http.request({
						url: '/api/MaterialInFeeder/Install',
						method: "POST",
						data: {
							stationCode:this.stationCode,
							empCode:this.userInfo.empCode,
							lotNo:this.$refs.collectForm.formData.storeLotNo,
							feederCode:this.feederData.feederCode,
							isAppend:true
					}
				});
				console.log(code,message)		
        if(code==='OK'){
					this.resetHandle();		
					this.toast('success',message);	
					radio.play_ding_success();
				}else{
					this.errorTip(message);
					this.rejectHandle();
					
				}		     
			},
			rejectHandle(){
				const {feederLotNo,storeLotNo}=this.$refs.collectForm.formData;
        if(storeLotNo){
          this.$refs.collectForm.formData.storeLotNo='';
         return void this.clearStore();       
        } 
        if(feederLotNo){
          this.$refs.collectForm.formData.feederLotNo='';
          return void this.clearFeeder();
        }		
			},
			resetHandle(){
				this.$refs.collectForm.clear();
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
			feederFetch(feederLotNo){
				return this.$http.request({url: '/api/MaterialInFeeder',method: "GET",data: {lotNo:feederLotNo,stationCode:this.stationCode}}); 
			},
		},
		async onLoad({stationCode}){
			this.stationCode=stationCode;
			const res=await this.BStationFetch(stationCode);
			if(res.length){
				const [{machineCode}]=res 
				this.formOpts.formData.machineCode=machineCode;
				this.$refs.collectForm.setData({machineCode});
			}
		},
		onUnload() {   
		   uni.$off('xwscan');
		},
		onShow() {
			uni.$off('xwscan') 
			uni.$on('xwscan', (res)=> {
			const code=this.$u.trim(res.code.replace(/\/n/g,''));
			const collectForm=this.$refs.collectForm;
			const {feederLotNo,storeLotNo}=collectForm.formData;
				if(!feederLotNo){
					collectForm.formData.feederLotNo=code;
					return void this.feederHandle(code);
				}
				if(!storeLotNo){
					collectForm.formData.storeLotNo=code;
					return void this.storeHandle(code);	
				}
			})
		},
	}
</script>

<style lang="scss" scoped>
</style>
