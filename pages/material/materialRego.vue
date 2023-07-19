<template>
	<view>
    <ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold/>
    <!-- nav -->
		<ex-box :radius="false" >
				<ex-form 
				 ref="regoForm"
				:borderBottom="false"
				:formOpts="formOpts"
				:isBtn="false"
				>
				<template v-slot:machineCodeRight="slotProps">
					<view class="w"><u-button type="info" size="mini" class="ml-20">切换</u-button></view>
				</template>
				<!-- list -->
				<template v-slot:matCodeBottom="slotProps">
					<view class="tip" v-show="Object.entries(matCodeData).length&&slotProps.data.matCode">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="matCodeDict"  :data="matCodeData"/>	
					</view>
				</template>
				<template v-slot:lotNoBottom="slotProps">
					<view class="tip" v-show="isLotNo&&slotProps.data.lotNo">
					  已存在
					</view>
				</template>

			 </ex-form>
		</ex-box>
		<view class="h-100"></view>
    <view class="fixBtn">
			<u-row gutter="20">
        <u-col span="6"><u-button type="default" :disabled="isOut" @click="checkOutHandle">注销</u-button></u-col>
        <u-col span="6"><u-button  type="primary" :disabled="isRego"  @click="checkInHandle"> 注册 </u-button></u-col>
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
        title: "物料注册",
        isBack: true
        },
				formOpts:{
					formData:{machineCode:'',matCode:'',lotNo:'',inputQty:1},
					formItem:[
							{ label: "当前设备", props: "machineCode", type: "exInput",border: true,disabled:true},
							{ label: "物料编号", props: "matCode", type: "exInput",border: true},
							{ label: "物料批次", props: "lotNo", type: "exInput",border: true},
							{ label: "批次数量", props: "inputQty", type: "numberBox",disabled:true},
					],
				rules: {},
				event:{
					matCode:{
						confirm:async (e)=>{
									const res=await this.matCodeFetch(e);
									if(res.length) this.matCodeData=res[0];												
								},
					},
					lotNo:{
						confirm:async (e)=>{
								const res=await this.lotNoFetch(e);
								this.setType(res.length);
						},
					}	
				},			
				},
				stationCode:'',
				matCodeDict:{matCode:'编号',matName:'名称'},
				matCodeData:{},
				isLotNo:false,
				isOut:true,
				isRego:true
			}
		},
		computed: {
    ...mapState(["line"]),
    },
		methods: {
			async checkOutHandle(){
				const {lotNo}=this.$refs.regoForm.formData;
				await this.checkOutFetch(lotNo);
				await this.clearData();
			},
			async checkInHandle(){
			  const regoForm=this.$refs.regoForm
				await this.checkInFetch({
					stationCode:this.stationCode,
					...regoForm.formData,
					workshop:this.line[0].value,
					lotQty:regoForm.inputQty
				});
				await this.clearData();
			},
			clearData(){
				this.$refs.regoForm.clear();
        this.setType(false);
			},
			setType(isType){
				this.isLotNo=!!isType;
				this.formOpts.formItem[3].disabled=!!isType;
				this.isOut=	!isType;
				this.isRego=!!isType;
			},
			BStationFetch(stationCode){
				return this.$http.request({url: '/api/BStationList',method: "GET",data: {stationCode}}); 
			},
			matCodeFetch(matCode){
			  return  this.$http.request({url: '/api/BMaterial',method: "GET",data: {matCode}}); 
			},
			lotNoFetch(lotNo){
				return  this.$http.request({url: '/api/PMaterialWip',method: "GET",data: {lotNo}}); 
			},
			checkOutFetch(lotNo){
				return this.$http.request({url: '/api/MaterialInFeeder/CheckOut',method: "POST",data: {lotNo}}); 
			},
			checkInFetch(parame){
				return this.$http.request({url: '/api/MaterialInFeeder/CheckIn',method: "POST",data:parame});  
			}
		},
		async onLoad({stationCode}){
			this.stationCode=stationCode;
		  const [{machineCode}] =await this.BStationFetch(stationCode);
			this.formOpts.formData.machineCode=machineCode;
      this.$refs.regoForm.init();
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
