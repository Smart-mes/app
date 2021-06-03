<template>
  <view class="my">
    <u-navbar
      :title="navbar.title"
      :title-color="navbar.color"
      :title-size="navbar.size"
      :is-back="navbar.isBack"
      :height="navbar.height"
      :background="navbar.background"
      :border-bottom="false"
      title-bold
    />
    <!-- nav -->
    <view class="u-page">
      <view class="user">
        <view class="user-icon">
          <u-icon name="account-fill" color="#ddd" size="100" top="20" />
        </view>
        <text class="user-info">你好，{{ userInfo.userName }}</text>
      </view>
      <!-- 用户信息 -->
      <view class="my-info">
        <u-cell-group>
          <u-cell-item title="你的未读消息">
            <u-icon
              slot="icon"
              name="circleDot"
              custom-prefix="custom-icon"
              size="25"
              color="#999"
            />
            <text class="info-time">一分钟前</text>
            <u-badge count="99+" :absolute="false" />
          </u-cell-item>
          <u-cell-item title="你的未读任务">
            <u-icon
              slot="icon"
              name="circleDot"
              custom-prefix="custom-icon"
              size="25"
              color="#999"
            />
            <text class="info-time">一分钟前</text>
            <u-badge count="3" :absolute="false" />
          </u-cell-item>
        </u-cell-group>
      </view>
      <!--我的消息-->
      <view class="loginOut">
        <u-button type="default" @click="signOut">退出登录</u-button>
      </view>
    </view>
    <u-tabbar
      :icon-size="navTab.iconSize"
      :list="navTab.list"
      :mid-button="navTab.isMid"
      :active-color="navTab.activeColor"
      :inactive-color="navTab.inactiveolor"
    />
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      navbar: {
        title: "我的",
        isBack: false,
        color: "#fff",
        height: "50",
        size: "36",
        background: {
          backgroundColor: "#1c7de6",
        },
      },
      spotVisible: false,
    };
  },
  onLoad() {},
  computed: {
    ...mapState(["userInfo", "navTab"]),
  },
  methods: {
    ...mapMutations(["logout"]),
    signOut() {
      this.logout();
      uni.reLaunch({
        url: "/pages/login/login",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  color: $white-color;
}
.user {
  padding: 20rpx 0 50rpx 0;
  text-align: center;
  background: $blue-color;
  .user-icon {
    margin: 0 auto 10rpx auto;
    width: 150rpx;
    height: 150rpx;
    color: $blue-color;
    border-radius: 50%;
    background: $white-color;
  }
  .user-info {
    font-size: 28rpx;
    color: $white-color;
  }
}
.loginOut {
  padding: 40upx 30upx;
}
</style>
