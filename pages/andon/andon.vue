<template>
  <view>
    <ex-TnavBar :title="navBar.title" :is-back="navBar.isBack"  title-bold>
      <view class="navbar-right" slot="right">
        <view class="navbar-info">
          <view class="info-item" @click="createLink">登记</view>
          <view class="info-item" @click="historyLink">历史</view>
        </view>     
      </view>
    </ex-TnavBar>  
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
                <view  class="info-item">
                  <text class="name">工单：</text>
                  <text class="text"> {{ andonItem.orderNo }}</text>
                </view>
                <view  class="info-item">
                  <text class="name">产品：</text>
                  <text class="text">{{ BProductDict[andonItem.productCode]}}</text>
                </view>
                <view  class="info-item">
                  <text class="name">人员：</text>
                  <text class="text">{{SEmployeeDict[andonItem.empCode]}}</text>
                </view>
                <view  class="info-item">
                  <text class="name">说明：</text>
                  <text class="text">{{ andonItem.description }}</text>
                </view>               
              </view>
          </view>
        </view>
      </view>
    </view>
    <!-- page -->
    <u-popup v-model="popupShow"  mode="bottom" closeable close-icon-pos="top-left" @close="popupClose">
      <view class="m-30">
        <customForm
          ref="modalForm"
          :form="andon.formData"
          :formList="andon.formList"
          :rules="andon.rules"
          @getFormData="getFormData"
        />        
      </view>
		</u-popup>

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
      andon,
      currentInex:0,
      andonList: [],
      // 字典
      BLineDict: {},     //产线
      BStationDict: {},  //工位
      BProductDict: {},  //产品
      SEmployeeDict: {}, //员工
      eventDict: {},
      // popupShow
      popupShow:false
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
    // form
    closeHandle(i){
      const andonForm= this.andon.formData;
      const {lineCode,stationCode,event}=this.andonList[i];

      this.currentInex=i;
      this.popupShow=true;
      andonForm.lineCode=this.BLineDict[lineCode]
      andonForm.stationCode=this.BStationDict[stationCode]
      andonForm.event=this.eventDict[event]   
    },
    popupClose(){
      this.$refs.modalForm.resetForm();
    },
    async getFormData(){
      await this.closeAndonAjax();
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
         this.$refs.uToast.show({ title: "提交成功",type: "success"});
         this.popupShow = false;
         this.andonAjax();
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
      margin-right: 20rpx;
      width: 85rpx;
      text-align: right;
      color:$font-light-gray;
    }
    .text{ flex: 1;word-break: break-all; }
  }
}
// .slot-content { padding: 0 30rpx;}
.m-30{margin: 60rpx 30rpx;}
</style>
