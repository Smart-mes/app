<template>
  <view id="passRate">
    <u-navbar
      :title="navbar.title"
      :is-back="navbar.isBack"
      :title-color="navbar.color"
      :title-size="navbar.size"
      :height="navbar.height"
      :background="navbar.background"
      title-bold
    />
    <!-- nav -->
    <view class="u-page">
      <view class="search-box">
        <view>
          <u-form label-width="100" :model="form">
            <u-form-item label="车间">
              <u-input v-model="form.ws" type="select" @click="wsShow = true" />
            </u-form-item>
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
                <u-button size="medium" @click="clear">清空</u-button>
              </u-col>
              <u-col span="6">
                <u-button type="primary" size="medium" @click="search"
                  >查询</u-button
                >
              </u-col>
            </u-row>
          </view>
        </view>
      </view>
      <!-- 搜索 -->
      <view class="chart-box">
        <view class="chart-title">
          <u-section
            title="计划达成率图"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view class="charts-bd">
          <view v-show="chartsData.categories.length" class="charts-bar">
            <qiun-data-charts
              type="bar"
              :opts="{
                dataLabel: false,
                xAxis: { max: 70 },
                extra: { bar: { type: 'stack' } },
              }"
              :chartData="chartsData"
              :reshow="!!chartsData.categories.length"
            />
          </view>
          <u-empty
            v-show="!chartsData.categories.length"
            margin-top="30"
            icon-size="100"
            text="数据为空"
            mode="data"
          />
        </view>
      </view>
      <!--饼图-->
    </view>
    <u-action-sheet
      :list="wsList"
      :cancel-btn="true"
      v-model="wsShow"
      @click="wsSheetClick"
      @close="wsClose"    
    />
    <!-- sheet -->
    <u-calendar
      v-model="timeVisible"
      mode="medium"
      max-date="2050-01-01" 
      @change="timeChange"
    />
    <!--calendar -->
  </view>
</template>

<script>
// import { mapState } from "vuex";
export default {
  name:"PAR",
  data() {
    return {
      navbar: {
        title: "计划达成率",
        isBack: true,
        color: "#333",
        size: "36",
        height: "50",
        background: { backgroundColor: "#ffffff" },
      },
      form: {
        ws: "1车间",
        startDate: "2019-4-5",
        endDate: "2021-7-14",
      },
      wsShow: false,
      timeVisible: false,
      //bar
      chartsData: {
        categories: [],
        series: [
          {
            name: "完成数",
            data: [],
          },
          {
            name: "未完成数",
            data: [],
          },
        ],
      },
      opts: {
        fontSize: 12,
        color: ["#1890FF", "#91CB74"],
      },
      workShopList:[]
    };
  },
  computed: {
    // ...mapState(["workShopList"]),
    wsDict() {
      const obj = {};
      this.workShopList.forEach(({ wsName, wsCode }) => (obj[wsName] = wsCode));
      return obj;
    },
    wsList() {
      return this.workShopList.map(({ wsName: text, wsCode }) => {
        return { text, wsCode };
      });
    },
  },
  onLoad(){
   this.BWorkShopAjax();
  },
  methods: {
    wsSheetClick(i) {
      const { text, wsCode } = this.wsList[i];
      this.form.ws = text;
    },
    wsClose() {
      this.form.ws = "";
      this.BLList = [];
    },
    clear() {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
      this.BLList = [];
    },
    handleTime() {
      uni.hideKeyboard();
      this.timeVisible = !this.timeVisible;
    },
    timeChange(e) {
      const { startDate, endDate } = e;
      this.form.startDate = startDate;
      this.form.endDate = endDate;
    },
    search() {
      this.clearChartsData();
      const { ws, startDate, endDate } = this.form;
      this.$http
        .request({
          url: "/api/ProduceReport/PAR",
          method: "GET",
          data: {
            wsCode: this.wsDict[ws],
            startDate: "",
            endDate: "",
          },
        })
        .then((data) => {
          data.forEach(({ orderNo, planQty, cpltQty }) => {
            let surplus = planQty - cpltQty;
            surplus = surplus < 0 ? 0 : surplus;

            this.chartsData.categories.push(orderNo);
            this.chartsData.series[0].data.push(cpltQty);
            this.chartsData.series[1].data.push(surplus);
          });
        });
    },
    clearChartsData() {
      this.chartsData.categories = [];
      this.chartsData.series[0].data = [];
      this.chartsData.series[1].data = [];
    },
    BWorkShopAjax(){
        this.$http.request({url: "/api/BWorkShop",method: "GET"}).then(res=>this.workShopList=res)
    }
  },
};
</script>

<style lang="scss" scoped>
#passRate {
  overflow: hidden;
}
.charts-bar,
.charts-bd {
  margin-top: 20rpx;
  width: 730rpx;
  height: 600rpx;
  background: $white-color;
}
.charts-bar {
  margin-top: 0;
}
</style>
