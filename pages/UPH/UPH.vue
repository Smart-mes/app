<template>
  <view class="UPH-page ">
     <ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold/>
    <!-- nav -->
    <view class="u-page">
      <view class="search-box">
        <u-form ref="searchForm" label-width="100" :model="form" >
          <u-form-item label="车间" prop="ws">
            <u-input v-model="form.ws" type="select" @click="()=>wsShow=true"/>
          </u-form-item>
          <u-form-item label="产线"  prop="line">
            <u-input v-model="form.line" type="select" @click="()=>BLShow = true" />
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
              <u-col span="6">
                <u-form-item label="至"  prop="endDate">
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
              <u-button  @click="clear">清空</u-button>
            </u-col>
            <u-col span="6">
              <u-button type="primary"  @click="search">查询</u-button>
            </u-col>
          </u-row>
        </view>
      </view>
      <!-- 搜索 -->
      <view class="chart-box">
        <view class="chart-title">
          <u-section
            title="每小时产量图"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view class="charts-bd">
          <view class="charts-line" v-show="chartData.series[0] !== null">
            <qiun-data-charts
              type="line"
              :echartsH5="true"
              :echartsApp="true"
              :eopts="eopts"
              :chartData="chartData"
              :reshow="chartData.series[0] !== null"
            />
          </view>
          <u-empty
            v-show="chartData.series[0] === null"
            margin-top="30"
            icon-size="100"
            text="数据为空"
            mode="data"
          />
        </view>
      </view>
      <!--饼图-->
    </view>
     <!-- sheet -->
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
      max-year="2050" 
      @change="timeChange"
    />
    <!--calendar -->
  </view>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  name:"UPH",
  data() {
    return {
      navBar: {
        title: "每小时产量",
        isBack: true,
      },
      form: {
        ws: "",
        line: "",
        startDate: "2019-1-1",
        endDate: "2023-3-1",
      },
     //select
      wsSelector:[0],
      BLSelector:[0],
      wsShow: false,
      BLShow: false,
      BLList: [],
      timeVisible: false,
      //pie
      chartData: { series: [null] },
      eopts: {
        notMerge: true,
        grid: { top: 10, left: 40, right: 30, bottom: 60 },
        xAxis: { type: "time" },
      },
      // 工序
      procedureList: [],
      workShopList:[]
    };
  },
  computed: {
    ...mapState({ 
      line: state => state.line[0]
    }),   
    wsDict() {
      return this.workShopList.reduce((obj,{ wsName, wsCode })=> {
         obj[wsName] = wsCode
          return obj
      },{})  
    },
    BLDict() {
      return this.BLList.reduce((obj,{ text, lineCode  }, )=> {
          obj[text] = lineCode
          return obj
      },{})        
    },
    wsList() {
      return this.workShopList.map(({ wsName: text, wsCode }) => {
        return { text, wsCode };
      });
    },
    procedureDict() {
      return this.procedureList.reduce((obj,{ processCode, processName })=> {
          obj[processCode] = processName
          return obj
      },{})       
    },
  },
  onLoad() {
    this.procedureFetch();
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
      this.$http.request({
          url: "/api/BLine",
          method: "GET",
          data: { wsCode },
        })
        .then((data) =>
            this.BLList = data.map(({ lineName: text, lineCode }) =>({ text, lineCode }))
        );
    },
    clear() {
      this.$refs.searchForm.resetFields();
      this.BLList = [];
      // this.init();
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
          url: "/api/ProduceReport/UPH",
          method: "GET",
          data: {
            wsCode: this.wsDict[ws],
            lineCode: this.BLDict[line],
            processCode: "",
            startDate:startDate,
            endDate: endDate,
          }
        })
        .then((data) => {
            if (!data.length) {
              this.chartData.series = [null];
            }else{            
              const dataList = data
                .map((item) => {
                  item.date = new Date(item.date);
                  item.name = this.procedureDict[item.processCode];
                  item.time = +item.date;
                  return item;
                })
                .sort((a, b) => a.date - b.date);

              const maxTime = Math.max(...dataList.map((x) => x.date));
              const maxDate = new Date(maxTime);
              const preDate = new Date(maxTime - 1000 * 60 * 60 * 24);

             const dataDict= dataList
                .filter(({ date }) => preDate <= date && date <= maxDate)
                .reduce((obj,{ name, time, qty  })=> {
                    if (!obj[name]) {obj[name] = []}
                    obj[name].push([time, qty]);
                    return obj
                  },{})     

              this.chartData.series = Object.entries(dataDict).map(([key, value] )=>({ type: "line", name: key, data: value }))         
          }

        });
    },
    procedureFetch() {
     return this.$http
        .request({
          url: "/api/BProcessList",
          method: "GET",
        })
        .then((data) => {
          this.procedureList = data;
        });
    },
    BWorkShopAjax(){
      return this.$http.request({url: "/api/BWorkShop",method: "GET"}).then(res=>this.workShopList=res)
    }
  }
};
</script>

<style lang="scss" scoped>
.UPH-page {
  overflow: hidden;
}
.charts-line,
.charts-bd {
  margin-top: 20rpx;
  width: 730rpx;
  height: 550rpx;
  background: $white-color;
}
.charts-line {
  margin-top: 0;
}
</style>
