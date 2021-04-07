<template>
  <view class="quality">
    <u-navbar
      :height="50"  
      :is-back="navbar.isBack"
      :background="navbar.background"
    >
      <view class="navbar-left">
        <view class="title">{{navbar.title}}</view>
        <!-- <view class="subTitle">{{wsName}}</view> -->
      </view>
    </u-navbar>
    <!-- nav -->
    <view class="quality-box">
      <view class="quality-charts">
        <canvas
          canvas-id="canvasColumn"
          id="canvasColumn"
          class="charts"
          @touchstart="touchColumn"
        />
      </view>
    </view>
    <!-- 图标 -->
    <view class="quality-info">
      <view class="info-item">
        <view class="info-item-name">FJTBLB</view>
        <view class="info-item-body">22</view>
      </view>
      <view class="info-item">
        <view class="info-item-name">接带(正极涂布单面首检报废)</view>
        <view class="info-item-body">187</view>
      </view>
      <view class="info-item">
        <view class="info-item-name">正极涂布单面首检报废</view>
        <view class="info-item-body">33</view>
      </view>
      <view class="info-item">
        <view class="info-item-name">正极涂布双面首检报废</view>
        <view class="info-item-body">22</view>
      </view>
    </view>
    <!-- 信息 -->
  </view>
</template>

<script>
import uCharts from "@/components/uni/u-charts/u-charts";
var _self;
var canvaColumn = null;

export default {
  data() {
    return {
      navbar: {
        title: "工单不良汇总",
        isBack: true,
        background: {
          backgroundColor: "#ffffff",
        },
      },
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
      serverData: "",
    };
  },
  onLoad() {
    _self = this;
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(600);
    this.getServerData();
  },
  methods: {
    getServerData() {
      let Column = {
        categories: ["2012", "2013", "2014", "2015", "2016", "2017"],
        series: [
          {
            name: "成交量1",
            data: [
              15,
              {
                value: 20,
                color: "#f04864",
              },
              45,
              37,
              43,
              34,
            ],
          },
          {
            name: "成交量2",
            data: [
              30,
              {
                value: 40,
                color: "#facc14",
              },
              25,
              14,
              34,
              18,
            ],
          },
        ],
      };
      this.showColumn("canvasColumn", Column);
    },
    showColumn(canvasId, chartData) {
      canvaColumn = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: "column",
        legend: {
          show: true,
        },
        padding: [20, 20, 10, 20],
        fontSize: 11,
        background: "#FFFFFF",
        pixelRatio: _self.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          //disabled:true
          gridType: "dash",
          dashLength: 8,
          gridColor: "#CCCCCC",
        },
        dataLabel: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          column: {
            type: "group",
            width:
              (_self.cWidth * _self.pixelRatio * 0.45) /
              chartData.categories.length,
          },
        },
      });
    },
    touchColumn(e) {
      canvaColumn.showToolTip(e, {
        format: function (item, category) {
          if (typeof item.data === "object") {
            return category + " " + item.name + ":" + item.data.value;
          } else {
            return category + " " + item.name + ":" + item.data;
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.quality {
  .quality-box {
    padding: 30upx 0;
    background: $white-color;
  }
  .quality-charts {
    width: 750upx;
    height: 600upx;
    .charts {
      width: 750upx;
      height: 600upx;
    }
  }

  .quality-info {
    display: flex;
    flex-direction: column;
    .info-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 75upx;
      line-height: 75upx;
      font-size: $font-30;
      &:nth-child(even) {
        background: #e6e6e6;
      }
      .info-item-name {
        padding: 0 20upx 0 40upx;
        width: 450upx;
        // @extend .ellipsis;
      }
    }
  }
}
</style>
