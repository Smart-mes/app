<template>
	<view>
    <ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold/>
    <!-- nav -->
		<ex-box :radius="false">
				<ex-form 
				ref="bindForm"
				:borderBottom="false"
				:formOpts="formOpts"
				:isBtn="false"
				>
				<template v-slot:machineCodeRight="slotProps">
					<view class="material-w"><u-button type="info" size="mini" class="ml-20" @click="machineChange">切换</u-button></view>
				</template>
				<!-- list -->
				<template v-slot:lotNoBottom="slotProps">
					<view class="material-tip">
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="lotNoDict" :data="lotNoData"/>	
					</view>
				</template>	
				<template v-slot:feederCodeBottom="slotProps">
					<view class="material-tip" >
						<ex-describe labelWidth="60" margin="0" style="padding: 0; background-color:initial;" :lableDict="feederDict" :data="feederData">
						  <template v-slot:right="desData">
								<u-button style="margin-left: 20rpx;" v-show="!!desData.data.feederCode" size="mini" @click="unloadFetch(desData.data)">
									{{slotProps.data.lotNo===desData.data.lotNo?'卸载':'释放'}}
								</u-button>
							</template>
						</ex-describe>		
					</view>
				</template>	
				<template v-slot:bottom="slotProps">
           <view class="sanTip">
							<view v-if="!slotProps.data.lotNo">请扫描物料批次</view>
							<view v-else-if="!slotProps.data.feederCode">请扫描容器编号</view>						
					 </view>
				</template>							
			</ex-form>		
		</ex-box>
		<xw-scan/>
		<u-toast ref="uToast" />
		<view class="h-100"></view>
    <view class="fixBtn">
			<u-row gutter="20">
        <u-col span="6"><u-button type="default" @click="rejectHandle">取消</u-button></u-col>
        <u-col span="6"><u-button type="primary" @click="resetHandle"> 重置 </u-button></u-col>
      </u-row> 			
		</view>
	</view>
</template>

<script>
import { mapState ,mapMutations} from 'vuex'
import radio from '@/utils/radio.js'
export default {
    name:'MaterialRego',
    data() {
        return {
            navBar: {
                title: '物料绑定',
                isBack: true
            },
            formOpts:{
                formData:{machineCode:'',lotNo:'',feederCode:''},
                formItem:[
                    { label: '当前设备', props: 'machineCode', type: 'exInput',border: true,disabled:true,class:'disabled'},
                    { label: '物料批次', props: 'lotNo', type: 'exInput',border: true},
                    { label: '容器编号', props: 'feederCode', type: 'exInput',border: true},
                ],
                rules: {},
                event:{
                    lotNo:{
                        confirm: e=>{
                            if(e) this.lotNoHandle(e)
                        },
                        input:e=>{
                            if(!e){
                                this.clearLotNo()
								  this.clearFeeder()
                                this.$refs.bindForm.formData.feederCode=''		
                            }
						 }	
                    },
                    feederCode:{
                        confirm:async e=>{
                            if(e) this.feederHandle(e)
                        },
                        input:e=>{
                            if(!e) this.clearFeeder()
						 }
                    }
                },			
            },
            stationCode:'',
            //批次
            lotNoDict:{lotNo:'批次',matCode:'料号',lotQty:'数量'},
            lotNoData:{},
            feederDict:{feederCode:'飞达编号', lotNo:'物料批次',qty:'装载数量'},
            feederData:{}
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    methods: {
        ...mapMutations(['clear_storage']),
        toast(type,msg){
            this.$refs.uToast.show({title:msg,type,position:'bottom'})
        },
        errorTip(msg){
            uni.vibrateLong({
                success: ()=>this.toast('error',msg)					
            })	
        },
        successTip(msg){
            radio.play_ding_success()
            this.toast('success',msg)		
        },
        async lotNoHandle(e){
            const res=await this.lotNoFetch(e)
            if(res.length){
                this.lotNoData=res[0]
                if(res[0].state===1){							
                    const {lotNo}=this.$refs.bindForm.formData			
                    await	this.getFeederData({lotNo})
                    if(this.feederData.feederCode){
                        this.toast('warning',`当前批次已被绑定于:${this.feederData.feederCode}`)	
                        this.$refs.bindForm.formData.feederCode=this.feederData.feederCode	 								 
                    }else{
                        this.errorTip('物料不是闲置状态') 
                    }						 								
                }
            }else{
						  this.$refs.bindForm.formData.lotNo=''
                this.clearLotNo()
						  this.clearFeeder()
                this.errorTip(`${e}-没有注册`) 		
            }		
        },
        async feederHandle(e){
            const toolList=await this.BWorkToolFetch(e)	
            if(toolList.length){
                const {feederCode}=this.$refs.bindForm.formData
                const feederList=await this.getFeederData({feederCode})		
                if(!feederList.length){
				  	await	this.installFetch()
					  await	this.resetHandle()			
                }else{
                    this.toast('warning',`${e}容器已经绑定${this.feederData.lotNo}`) 	
                } 					
            }else{
                this.errorTip('容器不存在') 
                this.$refs.bindForm.formData.feederCode=''
                this.clearFeeder()
            }
        },
        machineChange(){
            this.clear_storage('stationCode')
            uni.reLaunch({ url:'/pages/index/index' })
        },
        async getFeederData(parame,isFeeder=true){
            const feederList=await this.feederFetch(parame) 
            if(feederList.length&&isFeeder){
                this.feederData=feederList[0]             
            }
            return feederList
        },
        async installFetch(){
            const {code,message}= await this.$http.request({
                url: '/api/MaterialInFeeder/Install',
                method: 'POST',
                data: {
                    stationCode:this.stationCode,
                    empCode:this.userInfo.empCode,
                    ...this.$refs.bindForm.formData,
                    isAppend:false 
                }
				  }) 
            if(code==='OK'){
                this.successTip(message)	
            }else{
                this.errorTip(message)						
            }	
        },
        async unloadFetch({feederCode, lotNo}){
            const bindForm=this.$refs.bindForm.formData			
            await	this.$http.request({
                url: '/api/MaterialInFeeder/Uninstall',
                method: 'POST',
                data: {
                    stationCode:this.stationCode,
                    empCode:this.userInfo.empCode,
                    feederCode,
                    lotNo,
                    qty:this.feederData.qty
                }
			  }).then(()=>{
                const msg=bindForm.lotNo===this.feederData.lotNo?'卸载成功':'释放成功'				
                this.successTip(msg)	
            })
            await this.clearFeeder()	
            bindForm.feederCode=''			
        },
        rejectHandle(){
            const {lotNo,feederCode}=this.$refs.bindForm.formData
            if(feederCode){
                this.$refs.bindForm.formData.feederCode=''
                return void this.clearFeeder()         
            }		
            if(lotNo){
                this.$refs.bindForm.formData.lotNo=''
                return void this.clearLotNo()       
            }
        },
        resetHandle(){
            this.$refs.bindForm.clear()
            this.clearLotNo()
            this.clearFeeder()
        },
        clearLotNo(){
            this.lotNoData={}
        },
        clearFeeder(){
            this.feederData={}
        },
        BStationFetch(stationCode){
            return this.$http.request({url: '/api/BStationList',method: 'GET',data: {stationCode}}) 
        },
        lotNoFetch(lotNo){
            return this.$http.request({url: '/api/PMaterialWip',method: 'GET',data: {lotNo}}) 
        },
        BWorkToolFetch(feederCode){
            return this.$http.request({url: '/api/BWorkTool',method: 'GET',data: {workToolCode:feederCode}}) 
        },
        feederFetch(parame){
            return this.$http.request({url: '/api/MaterialInFeeder',method: 'GET',data: {...parame,stationCode:this.stationCode}}) 
        },
    },
    async onLoad({stationCode}){
        this.stationCode=stationCode
        const res =await this.BStationFetch(stationCode)
        if(res.length){
            const [{machineCode}]=res
            this.formOpts.formData.machineCode=machineCode
            this.$refs.bindForm.setData({machineCode})			
        }
    },
    onUnload() {   
		   uni.$off('xwscan')
    },
    onShow() {
        uni.$off('xwscan') 
        uni.$on('xwscan', res=> {
            const code=this.$u.trim(res.code.replace(/\/n/g,''))
            const bindForm=this.$refs.bindForm
            const {lotNo,feederCode}=bindForm.formData
            if(!lotNo){
                bindForm.formData.lotNo=code
                return void this.lotNoHandle(code)	
            }
            if(!feederCode){
                bindForm.formData.feederCode=code
                return void this.feederHandle(code)
            }
        })
    },
}
</script>

<style lang="scss" scoped>
</style>
