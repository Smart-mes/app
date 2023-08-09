<template>
	<view>
		<ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold/>
		 <ex-box :radius="false">
				<ex-form 
				ref="logoutForm"
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
		<xw-scan/>
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
import { mapState} from "vuex";
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
								if(!e) this.lotNoClear();
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
				const {lotNo}=this.$refs.logoutForm.formData;
				const {code,message} =await this.checkOutFetch(lotNo);
				const toastType=code==='OK'?'success':'error'
				await this.toast(toastType,message);
				await this.lotNoClear();
				
			},
			rejectHandle(){
        const {lotNo}=this.$refs.logoutForm.formData;
        if(lotNo) this.lotNoClear();
      },
			lotNoClear(){
				this.$refs.logoutForm.clear();
				this.lotNoData={};
				this.isLogout=true;
			},
			toast(type,msg){
				this.$refs.uToast.show({title:msg,type,position:'bottom'})
			},
			lotNoFetch(lotNo){
				return this.$http.request({url: '/api/PMaterialWip',method: "GET",data: {lotNo}}); 
			},
			checkOutFetch(lotNo){
				return this.$http.request({url: '/api/MaterialInFeeder/CheckOut',method: "POST",data: {lotNo}}); 
			},		
		},
		onUnload() {   
		   uni.$off('xwscan');
		},
		onShow() {
			uni.$off('xwscan') 
			uni.$on('xwscan', (res)=> {
			const code=this.$u.trim(res.code.replace(/\/n/g,''));
			const logoutForm=this.$refs.logoutForm;
			const {lotNo}=logoutForm.formData;
				if(!lotNo){
					logoutForm.formData.lotNo=code;
					 this.lotNoHandle(code);	
				}			
			})
		}, 		
	}
</script>

<style lang="scss" scoped>

</style>
