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
					<template v-slot:inputQtyRight="slotProps">
						<view class="material-w unit">PCS</view>
					</template>
					<!-- list -->
					<template v-slot:matCodeBottom="slotProps">
						<view class="material-tip">
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
				<u-col span="6"><u-button type="default"  @click="rejectHandle">取消</u-button></u-col>
        <u-col span="6"><u-button  type="primary" :disabled="isRego"  @click="checkInHandle"> 注册 </u-button></u-col>
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
				navBar: {
        title: "物料注册",
        isBack: true
        },
				formOpts:{
					formData:{matCode:'',lotNo:'',inputQty:5000},
					formItem:[
							{ label: "物料编号", props: "matCode", type: "exInput",border: true,change:true},
							{ label: "物料批次", props: "lotNo", type: "exInput",border: true,change:true},
							{ label: "批次数量", props: "inputQty", type: "numberBox",disabled:true,},
					],
				rules: {},
				event:{
					matCode:{
						confirm: (e)=>{
							if(e) this.matCodeHandle(e);				
						},
						input:(e)=>{
							if(!e) this.clearData();
						}							
					},
					lotNo:{
						confirm: (e)=>{
              if(e) this.lotNoHandle(e);
						},
						input:(e)=>{
							if(!e) this.$refs.regoForm.formData.inputQty=5000; 
						}	
					}	
				},			
				},
				stationCode:'HWSMT04-01',
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
			...mapMutations(['set_line']),
			toast(type,msg){
				this.$refs.uToast.show({title:msg,type,position:'bottom'})
			},
			errorTip(msg){
				uni.vibrateLong({
					success: ()=>this.toast('error',msg)			
				});	
			},
			async matCodeHandle(e){
				const res=await this.matCodeFetch(e);
				if(res.length) {
					this.matCodeData=res[0];
				}else{
					this.$refs.regoForm.formData.matCode='';
					this.errorTip(`${e}-物料编号不存在`);	
					this.rejectHandle();				
				}	
			},
			async lotNoHandle(e){
				const res=await this.lotNoFetch(e);
				if(res.length){
					this.errorTip(`${e}-批次号已存在`);	
					this.$refs.regoForm.formData.lotNo='';
				}
				this.setType(res.length);				
			},		
			rejectHandle(){
        const {matCode,lotNo,inputQty}=this.$refs.regoForm.formData;
        if(!this.isRego&&inputQty!==5000){
	         return this.$refs.regoForm.formData.inputQty=5000;        
        }
        if(lotNo){
	        return  this.$refs.regoForm.formData.lotNo='';          
        }
        if(matCode){
          this.$refs.regoForm.formData.matCode='';
         return void this.matCodeClear();       
        }
      },
			async checkInHandle(){
			const {code,message}=	await this.checkInFetch({
					stationCode:this.stationCode,
					...this.$refs.regoForm.formData,
					workshop:this.line[0].value,
					lotQty:this.$refs.regoForm.formData.inputQty
				});
				if(code==='OK'){
					this.toast('success',message);	
					radio.play_ding_success();
				}else{
					this.rejectHandle();
					this.errorTip(message);	
				}	
				this.$refs.regoForm.clear();
				this.clearData();
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
				this.formOpts.formItem[2].disabled=!!isType;
				if(!matCode&&!lotNo){
					this.isOut=	true;
				  this.isRego=true;
				}else{
					this.isOut=	!isType;
				  this.isRego=!!isType;
				}
			},
			matCodeFetch(matCode){
			  return  this.$http.request({url: '/api/BMaterial',method: "GET",data: {matCode}}); 
			},
			lotNoFetch(lotNo){
				return  this.$http.request({url: '/api/PMaterialWip',method: "GET",data: {lotNo}}); 
			},
			checkInFetch(parame){
				return this.$http.request({url: '/api/MaterialInFeeder/CheckIn',method: "POST",data:parame});  
			}
		},
		onUnload() {   
		   uni.$off('xwscan');
		},
		onShow() {
			uni.$off('xwscan') 
			uni.$on('xwscan', (res)=> {
			const code=this.$u.trim(res.code.replace(/\/n/g,''));
			console.log('code:',code)
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
	.unit{color:$font-light-gray;}	 
</style>
