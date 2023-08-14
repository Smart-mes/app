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
					<view v-show="InfoShow" >
						<exDescribe margin="0" :lableDict="infoLable" :valueDict="dict" :data="infoData"/>
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
			 <ex-list borderTop :lableDict="maLable" :data="mList" :slotName="mSlot">
				<template v-slot:position="slotProps">	
					{{slotProps.data.unit}}单元-{{slotProps.data.slotNo}}{{slotProps.data.leftOrRight?'-'+slotProps.data.leftOrRight:''}}
				</template>	
				<template v-slot:right="slotProps">		
					   <u-icon v-show="slotProps.data.lotNo" class="m-operate-icon m-operate-del" name="close"  size="30" color="#fff"  @click="handleDel(slotProps.data)"/>
						 <u-icon v-show="!slotProps.data.lotNo" class="m-operate-icon m-operate-add" name="plus" size="30" color="#fff" @click="handleAdd(slotProps.data)"/>
				</template>					
			 </ex-list>	
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
							<u-row>
								<u-col span="6">
									<u-form-item   label="插槽" prop="slotNo">
										<u-input class="disabled" disabled v-model="materialsForm.slotNo"/>
									</u-form-item>								
								</u-col>
								<u-col span="6">
									<u-form-item  label="L/R" prop="leftOrRight">
										<u-input class="disabled" disabled v-model="materialsForm.leftOrRight"/>
									</u-form-item>								
								</u-col>
						</u-row>
						<u-form-item class="relative"  label="物料编号" prop="cMatCode" >
								<u-input class="disabled" disabled  v-model="materialsForm.cMatCode" />
							</u-form-item>
							<u-form-item class="relative" required label="当前物料" prop="matCode" >
								<u-input class="disabled" disabled  v-model="materialsForm.matCode" />
								<u-icon v-show="isMatCode" class="absolute matCode-icon" name="close" color="#e45656" size="28" />
							</u-form-item>
							<u-form-item required label="物料批次" prop="lotNo">
								<u-input class="disabled" disabled  v-model="materialsForm.lotNo" />
							</u-form-item>							
							<!-- rawText -->
							<u-form-item  label="料盘编号" prop="rawText" >
									<u-input change  v-model="materialsForm.rawText"  @confirm="materialsConfirm"/>
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
				infoLable:{lineCode:'产线',orderNo:'工单',stationCode:'工位',machineCode:'设备'},
				infoData:{},
				maLable:{position:'位置',cMatCode:'物料编号',lotNo:'物料批次'},
				dict:{},
        mSlot:{position:true},
				materialIndex:0,	
			  materialList:[],
				modelShow:false,
				navBar: { title:'工站物料', isBack: true},
				btnLoading:false,
				popupShow:false,
				materialsForm:{unit:'',slotNo:'',leftOrRight:'',cMatCode:'',matCode:'',lotNo:'',rawText:''},
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
				scrollTop:0,
				stickyTop:0,		
				isSticky:false,
				InfoShow:true,
				time:null
			}
		},
	  computed: {
			...mapState(["userInfo"]),
			isMatCode(){
				const {cMatCode,matCode}=this.materialsForm;
				if(matCode){
					return !(cMatCode===matCode);
				}else{
					return false;
				}
				
			},
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
				if(this.notFinishNum) this.modelShow=true;
			 else	uni.navigateBack();
			},
			modelCancel(){
				this.modelShow=false;
			},
			modelConfirm(){
				this.modelShow=false;
				uni.navigateBack();
			},
			async materialsConfirm(val){
				 await this.initMaterials(val);
				 await this.handleSubmit();	
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
			handleAdd(item){
				this.materialIndex=this.mList.findIndex(({id})=>id===item.id);
				this.popupShow=true;
			},
			handleDel(item){
				this.materialIndex=this.mList.findIndex(({id})=>id===item.id);
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
			popupOpen(){
				this.handleReset();
				this.$refs.materialsForm.setRules(this.materialsRules);
			},
			handleSheet(){
				const param={...this.materialList[this.materialIndex],lotNo:''};
				this.changeFetch(param).then(()=>{
						this.$refs.uToast.show({title: "卸料成功",type: "success"});
						this.$set(this.materialList[this.materialIndex], 'lotNo', '');	
				});
			},
			 handleReset(){
			    this.$refs.materialsForm.resetFields();
		 		  this.setFormData();
	  	},
			async handleSubmit(){				
				this.$refs.materialsForm.validate(async valid => {
					if (valid) {
						this.btnLoading=true;	
						const param={...this.materialList[this.materialIndex],...this.materialsForm,empCode:this.userInfo.empCode};
						const changeData= await this.changeFetch(param).catch(()=>{
								radio.play_ding_fail();
								this.btnLoading=false;	
						});
						this.btnLoading=false;	
			
						if(changeData.lotNo){
							this.popupShow=false;
							this.$set(this.materialList[this.materialIndex], 'lotNo', changeData.lotNo);
							if(!this.notFinishNum){
								this.modelShow=true
							}else{
								this.$refs.uToast.show({title: "装料成功",type: "success"});
							}
						};				
					} 
			 });
			},
		  // YB060072-2302044000001-0603N331J500CT
			initMaterials(param){		
				const MaterialsData= this.getMaterials(param) 
				if(MaterialsData){
					Object.entries(MaterialsData).forEach(([key,value])=>{
						if(key==='matCode'){
							this.materialsForm[key]=`6HP${value}`
						}else{
							this.materialsForm[key]=value
						}
						
					})
				}else{
					this.$refs.uToast.show({ title:`${param}错误`, type: "error" });
				}  
			},
			getMaterials(param){
				const fReg=this.dict.reg[this.infoData.flowId];
				const reg =fReg?fReg:this.dict.reg[0];
				const data=(new RegExp(reg)).exec(param);
				if(data) return data.groups;		
				else return ''; 
			},	
			async getMateriallist(){
				  uni.showLoading({ title: "加载中", mask: true });
				  const materialList=await this.materialFetch().catch(()=>{ uni.hideLoading()});
					this.materialList= materialList.map((mItem,i)=>({id:i,...mItem,cMatCode:mItem.matCode}))
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
				const {flowId,stationCode}=this.infoData;
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
				this.slotNoList=new Array(10).fill({}).map((mapItem,i)=>({label:`0${i+1}`,value:`0${i+1}`,active:false}));
				// param 
				this.infoData= JSON.parse(decodeURIComponent(options.param)); 
				this.materialsForm.stationCode=this.infoData.stationCode;
				const {BLine,BStationList,BMachine}=await this.dictFetch();
        const {MaterialStation:{codeSplitRule:reg}}=await this.regDictFetch();
				this.dict={lineCode:BLine,stationCode:BStationList,machineCode:BMachine,reg};		  
				await this.getMateriallist();
		},
		onUnload() {uni.$off('xwscan')},
    onShow() {
			uni.$off('xwscan') 
			uni.$on('xwscan', (res)=> {
				if(this.popupShow){
					const code=this.$u.trim(res.code.replace(/\/n/g,''));
					this.materialsForm.rawText=code;
					this.materialsConfirm(code);  
				}else{
					this.$refs.uToast.show({ title:'请选择物料', type: "error" });
				}
			})
  },
		onReady(){
				const query = uni.createSelectorQuery().in(this);
				query.select('#gap').boundingClientRect(data => {
					this.stickyTop=data.height;
				}).exec();
		},
		onPageScroll(e) {
			// let that = this;  
      if(this.stickyTop<=e.scrollTop){
				this.isSticky=true;
			}else{
				this.isSticky=false;	
			}

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
.matCode-icon{right: 10rpx;}
.info{
	.info-box{background-color:#fff; padding: 10rpx 0;}
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
