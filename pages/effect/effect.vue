<template>
  <view class="effect">
    <u-navbar 
    :height="50" 
    :is-back="true" 
    :background="navbar.background">
      <view class="navbar-left">
        <view class="title">效率管理</view>
        <!-- <view class="subTitle">{{wsName}}</view> -->
      </view>
      <view class="navbar-right" slot="right">
        <view class="navbar-icon">
          <u-icon class="icon-item" name="grid" color="#333" size="45" @click.native="handleMenu" />
          <u-icon
            class="icon-item"
            name="reload"
            color="#333"
            size="45"
            @click.native="handleRefresh"
          />
        </view>
      </view>
    </u-navbar>
    <!-- nav -->
    <view class="nav-subTitle">{{ wsName }}</view>
    <u-row class="effect-list">
      <u-col span="4">
        <view class="effect-item">
          <canvas canvas-id="canvasGauge1" id="canvasGauge1" class="charts"></canvas>
          <text class="effect-text">01</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <canvas canvas-id="canvasGauge2" id="canvasGauge2" class="charts"></canvas>
          <text class="effect-text">02</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <canvas canvas-id="canvasGauge3" id="canvasGauge3" class="charts"></canvas>
          <text class="effect-text">03</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <canvas canvas-id="canvasGauge4" id="canvasGauge4" class="charts"></canvas>
          <text class="effect-text">04</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <canvas canvas-id="canvasGauge5" id="canvasGauge5" class="charts"></canvas>
          <text class="effect-text">05</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <canvas canvas-id="canvasGauge6" id="canvasGauge6" class="charts"></canvas>
          <text class="effect-text">06</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <canvas canvas-id="canvasGauge7" id="canvasGauge7" class="charts"></canvas>
          <text class="effect-text">07</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <canvas canvas-id="canvasGauge8" id="canvasGauge8" class="charts"></canvas>
          <text class="effect-text">08</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <canvas canvas-id="canvasGauge9" id="canvasGauge9" class="charts"></canvas>
          <text class="effect-text">09</text>
        </view>
      </u-col>
    </u-row>
    <!-- 图表 -->
    <popup ref="popup" @getWorkShop="getWorkShop" />
  </view>
</template>

<script>
import uCharts from "@/components/uni/u-charts/u-charts";
let _self;
let data = {
  categories: [
    {
      value: 0.2,
      color: "#e27452",
    },
    {
      value: 0.4,
      color: "#eaa16a",
    },
    {
      value: 1,
      color: "#3399ff",
    },
  ],
  series: [
    {
      name: "完成率",
      data: 0.85,
    },
  ],
};

export default {
  data() {
    return {
      navbar: {
        background: {
          backgroundColor: "#ffffff",
        },
      },
      // 车间
      wsName: "车间列表",
      wsCode: "",
      // 图表
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
      gaugeWidth: 15,
    };
  },
  onLoad() {
    // 图表
    _self = this;
    this.cWidth = uni.upx2px(250);
    this.cHeight = uni.upx2px(160);
    this.radarInit("canvasGauge1", data);
    this.radarInit("canvasGauge2", data);
    this.radarInit("canvasGauge3", data);
    this.radarInit("canvasGauge4", data);
    this.radarInit("canvasGauge5", data);
    this.radarInit("canvasGauge6", data);
    this.radarInit("canvasGauge7", data);
    this.radarInit("canvasGauge8", data);
    this.radarInit("canvasGauge9", data);
  },

  methods: {
    handleMenu() {
      this.$refs.popup.visible = true;
    },
    handleRefresh() {},
    getWorkShop(item) {
      const { wsName, wsCode } = item;
      this.wsName = wsName;
      this.wsCode = wsCode;
    },
    // 雷达图表
    radarInit(canvasId, chartData) {
      new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: "gauge",
        fontSize: 9,
        legend: false,
        title: {
          name: Math.round(chartData.series[0].data * 100) + "%",
          color: "#0066cc",
          fontSize: 17 * _self.pixelRatio,
          offsetY: 30 * _self.pixelRatio, //新增参数，自定义调整Y轴文案距离
        },
        extra: {
          gauge: {
            type: "default",
            width: 3, //仪表盘背景的宽度
            startAngle: 0.75,
            endAngle: 0.25,
            startNumber: 0,
            endNumber: 100,
            splitLine: {
              fixRadius: 0,
              splitNumber: 5,
              width: _self.gaugeWidth * _self.pixelRatio, //仪表盘背景的宽度
              // color: '#FFFFFF',
              childNumber: 0,
              childWidth: _self.gaugeWidth * 0.2 * _self.pixelRatio, //仪表盘背景的宽度
            },
            pointer: {
              width: _self.gaugeWidth * 0.2 * _self.pixelRatio, //指针宽度
              color: "auto",
            },
          },
        },
        background: "#FFFFFF",
        pixelRatio: _self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        dataLabel: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.effect {
  min-height: 100%;
  background: $white-color;
}
.effect-list {
  .effect-item {
    padding: 50rpx 0;
    text-align: center;
    .charts {
      width: 250upx;
      height: 160upx;
    }
    .effect-text {
      display: block;
      color: $font-gray;
    }
  }
}
</style>
