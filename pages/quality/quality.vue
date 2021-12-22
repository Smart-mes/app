<template>
  <view id="quality">
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
    <view class="quality-box">
      <view class="quality-charts">
        <qiun-data-charts
          type="column"
          background="none"
          :chartData="chartData"
          :animation="true"
          :opts="opts"
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
export default {
  name:"Quality",
  data() {
    return {
      navbar: {
        title: "工单不良汇总",
        isBack: true,
        color: "#333",
        size: "36",
        height: "50",
        background: {
          backgroundColor: "#ffffff",
        },
      },
      chartData: {
        categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
        series: [
          {
            name: "目标值1",
            data: [35, 36, 31, 33, 13, 34],
          },
          {
            name: "完成量2",
            data: [18, 27, 21, 24, 6, 28],
          },
        ],
      },
      opts: {
        yAxis: {
          gridType: "dash",
        },
      },
    };
  },
  onLoad() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
#quality {
  .quality-box {
    padding: 30upx 0;
    background: $white-color;
  }

  .quality-charts {
    width: 750upx;
    height: 600upx;
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
