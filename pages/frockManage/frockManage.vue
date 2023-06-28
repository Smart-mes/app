<template>
	<view>
		<ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold />
		  <!--desc -->
			<ex-describe :lableDict="basicLabelDict" :data="basicData"/>
			<!--list -->
			<ex-list borderTop title="容器绑定批次" :lableDict="cDict" :data="cList">
				<template v-slot:right="slotProps">
						<u-icon
						class="operate-del"
						name="close"
						size="30"
						color="#fff"
						@click="bindHandle(slotProps.data)"
					/>	
				</template>
			</ex-list>
			<!-- btn -->
			<view class="btnfix w-full">
					<u-row gutter="20">
						<u-col span="6">
							<u-button type="primary" @click="bindShow=!bindShow">绑定</u-button>
						</u-col>
						<u-col span="6">
							<u-button type="primary" plain @click="allBindHandle">全部解绑</u-button>
						</u-col>
					</u-row>					
			</view>
			<view class="h-120"/>
	  <!-- 弹窗 -->
		<u-popup v-model="bindShow" mode="bottom" closeable>
			<customForm 
			  ref="bindForm"
				class="customForm"
				:rules="rules"
				:form="formData"
				:formList="formList"  
				:loading="btnLoading"  
				@getFormData="getFormData"/>
		</u-popup>
		<u-action-sheet :list="sheetList" v-model="sheetShow"  @click="handleSheet" />
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { mapState } from "vuex";
	export default {
		name:'FrockManage',
		data() {
			return {
				navBar: { title:'工站物料', isBack: true},
				basicLabelDict:{containerCode:'容器编号',containerName:'容器名称',description:'备注'},
				basicData:{},
				cDict:{containerCode:'容器编号',sfc:'生产批次',empCode:'员工编号',inputTime:'绑定时间'},
				cId:0,
				cList:[],
				bindShow:false,
				// form
				btnLoading:false,
				formData:{containerCode:'',sfc:''},
				formList:[
				{ label: "容器编号", props: "containerCode", type: "input",disabled: true },
				{ label: "生产批次", props: "sfc", type: "input"},
				],
				rules: {
					containerCode: [{ required: true,message: "不能为空", trigger: "blur,change"}],
					sfc: [{ required: true,message: "不能为空", trigger: "blur,change"}],
				},
				sheetShow:false,
				sheetList:[
					{text: '删除',color: 'red',active:false}
				],								
			}
		},
		methods: {
			bindHandle({id}){
		    this.cId=id;
				this.sheetShow=true;
			},
			async allBindHandle(){
				await this.unBindFecht({containerCode:this.basicData.containerCode,sfc:''});
				this.$refs.uToast.show({title: "所有解绑成功",type: "success"});
				this.cListFetch();
			},
		  async handleSheet(){
				const {containerCode,sfc}=this.cList.find(cItem=>cItem.id===this.cId);
				await this.unBindFecht({containerCode,sfc});
				this.$refs.uToast.show({title: "解绑成功",type: "success"});
        this.cListFetch();
			},
			getFormData(formData){
				this.btnLoading=true;
        this.bindFetch(formData).then(()=>{
					this.bindShow=false;
					this.btnLoading=false;
					this.$refs.bindForm.resetForm();
					this.cListFetch();
				})
				.catch(()=>this.btnLoading=false); 			
			},
			async cListFetch(){
				uni.showLoading({ title: "加载中", mask: true });
				this.cList=await this.$http.request({
				 url: '/api/BContainer/Sfc',
				 method: "GET", 
				 data: {containerCode:this.basicData.containerCode}
	    	}).catch( () => uni.hideLoading());
				uni.hideLoading();
			},
			bindFetch(formData){
				return this.$http.request({ 
					url: "/api/Container/Bind", 
					method: "POST", 
					data: {...formData,empCode:this.userInfo.empCode}
			 })
			},
			unBindFecht(param){
				return this.$http.request({ 
					url: "/api/Container/UnBind", 
					method: "POST", 
					data:param
			 })
			},
		},
		computed: {
    ...mapState(["userInfo"]),
    },		
		onLoad(options){
		this.basicData=JSON.parse(decodeURIComponent(options.param));
		this.formData.containerCode=this.basicData.containerCode;
		this.cListFetch();
	 },
	 async onPullDownRefresh(){
		await this.cListFetch().catch(()=> uni.stopPullDownRefresh());
		uni.stopPullDownRefresh();
	
	 },
	}
</script>

<style lang="scss" scoped>
.customForm{padding: 60rpx 40rpx 40rpx 40rpx;}

</style>
