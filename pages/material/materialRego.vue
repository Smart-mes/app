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
						<view class="w"><u-button type="info" size="mini" class="ml-20" @click="machineChange">切换</u-button></view>
					</template>
					<template v-slot:inputQtyRight="slotProps">
						<view class="w unit">PCS</view>
					</template>
					<!-- list -->
					<template v-slot:matCodeBottom="slotProps">
						<view class="tip">
							<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="matCodeDict"  :data="matCodeData"/>	
						</view>
					</template>
					<template v-slot:bottom="slotProps">
           <view class="sanTip">
							<view v-if="!slotProps.data.matCode">请扫描物料编号</view>
							<view v-else-if="!slotProps.data.lotNo">请扫描物料批次</view>						
					 </view>
				</template>						
			 </ex-form>
		</ex-box>
		<!--组件 -->
		<xw-scan/>
		<u-toast ref="uToast" />
		<view class="h-100"></view>
    <view class="fixBtn">
			<u-row gutter="20">
        <!-- <u-col span="6"><u-button type="default" :disabled="isOut" @click="checkOutHandle">注销</u-button></u-col> -->
				<u-col span="6"><u-button type="default"  @click="rejectHandle">取消</u-button></u-col>
        <u-col span="6"><u-button  type="primary" :disabled="isRego"  @click="checkInHandle"> 注册 </u-button></u-col>
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
        title: "物料注册",
        isBack: true
        },
				formOpts:{
					formData:{machineCode:'',matCode:'',lotNo:'',inputQty:5000},
					formItem:[
							{ label: "当前设备", props: "machineCode", type: "exInput",border: true,disabled:true,class:'disabled'},
							{ label: "物料编号", props: "matCode", type: "exInput",border: true,change:true},
							{ label: "物料批次", props: "lotNo", type: "exInput",border: true,change:true},
							{ label: "批次数量", props: "inputQty", type: "numberBox",disabled:true,},
					],
				rules: {},
				event:{
					matCode:{
						confirm: (e)=>{
								this.matCodeHandle(e);				
						},
						input:(e)=>{
							if(!e){
								this.clearData();
							}
						}							
					},
					lotNo:{
						confirm: (e)=>{
              this.lotNoHandle(e);
						},
					}	
				},			
				},
				stationCode:'',
				matCodeDict:{matCode:'编号',matName:'名称'},
				matCodeData:{},
				isOut:true,
				isRego:true,
				// 回退
				isBack:false
			}
		},
		computed: {
    ...mapState(['line']),
    },
		methods: {
			...mapMutations(['set_line','clear_storage']),
			toast(type,msg){
				this.$refs.uToast.show({title:msg,type,position:'bottom'})
			},
			async matCodeHandle(e){
				const res=await this.matCodeFetch(e);
				if(res.length) {
					this.matCodeData=res[0];
				}else{
					this.toast('error',`${e}-没有注册`);	
				}	
			},
			async lotNoHandle(e){
				const res=await this.lotNoFetch(e);
				if(res.length){
						this.toast('warning ',`${e}-批次号已存在`);		
				}
				this.setType(res.length);				
			},		
			machineChange(){
				this.clear_storage('stationCode');
				uni.reLaunch({ url:'/pages/index/index' });
			},
			rejectHandle(){
        const {matCode,lotNo,inputQty}=this.$refs.regoForm.formData;
        if(!this.isRego&&inputQty!==5000){
          this.$refs.regoForm.formData.inputQty=5000;
          return
        }
        if(lotNo){
          this.$refs.regoForm.formData.lotNo='';
          return
        }
        if(matCode){
          this.$refs.regoForm.formData.matCode='';
          this.matCodeClear();
          return
        }
      },
			async checkOutHandle(){
				const {lotNo}=this.$refs.regoForm.formData;
				await this.checkOutFetch(lotNo);
				await this.toast('success','注销成功');
				await this.$refs.regoForm.clear();
				await this.clearData();
			},
			async checkInHandle(){
				await this.checkInFetch({
					stationCode:this.stationCode,
					...this.$refs.regoForm.formData,
					workshop:this.line[0].value,
					lotQty:this.$refs.regoForm.formData.inputQty
				});
				await this.toast('success','注册成功');
				await this.$refs.regoForm.clear();
				await this.clearData();
			},
			matCodeClear(){
				this.matCodeData={};
			},
			clearData(){
				this.$refs.regoForm.clear();
        this.setType(true);
			  this.matCodeClear();	
			},
			setType(isType){
			const {matCode,lotNo}=this.$refs.regoForm.formData
				this.formOpts.formItem[3].disabled=!!isType;
				if(!matCode&&!lotNo){
					this.isOut=	true;
				  this.isRego=true;
				}else{
					this.isOut=	!isType;
				  this.isRego=!!isType;
				}
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
		  const res=await this.BStationFetch(stationCode);
			if(res.length){
				const [{machineCode}] =res;
				this.formOpts.formData.machineCode=machineCode;
        this.$refs.regoForm.init();
			}

		},
		onUnload() {   
		   uni.$off('xwscan');
		},
		onShow() {
			uni.$off('xwscan') 
			uni.$on('xwscan', (res)=> {
			const code=this.$u.trim(res.code.replace(/\/n/g,''));
			const regoForm=this.$refs.regoForm;
			const {matCode,lotNo}=regoForm.formData;
				if(!matCode){
					regoForm.formData.matCode=code;
					return void this.matCodeHandle(code);	
				}
				if(!lotNo){
					regoForm.formData.lotNo=code;
					return void this.lotNoHandle(code);
				}
			})
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
	.unit{color:$font-light-gray;}	 
</style>
