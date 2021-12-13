<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack">
      <view class="navbar-right" slot="navbarRight">
        <view class="navbar-icon">
          <u-icon
            class="icon-item"
            name="plus-circle"
            color="#666"
            size="45"
            @click="addLink"
          />
        </view>
      </view>
    </navBar>
    <!-- navBar -->
    <view class="u-page">
      <view class="develop-list">
        <view
          class="develop-item"
          v-for="(andonItem, key) in andonList"
          :key="key"
        >
          <view class="hd">
            <view class="left">
              <view class="info">
                <view>
                  <text class="name">产线：</text>
                  <text class="text"> {{ BLineDict[andonItem.lineCode] }}</text>
                </view>
                <view>
                  <text class="name">工位：</text>
                  <text class="text">{{BStationDict[andonItem.stationCode]}}</text>
                </view>
                <view>
                  <text class="name">事件：</text>
                  <text class="text">{{eventDict[andonItem.event]?eventDict[andonItem.event]:andonItem.event }}</text>
                </view>
              </view>
            </view>
            <view class="center">
              <view class="btn" @click="colseLink(andonItem)">关闭</view>
            </view>
            <view class="right">
              <u-icon :name="andonItem.visible ? 'arrow-up-fill' : 'arrow-down-fill'" color="#ccc"	size="22" @tap="andonItem.visible=!andonItem.visible" />
            </view>
          </view>
          <view class="bd" v-show="andonItem.visible">
            <u-line color="#ddd" margin="10rpx 0" />
            <view class="info">
              <view>
                <text class="name">工单：</text>
                <text class="text">{{ andonItem.orderNo }}</text>
              </view>
              <view>
                <text class="name">产品：</text>
                <text class="text">{{ BProductDict[andonItem.productCode]}}</text>
              </view>
              <view>
                <text class="name">人员:</text>
                <text class="text">{{ andonItem.empCode }}</text>
              </view>
              <view>
                <text class="name">说明:</text>
                <text class="text">{{ andonItem.description }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- page -->
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      navBar: {
        title: "安灯管理",
        isBack: true,
      },
      form: {
        desc: "",
      },
      andonList: [],
      show: false,
      // 字典
      BLineDict: {}, //产线
      BStationDict: {}, //工位
      BProductDict: {}, //产品
      SEmployeeDict: {}, //员工
      eventDict: {},
    };
  },
  computed: {},
  onLoad() {
    // 字典
    this.DictAjax().then(()=>this.andonAjax())
  
  },
  methods: {
    ...mapActions(["getDict"]),
    DictAjax() {
      return Promise.all([ 
          this.getDict({url:"/api/Dictionary",parame:{keys:"BLine|BStationList|BProduct|SEmployee"}})
          .then(({ BLine,BStationList,BProduct,SEmployee }) => {
            this.BLineDict = BLine;
            this.BStationDict = BStationList;
            this.BProductDict = BProduct;
            this.SEmployeeDict = SEmployee;
          }),



          this.getDict({url:"/api/SDataTranslation",parame:{ searchText: "P_AndonList" }})
          .then((res) => res.map( ({ value, label }) => this.eventDict[value] = label.toString())),
      ])
    },
    // //获取数据
    andonAjax() {
      // console.log('进去请求');
      uni.showLoading({ title: "加载中", mask: true });
      return this.$http
        .request({
          url: "/api/PAndonList",
          method: "GET",
          data: { state: 1 },
        })
        .then((res) => {
          uni.hideLoading();
          this.andonList = res.map((mapItem, i) => {
            mapItem.visible = i===0;
            return mapItem;
          });
        })
        .catch(() => {
          uni.hideLoading();
        });
    },
    addLink() {
      uni.navigateTo({ url: "/pages/andon/addAndon" });
    },
    colseLink(andonItem){
      const andon=JSON.stringify(andonItem);
      uni.navigateTo({
        url: `/pages/andon/closeAndon?andon=${andon}`,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.develop-list {
  .center {
    margin: 0 10rpx;
  }
  .right{
    margin-left: 15rpx;
   
  }
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
    .text {
      color: #3333cc;
    }
  }
}
</style>
