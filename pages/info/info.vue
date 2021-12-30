<template>
  <view class="info-wrap">
    <navBar :title="navBar.title" :is-back="navBar.isBack" title-bold>
      <view class="navbar-right" slot="navbarRight">
        <view class="navbar-icon">
          <u-badge
            size="mini"
            :count="unreadCount"
            :offset="[-17, 20]"
            type="error"
          />
          <u-icon class="icon-item" name="chat" color="#333" size="45" />
        </view>
      </view>
    </navBar>
    <!-- navbar -->
    <view class="info">
      <view class="info-row" v-for="notify in newNotifyList" :key="notify.id">
        <view class="icon-col">
          <u-badge
            size="small"
            type="error"
            :offset="[15, -10]"
            :is-dot="true"
          />
          <u-icon class="info-icon" name="volume-up" color="#fff" size="50" />
        </view>
        <view class="text-col" @tap="linkInfo(notify.id)">
          <view class="text-col-title">
            <text class="info-name">{{ notify.title }}</text>
            <text class="info-time">{{ notify.time }}</text>
          </view>
          <view class="info-text ellipsis">{{ notify.content }}</view>
        </view>
      </view>
      <!-- 列表 -->
      <u-empty
        v-show="!newNotifyList.length"
        margin-top="30"
        icon-size="100"
        text="数据为空"
        mode="data"
      />
    </view>
    <!-- info -->
  </view>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "Info",
  data() {
    return {
      navBar: {
        title: "我的消息",
        isBack: true,
      },
      notifyList: [],
    };
  },
  computed: {
    ...mapState(["unreadCount", "userInfo"]),
    newNotifyList() {
      return this.notifyList.map((notify) => {
        notify.time = moment(notify.createdAt).format("YYYY-MM-DD HH:mm:ss");
        return notify;
      });
    },
  },
  onShow() {
    this.notifyAjax();
  },
  onPullDownRefresh() {
    this.notifyAjax().then(() => uni.stopPullDownRefresh());
  },
  methods: {
    linkInfo(id) {
      uni.navigateTo({
        url: `/pages/info/infoDetails?id=${id}`,
      });
    },
    notifyAjax() {
      uni.showLoading({ title: "加载中", mask: true });
      return this.$http
        .request({
          url: "/api/SNotify/UserNotify",
          method: "GET",
          data: {
            empCode: this.userInfo.empCode,
            state: 0,
          },
        })
        .then((res) => {
          uni.hideLoading();
          this.notifyList = res;
        })
        .catch(() => uni.hideLoading());
    },
  },
};
</script>
<style lang="scss" scoped>
.info-wrap {
  min-height: 100%;
}
.navbar-icon {
  position: relative;
}
// nag
.info {
  .info-row {
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: row;
    margin: 15rpx;
    padding: 25rpx;
    border-radius: 10rpx;
    background-color: $white-color;
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
      flex-direction: column;
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
    font-size: $font-32;
    color: #333;
  }
  .info-time {
    font-size: $font-20;
    color: $font-light-gray;
  }
  .info-text {
    margin-top: 15rpx;
    width: 500rpx;
    font-size: $font-26;
    color: $font-gray;
  }
}
</style>
	
