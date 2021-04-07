<template>
  <view>
    <u-navbar
      title-color="#000000"
      :title="machineName"
      :height="50"
      :is-back="navbar.isBack"
      :background="navbar.background"
    />
    <!-- <view class="navbar-title">{{ machineName }}</view>
    </u-navbar> -->
    <!-- nav -->
    <view class="u-page">
      <view class="search">
        <u-section
          title="搜索"
          font-size="30"
          :show-line="false"
          :right="false"
        >
          <view slot="right" @click="searchVisible = !searchVisible">
            <u-icon
              :name="searchVisible ? 'arrow-up-fill' : 'arrow-down-fill'"
              size="22"
              color="#ccc"
            />
          </view>
        </u-section>
        <view v-show="searchVisible">
          <u-form label-width="130" :model="form" ref="uForm">
            <u-form-item label="开始时间" prop="startTime">
              <u-input
                v-model="form.startTime"
                @click="handlePickerType('start')"
              />
            </u-form-item>
            <u-form-item label="结束时间" prop="endTime">
              <u-input
                v-model="form.endTime"
                @click="handlePickerType('end')"
              />
            </u-form-item>
          </u-form>
          <view class="btn">
            <u-row gutter="20">
              <u-col span="6">
                <u-button size="medium" @click="clear">清空</u-button>
              </u-col>
              <u-col span="6">
                <u-button type="primary" size="medium" @click="search">
                  查询
                </u-button>
              </u-col>
            </u-row>
          </view>
        </view>
      </view>
      <!-- 搜索 -->
      <view class="mix">
        <view class="mix-title">
          <u-section
            title="占比图"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view v-if="minMixList.length">
          <view class="min-state">
            <view
              class="state-item"
              v-for="(value, key) in machineType"
              :key="key"
            >
              <text class="state-color" :style="{ background: value.color }" />
              <text class="state-font">{{ value.name }}</text>
            </view>
          </view>
          <!-- hd -->
          <view class="mix-content">
            <canvas
              canvas-id="mixCanvasStack"
              id="mixCanvasStack"
              class="minCharts"
            />
          </view>
        </view>
        <u-empty
          v-if="!minMixList.length"
          margin-top="30"
          icon-size="100"
          text="数据为空"
          mode="data"
        />
      </view>
      <!-- 占比 -->
      <view class="device">
        <view class="device-title">
          <u-section
            title="设备效率饼图"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view v-if="tableData.length">
          <canvas
            canvas-id="canvasPie"
            id="canvasPie"
            class="charts-pie"
            @touchstart="touchPie"
          />
          <view class="device-info">
            <u-table :font-size="24">
              <u-tr>
                <u-th :width="600">设备编号</u-th>
                <u-th>干扰类型</u-th>
                <u-th>延误时间</u-th>
              </u-tr>
              <u-tr v-for="(tableItem, i) in tableData" :key="i">
                <u-td :width="500">{{ tableItem.machineCode }}</u-td>
                <u-td>{{ workType(tableItem.troubleCoed) }}</u-td>
                <u-td>{{ tableItem.time }}</u-td>
              </u-tr>
            </u-table>
          </view>
        </view>
        <!-- 内容 -->
        <u-empty
          v-if="!tableData.length"
          margin-top="30"
          icon-size="100"
          text="数据为空"
          mode="data"
        />
      </view>
      <!-- 饼图，列表 -->
      <view class="formula">
        <view class="formula-title">
          <u-section
            title="计算公式"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view v-if="Object.keys(formula).length" class="formula-list">
          <view class="formula-item">
            <view class="formula-name">
              时间稼动率（实际生产时间/计划生产时间）：
            </view>
            <view class="formula-text">
              {{ formula.runTimeLong }} / {{ formula.produTimeLong }} x 100% ={{
                timeRate
              }}%
            </view>
          </view>
          <view class="formula-item">
            <view class="formula-name">
              性能稼动率（理论节拍x产量/稼动时间）：
            </view>
            <view class="formula-text">
              {{ formula.rate }} x {{ formula.output }} /{{
                formula.runTimeLong
              }}
              x 100% = {{ natureRate }}%
            </view>
          </view>
          <view class="formula-item">
            <view class="formula-name">良品率（良品量/生产量）：</view>
            <view class="formula-text"
              >{{ formula.quality }} / {{ formula.output }} x 100% =
              {{ yieldRate }}%</view
            >
          </view>
          <view class="formula-item">
            <view class="formula-name">
              设备综合效率=时间稼动率x性能稼动率x良品率：
            </view>
            <view class="formula-text"
              >{{ timeRate / 100 }} x {{ natureRate / 100 }} x
              {{ yieldRate / 100 }} x 100% = {{ multipleRate }} %</view
            >
          </view>
        </view>
        <u-empty
          v-if="!Object.keys(formula).length"
          margin-top="30"
          icon-size="100"
          text="数据为空"
          mode="data"
        />
      </view>
    </view>
    <!-- 公式 -->
    <u-picker
      v-model="picker.visible"
      mode="time"
      :params="picker.params"
      @confirm="pickerConfirm"
    />
    <!-- time -->
  </view>
</template>

<script>
import uCharts from "@/components/uni/u-charts/u-charts";
import config from "@/util/config";

let _self;
let mixCanvas = null;
let canvaPie = null;
const url = config.oeeServerApi.baseURL;

export default {
  data() {
    return {
      // nav
      navbar: {
        background: {
          backgroundColor: "#ffffff",
        },
        isBack: true,
      },
      machineName: "动平衡机",
      machineCode: "CZ190430-11-04",
      picker: {
        visible: false,
        params: {
          year: true,
          month: true,
          day: true,
          hour: true,
          minute: true,
          second: true,
        },
      },
      pickerType: "start",
      form: {
        startTime: "2020-03-01 00:00:00",
        endTime: "2020-04-01 23:59:59",
      },
      rules: {
        startTime: {
          required: true,
          message: "不能为空",
        },
        endTime: {
          required: true,
          message: "不能为空",
        },
      },
      searchVisible: true,
      isSearch: false,
      // 数据
      minMixList: [],
      tableData: [],
      formula: {},
      // 设备
      machineType: {
        "-1": {
          name: "停机",
          color: "#438ef7",
        },
        2: {
          name: "故障",
          color: "#e23a3a",
        },
        1: {
          name: "启动",
          color: "#61bf66",
        },
        0: {
          name: "关机",
          color: "#f3ce49",
        },
      },
      // 占比图
      minWidth: "",
      minHeight: "",
      // 饼图
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
      serverData: "",
      piearr: [],
    };
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  onLoad(option) {
    // 设置标题
    this.machineName = option.machineName
      ? option.machineName
      : "设备效率分析详情";
    this.machineCode = option.machineCode;

    // 初始化图标
    _self = this;
  },
  computed: {
    pieSeries() {
      return this.tableData.map(({ troubleCoed, time }) => {
        return { data: Number(time), name: this.workType(troubleCoed) };
      });
    },
    // 公式
    timeRate() {
      const runTimeLong = parseInt(this.formula.runTimeLong);
      const produTimeLong = parseInt(this.formula.produTimeLong);
      const timeRate = Math.round((runTimeLong / produTimeLong) * 100);
      return timeRate || "";
    },
    natureRate() {
      const rate = parseFloat(this.formula.rate);
      const output = parseInt(this.formula.output);
      const runTimeLong = parseInt(this.formula.runTimeLong);

      const natureRate = Math.round(((rate * output) / runTimeLong) * 100);

      return natureRate || "";
    },
    yieldRate() {
      const quality = this.formula.quality;
      const output = this.formula.output;
      const yieldRate = Math.round((quality / output) * 100);
      return yieldRate || "";
    },
    multipleRate() {
      const timeRate = this.timeRate / 100;
      const natureRate = this.natureRate / 100;
      const yieldRate = this.yieldRate / 100;

      const multipleRate = Math.round(timeRate * natureRate * yieldRate * 100);
      return multipleRate || "";
    },
  },
  watch: {
    isSearch(val) {
      if (!val) {
        this.minMixList = [];
        this.tableData = [];
        this.formula = {};

        this.getMinData();
        this.getDeviceData();
      }
    },
  },
  methods: {
    async analysisAjax() {
      // this.loading = true;
      const params = {
        startDate: this.form.startTime,
        endDate: this.form.endTime,
        machineCode: this.machineCode,
      };

      Promise.all([
        await uni.request({
          url: `${url}/oee/analysis`,
          method: "GET",
          data: params,
        }),
        await uni.request({
          url: `${url}/oee/staterecord`,
          method: "GET",
          data: params,
        }),
        await uni.request({
          url: `${url}/oee/machinestaterecord`,
          method: "GET",
          data: params,
        }),
      ])
        .then(([res1, res2, res3]) => {
          // this.loading = false;
          this.formula = res1[1].data.data;
          this.minMixList = res2[1].data.data;
          this.tableData = res3[1].data.data;
        })
        .then(() => {
          // 占比图
          this.minWidth = uni.upx2px(720);
          this.minHeight = uni.upx2px(200);

          this.getMinData();
          //设备效率图
          this.cWidth = uni.upx2px(720);
          this.cHeight = uni.upx2px(500);
          this.getDeviceData();
          // this.drawMix();
          // this.drawPie();
        })
        .catch(() => {
          // this.loading = false;
        });
    },
    // 时间占比图
    // drawMix() {},
    pickerConfirm(params) {
      const { year, month, day, hour, minute, second } = params;
      const time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      if (this.pickerType === "start") {
        this.form.startTime = time;
      } else {
        this.form.endTime = time;
      }
    },
    handlePickerType(type) {
      uni.hideKeyboard();
      this.pickerType = type;
      this.picker.visible = true;
    },
    clear() {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
      this.isSearch = false;
      this.$refs.uForm.resetFields();
    },
    search() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          this.isSearch = true;
          this.analysisAjax();
        }
      });
    },
    //---------------------------------------
    // 饼图
    getDeviceData() {
      const Pie = {
        series: [],
      };
      Pie.series = this.pieSeries;
      _self.showPie("canvasPie", Pie);
    },
    showPie(canvasId, chartData) {
      canvaPie = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: "pie",
        fontSize: 11,
        legend: {
          show: true,
          position: "right",
          float: "center",
          itemGap: 10,
          padding: 5,
          lineHeight: 26,
          margin: 5,
          borderWidth: 1,
        },
        background: "#FFFFFF",
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        dataLabel: true,
        extra: {
          pie: {
            labelWidth: 15,
          },
        },
      });
      this.piearr = canvaPie.opts.series;
    },
    touchPie(e) {
      canvaPie.showToolTip(e, {
        format: function (item) {
          return item.name + ":" + item.data;
        },
      });
    },
    // echarts
    onViewClick(options) {
      console.log(options);
    },
    // 占比图
    getMinData() {
      let ColumnStack = {
        categories: ["时间占比图"],
        series: [],
      };
      ColumnStack.series = this.minMixList.map(({ state, time }) => {
        const { name, color } = this.machineType[state];
        return {
          data: [time],
          name,
          color,
        };
      });
      _self.showColumnStack("mixCanvasStack", ColumnStack);
    },
    showColumnStack(canvasId, chartData) {
      mixCanvas = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: "column",
        rotate: true,
        legend: {
          show: false,
        },
        fontSize: 11,
        background: "#FFFFFF",
        pixelRatio: _self.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disabled: true,
          disableGrid: true,
          gridColor: "#ffffff",
        },
        yAxis: {
          disabled: true,
          disableGrid: true,
          gridColor: "#ffffff",
        },
        dataLabel: false,
        width: _self.minWidth * _self.pixelRatio,
        height: _self.minHeight * _self.pixelRatio,
        extra: {
          column: {
            type: "stack",
            width:
              (_self.minWidth * _self.pixelRatio * 0.5) /
              chartData.categories.length,
          },
        },
      });
    },
    workType(type) {
      if (type === "001") {
        return "不良";
      } else if (type === "002") {
        return "工具";
      } else if (type === "003") {
        return "短缺";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  margin: 15rpx 15rpx 0 15rpx;
  padding: 30rpx;
  border-radius: 10rpx;
  background-color: $white-color;

  .btn {
    margin-top: 20rpx;
    /deep/.u-btn {
      width: 100%;
      padding: 0;
    }
  }
}
.mix {
  overflow: hidden;
  margin: 15rpx 15rpx 0 15rpx;
  border-radius: 10rpx;
  background-color: $white-color;
  .mix-title {
    margin: 30rpx 30rpx 0 30rpx;
  }
  .min-state {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: -30rpx;
    .state-item {
      margin-right: 20rpx;
      font-size: $font-22;
    }
    .state-color {
      display: inline-block;
      margin-right: 5rpx;
      width: 20rpx;
      height: 15rpx;
      border-radius: 5rpx;
    }
  }
  .minCharts {
    width: 720upx;
    height: 200upx;
  }
}

// 饼图
.sub-title {
  display: flex;
  flex-direction: row;
  padding: 20upx;
  line-height: 1;
  font-size: $font-36;
  color: $font-text-color;

  .icon {
    margin-right: 10upx;
    width: 10upx;
    height: 36upx;
    border-radius: 5upx;
    background-color: $blue-color;
  }
}

.analyse-title {
  display: flex;
  flex-direction: row;
  margin-right: 30upx;

  .sub-title {
    flex: 1;
  }

  .iconfont {
    padding-left: 15upx;
    color: $font-light-gray;
  }
}

.device {
  overflow: hidden;
  margin: 15rpx 15rpx 0 15rpx;
  border-radius: 10rpx;
  background: $white-color;

  .device-title {
    padding: 30rpx 30rpx 20rpx 30rpx;
  }

  .charts-pie {
    width: 720rpx;
    height: 500rpx;
  }
  .device-info {
    margin: 30rpx;
  }
}
.formula {
  margin: 15rpx 15rpx 0 15rpx;
  padding: 30upx;
  border-radius: 10rpx;
  background: $white-color;

  .formula-title {
    padding-bottom: 20rpx;
  }

  .formula-list {
    .formula-item {
      position: relative;
      padding: 20upx;
      border-bottom: 1px solid $line-dark-color;

      &:nth-child(even) {
        background: $bj-gray;
      }

      .formula-name {
        margin-bottom: 15rpx;
        font-size: $font-24;
        color: $font-gray;
      }
    }
  }
}
</style>
