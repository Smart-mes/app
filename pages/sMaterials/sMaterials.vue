<template>
	<view>
    <ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold  :customBack="customBack"/>
		<u-gap id="gap" height="15"/>
		<!-- #ifdef APP-PLUS -->
	  <u-sticky :enable="isSticky" offset-top="88">
		 <!-- #endif -->
     <!-- #ifdef H5 -->
		 <u-sticky :enable="isSticky">
		  <!-- #endif -->	
			<view id="info" class="info">
				<view  class="info-box">
				<view v-show="InfoShow">
						<view  class="info-list">
							<view class="info-item">
								<view class="info-item-name">产线：</view>
								<view class="info-item-text">{{dict.BLine&&dict.BLine[workOrder.lineCode]}}</view>
							</view>
							<view class="info-item">
								<view class="info-item-name">工单：</view>
								<view class="info-item-text">{{workOrder.orderNo}}</view>
							</view>
							<view class="info-item">
								<view class="info-item-name">工位：</view>
								<view class="info-item-text">{{dict.BStationList&&dict.BStationList[workOrder.stationCode]}}</view>
							</view>		
							<view class="info-item">
								<view class="info-item-name">设备：</view>
								<view class="info-item-text">{{(dict.machine&&dict.machine[workOrder.stationCode])||'无'}}</view>
							</view>	
					</view>
					<view  class="info-line"><u-line color="#ddd"/></view>								
				</view>							
				<view class="info-operate">
					<u-dropdown ref="uDropdown" height="60rpx" @open="handleDopen">
						<u-dropdown-item  title="单元">
							<view class="slot-content">
										<view class="item-box">
											<view class="item" :class="[item.active ? 'active' : '']" v-for="(item, i) in unitList" :key="i"  @tap="handleTag(i,'unit')">
												{{item.label}}
											</view>
										</view>
								<u-row class="m-t20" gutter="20">
									<u-col span="6"><u-button class="left-btn" size="default" @click="handleDReset('unit')">重置</u-button></u-col>
									<u-col span="6"><u-button class="right-btn" type="primary" @click="handleDConfirm('unit')">确定</u-button></u-col>
								</u-row>
							</view>
						</u-dropdown-item>
						<u-dropdown-item title="插槽">
							<view class="slot-content">
										<view class="item-box">
											<view class="item" :class="[item.active ? 'active' : '']" v-for="(item, i) in slotNoList" :key="i" @tap="handleTag(i,'slotNo')">
												{{item.label}}
											</view>
										</view>
								<u-row class="m-t20" gutter="20">
									<u-col span="6"><u-button class="left-btn" size="default" @click="handleDReset('slotNo')">重置</u-button></u-col>
									<u-col span="6"><u-button class="right-btn" type="primary" @click="handleDConfirm('slotNo')">确定</u-button></u-col>
								</u-row>
							</view>				
						</u-dropdown-item>
						<u-dropdown-item title="L/R">
							<view class="slot-content">
										<view class="item-box">
											<view class="item" :class="[item.active ? 'active' : '']" v-for="(item, i) in leftOrRightList" :key="i" @tap="handleTag(i,'leftOrRight')">
												{{item.label}}
											</view>
										</view>
								<u-row class="m-t20" gutter="20">
									<u-col span="6"><u-button class="left-btn" size="default" @click="handleDReset('leftOrRight')">重置</u-button></u-col>
									<u-col span="6"><u-button class="right-btn" type="primary" @click="handleDConfirm('leftOrRight')">确定</u-button></u-col>
								</u-row>
							</view>			
						</u-dropdown-item>
				</u-dropdown>	
				</view>							
				</view>
			</view> 
		</u-sticky>						
		<!-- 列表 -->
		<view class="operate-info basic-box m">
       <ex-title title="物料列表" class="p-30 p-b0">
		     <view slot="right">已完成{{finishNum}}，一共有{{mList.length}}</view>
			 </ex-title>	
       <view class="m-list">
					<!-- 1 -->
				  <view class="m-item flex" v-for="(mItem,i) in mList" :key="mItem.id">
						  <view class="flex-1">
								<view class="info-list">
										<view class="info-item">
											<view class="info-item-name">位置：</view>
											<view class="info-item-text">{{mItem.unit}}单元-{{mItem.slotNo}}{{mItem.leftOrRight?'-'+mItem.leftOrRight:''}}</view>
										</view>
										<view class="info-item">
											<view class="info-item-name">物料编号：</view>
											<view class="info-item-text">{{mItem.matCode}}</view>
										</view>
										<view class="info-item">
											<view class="info-item-name">物料批次：</view>
											<view class="info-item-text">{{mItem.lotNo||'无'}}</view>
										</view>					
								</view>								
							</view>
							<view class="m-operate flex align-items-center justify-content-center">
								<u-icon v-if="mItem.lotNo" class="m-operate-icon m-operate-del" name="close"  size="30" color="#fff"  @click="handleDel(i)"/>
								<u-icon v-else class="m-operate-icon m-operate-add" name="plus" size="30" color="#fff" @click="handleAdd(i)"/>
							</view>
					</view>	
							<!-- 无数据 -->
					<u-empty
							v-show="!mList.length"
							margin-top="30"
							icon-size="100"
							text="数据为空"
							mode="data"
			    />								
			 </view>
		</view>
		<view class="overflow-hidden"/>
		<!-- backTop -->
		<u-back-top :scrollTop="scrollTop" :right="100" :bottom="50"/> 
		<!-- 下拉 -->
		<u-popup  mode="bottom" closeable close-icon-pos="top-left" v-model="popupShow"  @open="popupOpen">
			<view class="materialsForm">
					<u-form ref="materialsForm" label-width="140rpx" :model="materialsForm">
							<u-form-item  label="单元" prop="unit">
								<u-input class="disabled" disabled v-model="materialsForm.unit"/>
							</u-form-item>
							<u-form-item   label="插槽" prop="slotNo">
								<u-input class="disabled" disabled v-model="materialsForm.slotNo"/>
							</u-form-item>
							<u-form-item  label="L/R" prop="leftOrRight">
								<u-input class="disabled" disabled v-model="materialsForm.leftOrRight"/>
							</u-form-item>
							<u-form-item required label="物料编号" prop="matCode">
								<u-input class="disabled" disabled  v-model="materialsForm.matCode" />
							</u-form-item>
							<u-form-item required label="物料批次" prop="lotNo">
								<u-input class="disabled" disabled  v-model="materialsForm.lotNo" />
							</u-form-item>							
							<!-- rawText -->
							<u-form-item  label="料盘编号" prop="rawText" >
								<view class="flex w-full" >
								<view class="flex-1">
									<u-input change focus v-model="materialsForm.rawText"  @input="materialsInput"/>
								</view>
								<view>
									<u-icon name="scan" size="40" color="#666" @click="handleMaterialsScan"/>
								</view>
							</view>						
							</u-form-item>
				</u-form>
				<u-row class="m-t20" gutter="20">
							<u-col span="6"><u-button class="left-btn" size="default" @click="handleReset">重置</u-button></u-col>
							<u-col span="6"><u-button class="right-btn" type="primary" :loading="btnLoading" @click="handleSubmit"> 提交 </u-button></u-col>
        </u-row> 				
			</view> 			
		</u-popup>
		<!-- 删除 -->
		<u-action-sheet :list="sheetList" v-model="sheetShow"  @click="handleSheet" />
		<!--模态窗口 -->
		<u-modal 
		  :show-cancel-button="!!notFinishNum"
			v-model="modelShow" 
			:show-title="false" 
			@cancel="modelCancel"
			@confirm="modelConfirm"
			mask-close-able>
			<view class="model-info" v-if="!notFinishNum">
				 <u-icon name="checkmark" size="80" color="#18b566"></u-icon>
				 <text class="m-t20">装料完成</text>
			</view>
			<view class="model-info" v-else>
				<u-icon name="info-circle" size="80" color="#ff9900"></u-icon>
				 <text class="m-t20">装料未完成,剩余{{notFinishNum}}</text>
			</view>
		</u-modal>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
import radio from "@/utils/radio.js"
import { mapState } from "vuex";
	export default {
		name:'SMaterials',
		data() {
			return {
				modelShow:false,
				navBar: { title:'工站物料', isBack: true},
				btnLoading:false,
				popupShow:false,
				materialsForm:{unit:'',slotNo:'',leftOrRight:'',matCode:'',lotNo:'',rawText:''},
				materialsRules:{
					matCode:{required: true,message: '不能为空',trigger: ['blur', 'change']},
					lotNo:{required: true,message: '不能为空',trigger: ['blur', 'change']},
				},
				// dropdown
				dropdown:{unit:'',slotNo:'',leftOrRight:''},
				unitList:[],
				slotNoList:[],
				leftOrRightList:[
					{label:'L',value:'L',active:false},
					{label:'R',value:'R',active:false},
					{label:'无',value:'无',active:false}
				],
				sheetShow:false,
				sheetList:[
					{text: '删除',color: 'red',active:false}
				],
				dict:{},
				materialIndex:0,
				workOrder:{},
				materialList:[],
				scrollTop:0,
				stickyTop:0,		
				isSticky:false,
				InfoShow:true,
				time:null
			}
		},
	  computed: {
			...mapState(["userInfo"]),
			mList(){
				const {unit,slotNo,leftOrRight}=this.dropdown;
        return this.materialList
				.filter(fIrem=>{
					if(unit) {return fIrem.unit===unit;}
					else return true;
				})
				.filter(fIrem=>{
					if(slotNo) return fIrem.slotNo===slotNo
					return true;
				})
				.filter(fIrem=>{
					if(leftOrRight){
						if(leftOrRight==='无'){
							return !fIrem.leftOrRight
						}
						return fIrem.leftOrRight===leftOrRight
					} 
					return true;
				})
			},
			finishNum(){
				return (this.materialList.filter(item=>!!item.lotNo)).length;
			},
			notFinishNum(){
				return this.materialList.length-this.finishNum;
			},
		},
		methods: {
			customBack(){
				console.log(this.notFinishNum)
				if(this.notFinishNum) this.modelShow=true;
			 else	uni.navigateBack();
			},
			modelCancel(){
				this.modelShow=false;
			},
			modelConfirm(){
				this.modelShow=false;
				if(this.notFinishNum){
					uni.navigateBack();
				}
			},
			materialsInput(val){
       if(val){
				this.initMaterials(val)
			 }else{
				this.materialsForm.matCode='';
				this.materialsForm.lotNo='';
			 }	
			},
			handleDopen(i){
				Object.entries(this.dropdown).forEach(([key],dIndex)=>{
					if(dIndex===i&&this.dropdown[key]){
						this[`${key}List`].forEach(item=>{
							if(this.dropdown[key]===item.value) item.active=true;
							else item.active=false;
						});
					}
				})
			},
			handleTag(i,prop){
				this[`${prop}List`].forEach(item=>item.active=false);
				this[`${prop}List`][i].active=true;
			},
			handleDReset(prop){
				this.dropdown[prop]='';
				this[`${prop}List`].forEach(item=>item.active=false);
				this.$refs.uDropdown.reset();
			},
			handleDConfirm(prop){
				const f = this[`${prop}List`].find(item=>item.active===true)	
				if(f) this.dropdown[prop]=f.value;			
				this.$refs.uDropdown.close(f.value);
			},
			handleDel(i){
				this.materialIndex=i;
				this.sheetShow=true;
			},
			setFormData(){
				Object.entries(this.materialsForm).forEach(([key,val])=>{	
					if(key==='matCode'||key==='lotNo'){  
						this.materialsForm[key]='';
					}else{					
						this.materialsForm[key]=this.materialList[this.materialIndex][key];
					}
				});				
			},
			handleAdd(i){
				this.materialIndex=i;
				this.popupShow=true;
			},
			popupOpen(){
				this.handleReset();
				this.$refs.materialsForm.setRules(this.materialsRules);
			},
			handleSheet(){
				const param={...this.materialList[this.materialIndex],lotNo:''};
				this.changeFetch(param).then(()=>{
						this.$refs.uToast.show({title: "卸料成功",type: "success"});
						this.getMateriallist();		
				});
			},
			 handleReset(){
			    this.$refs.materialsForm.resetFields();
		 		  this.setFormData();
	  	},
			handleSubmit(){				
				this.$refs.materialsForm.validate(valid => {
					if (valid) {
						this.btnLoading=true;	
						const param={...this.materialList[this.materialIndex],...this.materialsForm,empCode:this.userInfo.empCode};
						this.changeFetch(param).then(()=>{
							this.btnLoading=false;		
							this.popupShow=false;
							this.$refs.uToast.show({
								title: "装料成功",
								type: "success",
								callback:()=>{if(!this.notFinishNum){this.modelShow=true}} 
							});
							
							this.getMateriallist();		
						}).catch(()=>{							
              radio.play_ding_success();
							this.btnLoading=false;	
						})						
					} 
			 });
			},
		  handleMaterialsScan(){
        // #ifdef APP-PLUS
        uni.scanCode({
          success:(res)=> {
						this.materialsForm.rawText=res.result;						 
          },
			    fail: () => {
            this.$refs.uToast.show({ title: "扫码失败", type: "error" });
          }
        });
        // #endif
        // #ifdef H5
				this.materialsForm.rawText='YB060072-2302044000001-0603N331J500CT'
        // #endif				
			},
			initMaterials(param){		
				const MaterialsData= this.getMaterials(param) 
				if(MaterialsData){
					Object.entries(MaterialsData).forEach(([key,value])=>{
						this.materialsForm[key]=value
					})
				}else{
					this.$refs.uToast.show({ title:`${param}错误`, type: "error" });
				}  
			},
			getMaterials(param){
				const fReg=this.dict.reg[this.workOrder.flowId];
				const reg =fReg?fReg:this.dict.reg[0];
				const data=(new RegExp(reg)).exec(param);
				if(data) return data.groups;		
				else return ''; 
			},	
			async getMateriallist(){
				  uni.showLoading({ title: "加载中", mask: true });
				  this.materialList=await this.materialFetch().catch(()=>{ uni.hideLoading()});
				  uni.hideLoading();		
			},
			regDictFetch(){
        return this.$http.request({
          url: '/api/SDataTranslation/Dictionary',
          method: "GET",
          data:{tableName:'MaterialStation'}
        });					
			},
			dictFetch(){
        return  this.$http.request({
          url: '/api/Dictionary',
          method: "GET",
          data:{keys: 'BStationList|machine|BLine'}
        });				
			},		
			materialFetch(){
				const {flowId,stationCode}=this.workOrder;
        return  this.$http.request({
          url: '/api/MaterialInStation',
          method: "GET",
          data:{flowId,stationCode}
        });
     },
		 changeFetch(param){
			return  this.$http.request({
          url: '/api/MaterialInStation/Change',
          method: "POST",
          data:param
        });
		 }
		},
		async onLoad(options){
				this.unitList=new Array(4).fill({}).map((mapItem,i)=>({label:`${i+1}`,value:`${i+1}`,active:false}));
				this.slotNoList=new Array(10).fill({}).map((mapItem,i)=>({label:`A${i+1}`,value:`A${i+1}`,active:false}));
				// param 
				this.workOrder= JSON.parse(decodeURIComponent(options.param)); 
				this.materialsForm.stationCode=this.workOrder.stationCode;
				const dict=await this.dictFetch();
        const {MaterialStation:{codeSplitRule:reg}}=await this.regDictFetch();
				this.dict={...dict,reg};		  
				await this.getMateriallist();
		},
		onReady(){
				const query = uni.createSelectorQuery().in(this);
				query.select('#gap').boundingClientRect(data => {
					this.stickyTop=data.height;
				}).exec();
		},
		onPageScroll(e) {
			// let that = this;  
      if(this.stickyTop<=e.scrollTop)	this.isSticky=true;
			else this.isSticky=false;
			 	
			if(this.scrollTop> e.scrollTop){  
					this.InfoShow=true; 
			}else{  				
				if(e.scrollTop===0)	this.InfoShow=true; 
				else this.InfoShow=false;  
			}  
			this.scrollTop = e.scrollTop; 
		},
		onPullDownRefresh() {
			this.getMateriallist()
			.then(() => uni.stopPullDownRefresh())
			.catch(()=>uni.stopPullDownRefresh())
  },
	}
</script>

<style lang="scss" scoped>
.m{margin:15rpx 0; border-radius:0 ; padding: 0;}
.materialsForm{margin:30rpx;}
.info{
	.info-box{background-color:#fff; padding: 10rpx 0;}
  .info-operate{background-color:#fff;}
	.info-list{padding: 10rpx 30rpx 0 30rpx;}
	.info-line{margin: 10rpx 30rpx 0 30rpx;}
}
.model-info{
	padding: 30rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.slot-content {
		background-color: #FFFFFF;
		padding: 20rpx;
		.item-box {
			margin-bottom: 20rpx;
			display: flex;
			flex-wrap: wrap;
			
			.item {
				margin: 10rpx 10rpx;
				padding: 8rpx 40rpx;
				border-radius: 100rpx;
				width: 140rpx;
				text-align: center;
				border: 1px solid $u-type-primary;
				color: $u-type-primary;				
			}
			.active {
				color: #FFFFFF;
				background-color: $u-type-primary;
			}
		}
}
</style>
