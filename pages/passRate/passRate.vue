<template>
  <view class="passRate-page">
    <ex-TnavBar  :title="navBar.title" :is-back="navBar.isBack" title-bold />
    <!-- nav -->
    <view class="u-page">
      <view class="search-box">
        <view>
          <u-form ref="searchForm"  label-width="100" :model="form">
            <u-form-item label="车间" prop="ws">
              <u-input v-model="form.ws" type="select" @click="wsShow = true" />
            </u-form-item>
            <u-form-item label="产线" prop="line">
              <u-input
                v-model="form.line"
                type="select"
                @click="BLShow = true"
              />
            </u-form-item>
           
              <u-row>
                <u-col span="6">
                  <u-form-item label="时间" prop="startDate">
                  <u-input
                    v-model="form.startDate"
                    placeholder="输入开始时间"
                    @click="handleTime"
                  />
                </u-form-item>
                </u-col>
                <!-- <u-col span="2">至</u-col> -->
                <u-col span="6">
                  <u-form-item label="时间"  prop="endDate">
                  <u-input
                    v-model="form.endDate"
                    placeholder="输入结束时间"
                    @click="handleTime"
                  />
                </u-form-item>
                </u-col>
              </u-row>
           
          </u-form>
          <view class="btn">
            <u-row gutter="20">
              <u-col span="6">
                <u-button @click="clear">清空</u-button>
              </u-col>
              <u-col span="6">
                <u-button type="primary" @click="search">查询</u-button>
              </u-col>
            </u-row>
          </view>
        </view>
      </view>
      <!-- 搜索 -->
      <view class="chart-box">
        <view class="chart-title">
          <u-section
            title="设备效率图"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view class="charts-bd">
          <view class="charts-pie" v-show="!!chartData.series[0].data.length">
            <qiun-data-charts
              animation
              type="pie"
              background="none"
              :chartData="chartData"
              :opts="opts"
              :reshow="!!chartData.series[0].data.length"
            />
          </view>
          <u-empty
            v-show="!chartData.series[0].data.length"
            margin-top="30"
            icon-size="100"
            text="数据为空"
            mode="data"
          />
        </view>
      </view>
      <!--饼图-->
    </view>
    <u-picker 
        range-key="text" 
        mode="selector"
        v-model="wsShow" 
        :range="wsList" 
        :default-selector="wsSelector"
        @confirm="wsConfirm"
      />
      <u-picker 
        range-key="text" 
        mode="selector"
        v-model="BLShow" 
        :range="BLList" 
        :default-selector="BLSelector"
        @confirm="BLConfirm"
      />
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
import { mapState } from "vuex";
export default {
  name:"PassRate",
  data() {
    return {
      navBar: {
        title: "直通率",
        isBack: true,
      },
      form: {
        ws: "",
        line: "",
        startDate: "2019-4-5",
        endDate: "2021-7-14",
      },
      BLList: [],
      wsShow: false,
      BLShow: false,
      timeVisible: false,
      //select
      wsSelector:[0],
      BLSelector:[0],
      //pie
      chartData: { series: [{ data: [], format: "pieTip" }] },
      opts: { color: ["#1890FF", "#91CB74"] },
      workShopList:[]
    };
  },
  computed: {
    ...mapState({ 
      line: state => state.line[0]
    }),
    wsDict() {
      const obj = {};
      this.workShopList.forEach(({ wsName, wsCode }) => (obj[wsName] = wsCode));
      return obj;
    },
    BLDict() {
      const obj = {};
      this.BLList.forEach(({ text, lineCode }) => (obj[text] = lineCode));
      return obj;
    },
    wsList() {
      return this.workShopList.map(({ wsName: text, wsCode }) => {
        return { text, wsCode };
      });
    },
  },
  onLoad(){
   this.BWorkShopAjax().then(()=>{this.init()});
  },
  methods: {
    init(){
      const i=this.getWSindex();
      this.form.ws=this.line.label;
      this.wsSelector=i;
      this.wsConfirm(i)
    },
    getWSindex(){
      const i= this.wsList.findIndex(({text})=>(text===this.line.label))
      return [i===-1?0:i]
    },
    wsConfirm([i]){
      // 清空
      this.BLSelector=[0];
      this.BLList=[];
      this.form.line='';   
      // 赋值
      this.wsSelector=[i];
      this.form.ws=this.wsList[i].text;
      this.BLFetch(this.wsList[i].wsCode);
    },
    BLConfirm([i]){
      this.BLSelector=[i];
      this.form.line=this.BLList[i].text;    
    },    
    BLFetch(wsCode) {
      this.$http
        .request({
          url: "/api/BLine",
          method: "GET",
          data: { wsCode },
        })
        .then(
          (data) =>
            (this.BLList = data.map(({ lineName: text, lineCode }) => {
              return { text, lineCode };
            }))
        );
    },
    clear() {
      this.$refs.searchForm.resetFields();
      // Object.keys(this.form).forEach((key) => (this.form[key] = ""));
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
      const { ws, line, startDate, endDate } = this.form;
      this.$http
        .request({
          url: "/api/ProduceReport/FPY",
          method: "GET",
          data: {
            wsCode: this.wsDict[ws],
            lineCode: this.BLDict[line] ? this.BLDict[line] : "",
            startDate: "",
            endDate: "",
          },
        })
        .then((data) => {
          const list = [];
          for (const [key, value] of Object.entries(data)) {
            list.push({ name: key === "a" ? "优良品" : "其他", value });
          }
          this.chartData.series[0].data = list;
        });
    },
    BWorkShopAjax(){
      return  this.$http.request({url: "/api/BWorkShop",method: "GET"}).then(res=>this.workShopList=res)
    }
  },
};
</script>

<style lang="scss" scoped>
.passRate-page {
  overflow: hidden;
}
.charts-pie,
.charts-bd {
  margin-top: 20rpx;
  width: 730rpx;
  height: 500rpx;
  background: $white-color;
}
.charts-pie {
  margin-top: 0;
}
</style>
