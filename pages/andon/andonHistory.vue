<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <view class="u-page">
      <view class="search-box">
        <u-form>
          <u-form-item label="时间">
            <u-row>
              <u-col span="5">
                <u-input
                  v-model="form.startDate"
                  placeholder="输入开始时间"
                  @click="handleTime"
                />
              </u-col>
              <u-col span="2">至</u-col>
              <u-col span="5">
                <u-input
                  v-model="form.endDate"
                  placeholder="输入结束时间"
                  @click="handleTime"
                />
              </u-col>
            </u-row>
          </u-form-item>
        </u-form>
        <view class="btn">
          <u-row gutter="20">
            <u-col span="6">
              <u-button @click="reset">重置</u-button>
            </u-col>
            <u-col span="6">
              <u-button type="primary" @click="BillTaskAjax">搜索</u-button>
            </u-col>
          </u-row>
        </view>
      </view>
      <!-- 搜索 -->
      <!-- <view class="bill">
        <view class="title">
          <u-section
            title="单据列表"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view class="task-list">
          <block v-for="andonItem in andonList" :key="andonItem.id">
            <view class="task-item">
              <view class="task-left">
                <view class="row">
                  <view class="col-name">产线：</view>
                  <view class="col-text">{{ andonItem.lineCode }}</view>
                </view>
                <view class="row">
                  <view class="col-name">工位：</view>
                  <view class="col-text">{{ andonItem.stationCode }}</view>
                </view>
                <view class="row">
                  <view class="col-name">事件：</view>
                  <view class="col-text">{{ andonItem.event }}</view>
                </view>

                <view class="row">
                  <view class="col-name">工单：</view>
                  <view class="col-text">{{ andonItem.orderNo }}</view>
                </view>

                <view class="row">
                  <view class="col-name">产品：</view>
                  <view class="col-text">{{ andonItem.productCode }}</view>
                </view>

                <view class="row">
                  <view class="col-name">人员:</view>
                  <view class="col-text">{{ andonItem.empCode }}</view>
                </view>
                <view class="row">
                  <view class="col-name">说明:</view>
                  <view class="col-text">{{ andonItem.description }}</view>
                </view>
              </view>
            </view>
          </block>
        </view>
        <u-empty
          v-show="!andonList.length"
          margin-top="30"
          icon-size="100"
          text="数据为空"
          mode="data"
        />
      </view> -->
      <view class="develop-list">
       <view class="title">
          <u-section
            title="单据列表"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view
          class="develop-item"
          v-for="andonItem in andonList"
          :key="andonItem.id"
        >
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
                  <text class="text">{{eventDict[andonItem.event]?eventDict[andonItem.event]:andonItem.event }}</text>
                </view>
              </view>
            </view>
            <!-- <view class="center">
              <view class="btn" @click="colseLink(andonItem.id)">关闭</view>
            </view> -->
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
                <text class="text">{{ andonItem.empCode }}</text>
              </view>
              <view class="info-item">
                <text class="name">说明:</text>
                <text class="text">{{ andonItem.description }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 列表 -->
    </view>
    <!-- page -->
    <u-calendar
      v-model="timeVisible"
      mode="medium"
      max-date="2050-01-01"
      @change="timeChange"
    />
    <!--calendar -->
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  name: "historyBill",
  data() {
    return {
      navBar: {
        title: "安灯历史",
        isBack: true,
      },
      // form
      form: {
        startDate: "",
        endDate: "",
      },
      timeVisible: false,
      // 填报列表
      customStyle: {
        height: "60rpx",
        lineHeigh: "60rpx",
      },
      andonList: [],
      // 字典
      BLineDict: {},     //产线
      BStationDict: {},  //工位
      BProductDict: {},  //产品
      SEmployeeDict: {}, //员工
      eventDict: {},
    };
  },
  computed: {
    ...mapState(["line"]),
  },
  onLoad() {
    this.reset();
    // 字典
    this.DictAjax().then(()=>this.BillTaskAjax());  
  },
  methods: {
    ...mapActions(["getDict"]),
        DictAjax() {
      return Promise.all([ this.DictionaryAjax(),this.eventDictAjax()])
    },   
    DictionaryAjax(){
      return  this.getDict({url:"/api/Dictionary",data:{keys:"BLine|BStationList|BProduct|SEmployee"}})
          .then(({ BLine,BStationList,BProduct,SEmployee }) => {
            this.BLineDict = BLine;
            this.BStationDict = BStationList;
            this.BProductDict = BProduct;
            this.SEmployeeDict = SEmployee;
          });
    },
    eventDictAjax(){
      return this.getDict({url:"/api/SDataTranslation",data:{ searchText: "P_AndonList" }})
          .then(res => 
          res.map( ({ value, label }) => this.eventDict[value] = label.toString())
          );
    },
    BillTaskAjax() {
      if (!this.form.startDate || !this.form.endDate) {
        return void this.$refs.uToast.show({ title: "请输入日期再查询" });
      }
      uni.showLoading({ title: "加载中", mask: true });
      return this.$http
        .request({
          url: "/api/PAndonList",
          method: "GET",
          data: {
            state: 0,
            lineCode: this.line[1].value,
            startDay: this.form.startDate,
            endDay: this.form.endDate,
          },
        })
        .then((res) => {
          uni.hideLoading();
          this.andonList = res.map((mapItem, i) => {
            mapItem.visible = false;
            return mapItem;
          });
        })
        .catch(() => uni.hideLoading());
    },
    // form
    reset() {
      this.form.startDate = moment().subtract(3, "days").format("YYYY-MM-DD");
      // "2021-9-1";
      this.form.endDate = moment().format("YYYY-MM-DD");
    },
    handleTime() {
      uni.hideKeyboard();
      this.timeVisible = !this.timeVisible;
    },
    timeChange(e) {
      const { startDate, endDate } = e;
      this.form.startDate = startDate;
      this.form.endDate = endDate;
    }
  },
};
</script>

<style lang="scss" scoped>
.develop-list {
  .title{
    margin: 20rpx 20rpx 10rpx 20rpx;
  }
  .bd {
    .text {color: #3333cc;}
  }
  .info-item{
    display: flex;
    .name{
      width: 85rpx;
      margin-right: 0;
      color: $font-gray;
    }
    .text{ flex: 1;word-break: break-all; }
  }
}
</style>
