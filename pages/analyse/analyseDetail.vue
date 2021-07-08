<template>
  <view id="analyseDetail">
    <u-navbar
      :title="navbar.title"
      :height="navbar.height"
      :is-back="navbar.isBack"
      :background="navbar.background"
    />
    <!-- nav -->
    <view class="u-page">
      <view class="search-box">
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
        <view v-if="columnData.series && columnData.series.length">
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
          <view class="minCharts">
            <qiun-data-charts
              type="column"
              :opts="columnOpt"
              :chartData="columnData"
              :animation="true"
              background="none"
            />
          </view>
        </view>
        <u-empty
          v-else
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
        <view v-if="tableList.length">
          <!-- 图形2 -->
          <view class="charts-pie">
            <qiun-data-charts
              type="pie"
              :opts="pieOpt"
              :chartData="pieData"
              :animation="true"
              background="none"
            />
          </view>
          <view class="device-info">
            <u-table :font-size="24">
              <u-tr>
                <u-th :width="600">设备编号</u-th>
                <u-th>干扰类型</u-th>
                <u-th>延误时间</u-th>
              </u-tr>
              <u-tr v-for="(tableItem, i) in tableList" :key="i">
                <u-td :width="500">{{ tableItem.machineCode }}</u-td>
                <u-td>{{ workType[tableItem.troubleCoed] }}</u-td>
                <u-td>{{ tableItem.time }}</u-td>
              </u-tr>
            </u-table>
          </view>
        </view>
        <!-- 内容 -->
        <u-empty
          v-if="!tableList.length"
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
              }}x 100% = {{ natureRate }}%
            </view>
          </view>
          <view class="formula-item">
            <view class="formula-name">良品率（良品量/生产量）：</view>
            <view class="formula-text">
              {{ formula.quality }} / {{ formula.output }} x 100% ={{
                yieldRate
              }}%
            </view>
          </view>
          <view class="formula-item">
            <view class="formula-name">
              设备综合效率=时间稼动率x性能稼动率x良品率：
            </view>
            <view class="formula-text">
              {{ timeRate / 100 }} x {{ natureRate / 100 }} x
              {{ yieldRate / 100 }} x 100% = {{ multipleRate }} %
            </view>
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
import config from "@/util/config";
const url = config.oeeServerApi.baseURL;

export default {
  data() {
    return {
      // nav
      navbar: {
        title:'设备效率分析详情',
        height:50,
        background: {
          backgroundColor: "#ffffff",
        },
        isBack: true,
      },
      machineCode: "",
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
        startTime: "",
        endTime: "",
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
      // 数据
      tableList: [],
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
      workType: { "001": "不良", "002": "工具", "003": "短缺" },
      // 柱行图
      columnOpt: {
        dataLabel: false,
        tooltipShow: false,
        rotate: true,
        padding: [10,0,0,0],
        extra: {
          column: {
            type: "stack",
            activeBgColor: "#ffffff",
            width: 200,
          },
          tooltip: { showBox: false },
        },
        xAxis: {
          disabled: true,
          axisLine: false,
        },
        yAxis: {
          disabled: true,
          disableGrid: true,
        },
        legend: {
          show: false,
        },
      },
      columnData: {},
      // 饼图
      pieOpt: {
        animation: true,
        timing: "easeOut",
        duration: 1000,
        color: ["#1890ff", "#2fc25b", "#facc14"],
        padding: [20,20,20,20],
        legend: {
          show: true,
          position: "right",
          float: "center",
          lineHeight: 20,
        },
        tooltip: {
          showBox: false,
        },
      },
      pieData: {},
    };
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  onLoad(option) {
    // 设置标题
    const { machineName, machineCode } = option;
    this.navbar.title = machineName ? machineName : "设备效率分析详情";
    this.machineCode = machineCode;
	// this.machineName = "动平衡机";
	// this.machineCode = "CZ190430-11-04";
    // 时间
    this.form.startTime = "2020-03-01 00:00:00";
    this.form.endTime = "2020-04-01 23:59:59";
  },
  computed: {
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
  methods: {
    async analysisAjax() {
      this.loading = true;
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
          this.loading = false;
          this.formula = res1[1].data.data;
          this.tableList = res3[1].data.data;
          // 柱形图
          this.columnData = {
            categories: ["时间占比图"],
            series: res2[1].data.data.map(({ state, time }) => {
              const { name, color } = this.machineType[state];
              return {
                data: [time],
                name,
                color,
              };
            }),
          };

          // 饼图
          this.pieData = {
            series: [
              {
                data: this.tableList.map(({ troubleCoed, time }) => {
                  return {
                    name: this.workType[troubleCoed],
                    value: Number(time),
                  };
                }),
              },
            ],
          };
        })
        .catch(() => {
          this.loading = false;
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
      // this.isSearch = false;
      this.$refs.uForm.resetFields();
      // 清空数据
      this.formula = {};
      this.tableList = [];
      this.columnData = {};
      this.pieData = {};
    },
    search() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          // this.isSearch = true;
          this.analysisAjax();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>

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
    margin: 40rpx 0 40rpx 0;
    width: 720rpx;
    height: 100rpx;
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
  .sub-title {flex: 1;}
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
    width: 700rpx;
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
      border-bottom: 1px solid #eee;
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
