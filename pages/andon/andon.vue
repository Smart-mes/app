<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack"  title-bold>
      <view class="navbar-right" slot="navbarRight">
        <view class="navbar-info">
          <view class="info-item" @click="createLink">登记</view>
          <view class="info-item" @click="historyLink">历史</view>
        </view>     
      </view>
    </navBar>  
    <!-- navBar -->
    <view class="u-page">
      <!-- 搜索 -->      
      <view class="develop-list">
        <view class="develop-item" v-for="(andonItem,i) in andonList" :key="andonItem.id">
          <view class="hd">
            <view class="left">
              <view class="info">
                <view  class="info-item">
                  <text class="name">产线：</text>
                  <text class="text"> {{ BLineDict[andonItem.lineCode] }}</text>
                </view>
                <view  class="info-item">
                  <text class="name">工位：</text>
                  <text class="text">{{BStationDict[andonItem.stationCode]}}</text>
                </view>
                <view  class="info-item">
                  <text class="name">事件：</text>
                  <text class="text">{{eventDict[andonItem.event] }}</text>
                </view>
              </view>
            </view>
            <view class="center">
              <view class="btn" @click="closeHandle(i)">关闭</view>
            </view>
            <view class="right">
              <u-icon :name="andonItem.visible ? 'arrow-up-fill' : 'arrow-down-fill'" color="#ccc"	size="22" @tap="andonItem.visible=!andonItem.visible" />
            </view>
          </view>
          <view class="bd" v-show="andonItem.visible">
            <u-line color="#ddd" margin="10rpx 0" />
            <view class="info">
              <view class="info-item">
                <text class="name">工单：</text>
                <text class="text">{{ andonItem.orderNo }}</text>
              </view>
              <view class="info-item">
                <text class="name">产品：</text>
                <text class="text">{{ BProductDict[andonItem.productCode]}}</text>
              </view>
              <view class="info-item">
                <text class="name">人员:</text>
                <text class="text">{{SEmployeeDict[andonItem.empCode]}}</text>
              </view>
              <view class="info-item">
                <text class="name">说明:</text>
                <text class="text">{{ andonItem.description }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- page -->
    <u-modal
      ref="modal"
      width="95%"
      show-cancel-button
      title="关闭安灯"
      v-model="modelShow"
      :async-close="true"
      @cancel="modalCancel"
      @confirm="modalConfirm"
    >
      <view class="slot-content">
        <customForm
          ref="modalForm"
          buttonHide
          :form="andon.formData"
          :formList="andon.formList"
          :rules="andon.rules"
        />
        <!-- @getFormData="getFormData" -->
      </view>  
    </u-modal>
    <!-- modal -->
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { mapState } from "vuex";
import andon from "@/models/Forms/andon/andon.js";
export default {
  name:"Andon",
  data() {
    return {
      navBar: {title: "安灯管理",isBack: true},
      // form: {desc: ""},
      // show: false,
      andon,
      currentInex:0,
      andonList: [],
      // 字典
      BLineDict: {},     //产线
      BStationDict: {},  //工位
      BProductDict: {},  //产品
      SEmployeeDict: {}, //员工
      eventDict: {},
      // modelShow
      modelShow:false
    };
  },
  computed: {
    ...mapState(["line"])
  },
  onLoad() {
    // 字典
    this.dictAjax();
    this.eventDictAjax();
  },
  onReady(){
    this.andonAjax();
  },
  methods: {
    dictAjax(){
       return this.$http.request({
        url: "/api/Dictionary",
        method: "GET",
        data: {keys:"BLine|BStationList|BProduct|SEmployee"},
      })
       .then(({ BLine,BStationList,BProduct,SEmployee }) => {
          this.BLineDict = BLine;
          this.BStationDict = BStationList;
          this.BProductDict = BProduct;
          this.SEmployeeDict = SEmployee;
        });
    },
    eventDictAjax(){
      return this.$http.request({
        url:"/api/SDataTranslation",
        method: "GET",
        data:{ searchText: "P_AndonList" }
        })
        .then(res => res.map( ({ value, label }) => this.eventDict[value] = label.toString()));
    },
    // //获取数据
    andonAjax() {
      uni.showLoading({ title: "加载中", mask: true });
      return this.$http
        .request({
          url: "/api/PAndonList",
          method: "GET",
          data: { lineCode: this.line[1].value, state: 1},
        })
        .then((res) => {
          uni.hideLoading();
          this.andonList = res.map((mapItem, i) => {
            return {...mapItem,visible:!i};
          });
        })
        .catch(() => uni.hideLoading());
    },
    createLink() {
      uni.navigateTo({ url: "/pages/andon/addAndon" });
    },
    historyLink(){
       uni.navigateTo({ url: "/pages/andon/andonHistory"});
    },
    // colseLink(id){
    //   uni.navigateTo({url: `/pages/andon/closeAndon?id=${id}`});
    // },
    // form
    closeHandle(i){
      console.log(this.andonList[i])
      this.currentInex=i;
      this.modelShow=true;
      const formData= this.andon.formData;
      const {lineCode,stationCode,event}=this.andonList[i];
     
      formData.lineCode=this.BLineDict[lineCode]
      formData.stationCode=this.BStationDict[stationCode]
      formData.event=this.eventDict[event]   
      // console.log('index:', this.andonList[i])
    },
    modalConfirm(){
      this.$refs.modalForm.validateForm().then(valid => {
           if (!valid) {return void this.$refs.modal.clearLoading()};
           this.closeAndonAjax();
      });
    },
    modalCancel(){
      this.modelShow = false;
    },
    clearLoading(){
      this.$refs.modal.clearLoading()
    },
    closeAndonAjax(){
      this.$http.request({
         url: `/api/PAndonList/${this.andonList[this.currentInex].id}`,
         method: "PUT", 
         data:{
           ...this.andonList[this.currentInex],
           state:0,
           closeComment:this.andon.formData.closeComment
         }
       })
			 .then(()=>{
         console.log('答应')
         console.log('this:',this)
         this.clearLoading();
         this.$refs.uToast.show({ title: "提交成功",type: "success"});
         this.modelShow = false;
         this.andonAjax();
       })
       .catch(()=>{
         this.clearLoading()
       })
    }
  },
};
</script>
<style lang="scss" scoped>
.develop-list {
  .center {margin: 0 10rpx;}
  .right{margin-left: 15rpx; }
  .btn {
    margin-top: 20rpx;
    width: 100rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    color: $red-color;
    border: 1px solid $red-color;
    border-radius: 50%;
  }
  .bd {
    .text {color: #3333cc;}
  }
  .info-item{
    display: flex;
    .name{
      width: 85rpx;
      margin-right: 0;
      color:$font-light-gray;
    }
    .text{ flex: 1;word-break: break-all; }
  }
}
.slot-content { padding: 0 30rpx;}
</style>
