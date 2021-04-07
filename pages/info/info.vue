<template>
  <view class="info-wrap">
    <u-navbar title="我的消息" :is-back="true" :background="navbar.background" title-color="#333">
      <view class="navbar-right" slot="right">
        <view class="navbar-icon">
          <u-badge size="mini" count="20" :offset="[-17,20]" type="error" />
          <u-icon  class="icon-item" name="chat" color="#333" size="45" />
        </view>
      </view>
    </u-navbar>
    <!-- nav -->
    <view class="info">
      <view class="info-row">
        <view class="icon-col">
          <u-badge size="small" type="error" :offset="[15,-10]" :is-dot="true" />
          <u-icon class="info-icon" name="volume-up" color="#fff" size="50" />
        </view>
        <view class="text-col" @tap="linkInfo('系统自动取消订单提醒')">
          <view class="text-col-title">
            <text class="info-name">系统自动取消订单提醒</text>
            <text class="info-time">2018-01-23</text>
          </view>
          <view class="info-text ellipsis">这里说的图片图标，指的是小图标，起作用定位为"icon"图标作用，而非大尺寸的图片展示场景</view>
        </view>
      </view>
    </view>
    <view class="info" v-for="i of 5" :key="i">
      <view class="info-row">
        <view class="icon-col">
          <u-icon class="info-icon" name="volume-up" color="#fff" size="50" />
        </view>
        <view class="text-col" @tap="linkInfo('系统自动取消订单提醒')">
          <view class="text-col-title">
            <text class="info-name">系统自动取消订单提醒</text>
            <text class="info-time">2018-01-23</text>
          </view>
          <view class="info-text ellipsis">这里说的图片图标，指的是小图标，起作用定位为"icon"图标作用，而非大尺寸的图片展示场景</view>
        </view>
      </view>
    </view>
    <!-- info -->
  </view>
</template>
<script>
export default {
  name: "Info",
  data() {
    return {
      navbar: {
        background: {
          backgroundColor: "#ffffff",
        },
      },
    };
  },
  methods: {
    linkInfo(title) {
      uni.navigateTo({
        url: `/pages/info/infoDetails?title=${title}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.info-wrap {
  min-height: 100%;
  // background-color: $white-color;
}

.navbar-icon {
  position: relative;
}
// nag
.info {
  .info-row {
    position: relative;
    display: flex;
    flex-direction: row;
	margin-bottom: 15rpx;
    padding: 25rpx;
	background-color:$white-color ;
    // @include line(100rpx);
    .icon-col {
      position: relative;
      margin-right: 25rpx;
      width: 80rpx;
    }
    .text-col {
      flex: auto;
      line-height: initial;
    }
    .text-col-title {
      display: flex;
      flex-direction:column;
    }
  }
  .info-icon {
    margin-top: 25rpx;
    padding: 15rpx;
    border-radius: 50%;
    background-color: #5782f5;
  }
  .info-name {
	flex: auto;  
    font-size:$font-32;
    color: #333;
  }
  .info-time {
    font-size: $font-20;
    color: $font-light-gray;
  }
  .info-text {
    margin-top: 15rpx;
    width: 610rpx;
    font-size: $font-26;
    color: $font-gray;
  }
}
</style>
	
