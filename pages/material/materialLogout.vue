<template>
	<view>
		<ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold/>
		 <ex-box :radius="false">
				<ex-form 
				ref="Logout"
				:borderBottom="false"
				:formOpts="formOpts"
				:isBtn="false"
				>
					<template v-slot:lotNoBottom="slotProps">
						<view class="material-tip">
							<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="lotNoDict"  :data="lotNoData"/>	
						</view>
				</template>
				<template v-slot:bottom="slotProps">
           <view class="sanTip">
							<view v-if="!slotProps.data.lotNo">请扫描边仓物料</view>					
					 </view>
				</template>												
			</ex-form>		
		</ex-box>	
		<u-toast ref="uToast" />
		<view class="h-100"></view>
    <view class="fixBtn">
			<u-row gutter="20">
        <u-col span="6"><u-button type="default" @click="rejectHandle">取消</u-button></u-col>
        <u-col span="6"><u-button  type="primary" :disabled="isLogout" @click="checkOutHandle"> 注销 </u-button></u-col>
      </u-row> 			
		</view>
	</view>
</template>

<script>
import { mapState ,mapMutations} from "vuex";
	export default {
		name:'MaterialLogout',
		data() {
			return {
				navBar: {title: "物料注销",isBack: true},
				formOpts:{
					formData:{lotNo:''},
					formItem:[
						{ label: "边仓物料", props: "lotNo", type: "exInput",border: true},
					],
					rules:{},
					event:{
						lotNo:{
							confirm: (e)=>{
								if(e) this.lotNoHandle(e);
								
							},
							input:(e)=>{
								if(!e){
									this.lotNoClear();
								}
						 }	
						},
					}
				},
				stationCode:'',
				lotNoDict:{lotNo:'批次',matCode:'料号',lotQty:'数量'},
				lotNoData:{},
				isLogout:true			
			}
		},
		computed: {
    ...mapState(["userInfo"])
    },
		methods: {
			async lotNoHandle(e){
				const res= await this.lotNoFetch(e);
				if(res.length){
					this.lotNoData=res[0];
					this.isLogout=false;
				}else{
					this.toast('error',`${e}-边仓物料不存在`);
					this.lotNoClear();
				}
			},
			async checkOutHandle(){
				const {lotNo}=this.$refs.Logout.formData;
				const {code,message} =await this.checkOutFetch(lotNo);
				const toastType=code==='OK'?'success':'error'
				await this.toast(toastType,message);
				await this.lotNoClear();
				
			},
			rejectHandle(){
        const {lotNo}=this.$refs.Logout.formData;
        if(lotNo){
          return void this.lotNoClear();
        }
 
      },
			lotNoClear(){
				this.$refs.Logout.clear();
				this.lotNoData={};
				this.isLogout=true;
			},
			toast(type,msg){
				this.$refs.uToast.show({title:msg,type,position:'bottom'})
			},
			BStationFetch(stationCode){
				return this.$http.request({url: '/api/BStationList',method: "GET",data: {stationCode}}); 
			},
			lotNoFetch(lotNo){
				return this.$http.request({url: '/api/PMaterialWip',method: "GET",data: {lotNo}}); 
			},
			checkOutFetch(lotNo){
				return this.$http.request({url: '/api/MaterialInFeeder/CheckOut',method: "POST",data: {lotNo}}); 
			},		
		},
		async onLoad({stationCode}){
			this.stationCode=stationCode;
			const res =await this.BStationFetch(stationCode);
			if(res.length){
				const [{machineCode}]=res;
				this.formOpts.formData.machineCode=machineCode;
				this.$refs.Logout.setData({machineCode});
        // this.$refs.BindForm.init();				
			}
		},		
	}
</script>

<style lang="scss" scoped>

</style>
