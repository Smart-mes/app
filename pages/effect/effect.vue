<template>
  <view class="effect">
    <u-navbar
      :title="navbar.title"
      :is-back="navbar.isBack"
      :title-color="navbar.color"
      :title-size="navbar.size"
      :height="navbar.height"
      :background="navbar.background"
      title-bold
    >
      <view class="navbar-right" slot="right">
        <view class="navbar-icon">
          <u-icon
            class="icon-item"
            name="list"
            color="#333"
            size="45"
            @click.native="handleMenu"
          />
        </view>
      </view>
    </u-navbar>
    <!-- nav -->
    <view class="nav-subTitle">{{ wsName }}</view>
    <u-row class="effect-list">
      <u-col span="4">
        <view class="effect-item">
          <view class="charts">
            <qiun-data-charts type="gauge" :opts="opt" :chartData="chartData" />
          </view>
          <text class="effect-text">01</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <view class="charts">
            <qiun-data-charts type="gauge" :opts="opt" :chartData="chartData" />
          </view>
          <text class="effect-text">02</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <view class="charts">
            <qiun-data-charts type="gauge" :opts="opt" :chartData="chartData" />
          </view>
          <text class="effect-text">03</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <view class="charts">
            <qiun-data-charts type="gauge" :opts="opt" :chartData="chartData" />
          </view>
          <text class="effect-text">04</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <view class="charts">
            <qiun-data-charts type="gauge" :opts="opt" :chartData="chartData" />
          </view>
          <text class="effect-text">05</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <view class="charts">
            <qiun-data-charts type="gauge" :opts="opt" :chartData="chartData" />
          </view>
          <text class="effect-text">06</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <view class="charts">
            <qiun-data-charts type="gauge" :opts="opt" :chartData="chartData" />
          </view>
          <text class="effect-text">07</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <view class="charts">
            <qiun-data-charts type="gauge" :opts="opt" :chartData="chartData" />
          </view>
          <text class="effect-text">08</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="effect-item">
          <view class="charts">
            <qiun-data-charts type="gauge" :opts="opt" :chartData="chartData" />
          </view>
          <text class="effect-text">09</text>
        </view>
      </u-col>
    </u-row>
    <!-- 图表 -->
    <popup ref="popup" @getWorkShop="getWorkShop" />
  </view>
</template>

<script>
export default {
  name:"Effect",
  data() {
    return {
      navbar: {
        title: "效率管理",
        isBack: true,
        color: "#333",
        size: "36",
        height: "50",
        background: {
          backgroundColor: "#ffffff",
        },
      },
      // 车间
      wsName: "车间列表",
      opt: {
        type: "gauge",
        canvas2d: false,
        background: "none",
        animation: true,
        timing: "easeOut",
        duration: 1000,
        // axisLabel: {
        //   distance: -60,
        // },
        // canvasId: "",
        // color: [
        //   "#1890FF",
        //   "#91CB74",
        //   "#FAC858",
        //   "#EE6666",
        //   "#73C0DE",
        //   "#3CA272",
        //   "#FC8452",
        //   "#9A60B4",
        //   "#ea7ccc",
        // ],
        rotate: false,
        reserve: false,
        fontSize: 9,
        fontColor: "#666666",
        enableScroll: false,
        touchMoveLimit: 60,
        enableMarkLine: false,
        dataLabel: true,
        dataPointShape: true,
        dataPointShapeType: "solid",
        title: {
          name: "66%",
          fontSize: 20,
          color: "#0066cc",
          offsetX: 0,
          offsetY: 13,
        },
        subtitle: { name: "" },
        extra: {
          gauge: {
            type: "default",
            width: 4,
            labelColor: "#666666",
            startAngle: 0.75,
            endAngle: 0.25,
            startNumber: 0,
            endNumber: 100,
            format: "",
            labelOffset: 8,
            splitLine: {
              fixRadius: 0,
              splitNumber: 10,
              width: 0,
              childNumber: 0,
              childWidth: 0,
              color: "#ffffff",
            },
            pointer: {
              width: 2,
              color: "auto",
            },
            labelFormat: "",
          },
        },
      },
      chartData: {
        categories: [
          {
            value: 0.2,
            color: "#1890ff",
          },
          {
            value: 0.8,
            color: "#2fc25b",
          },
          {
            value: 1,
            color: "#f04864",
          },
        ],
        series: [
          {
            name: "完成率",
            data: 0.66,
          },
        ],
      },
    };
  },
  onLoad() {},
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
      margin: 0 auto;
      width: 210rpx;
      height: 210rpx;
    }
    .effect-text {
      display: block;
      color: $font-gray;
    }
  }
}
</style>
