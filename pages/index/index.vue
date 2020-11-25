<template>
  <view>
    <u-navbar :is-back="false">
      <text class="nav-name">广州阳普智能系统科技有限公司</text>
    </u-navbar>
    <!-- nav -->
    <view class="u-page">
      <view class="banner">
        <image :src="bannerUrl" mode="aspectFill" />
      </view>
      <!-- banner -->
      <u-notice-bar
        class="notice"
        type="info"
        mode="vertical"
        duration="4500"
        bg-color="#ffffff"
        padding="15rpx 35rpx"
        volume-size="35"
        :more-icon="true"
        :is-circular="false"
        :list="noticeList"
      />
      <!-- notice -->
      <view class="menu">
        <view class="menu-title">
          <u-section title="常用" :show-line="false" :right="false" />
        </view>

        <view class="meau-list">
          <view class="meau-item" v-for="(menuItem, i) in usuallyMenu" :key="i">
            <view v-if="menuItem.title === '添加'" @tap="addLink">
              <u-icon
                class="icon"
                :name="menuItem.icon"
                color="#bbb"
                size="65"
              />
              <view class="text">{{ menuItem.title }}</view>
            </view>
            <!-- else -->
            <view v-else @tap="handleLink(menuItem)">
              <u-icon
                class="icon"
                :name="menuItem.icon"
                color="#3ba7f6"
                size="65"
              />
              <view class="text">{{ menuItem.title }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 常用菜单 -->
      <view class="line">
        <u-line color="#ddd" />
      </view>
      <view class="menu whole-menu">
        <view class="menu-title">
          <u-section title="全部" :show-line="false" :right="false" />
        </view>
        <!-- 
			<swiper class="menu-swiper" :indicator-color="menuSwiper.dotColor" :indicator-active-color="menuSwiper.activeColor"
				 :indicator-dots="menuSwiper.indicatorDots" :autoplay="menuSwiper.autoplay" :interval="menuSwiper.interval"
				 :duration="menuSwiper.duration">
					<swiper-item v-for="(menuItem1,i) in menu" :key="i">
						<u-row>
							<u-col span="3" v-for="(menuItem2,j) in menuItem1" :key="j">
								<view class="menu-item" @tap="handleLink(menuItem2)">
									<u-icon class="icon" :name="menuItem2.icon" color="#3ba7f6" size="65" />
									<view class="text">{{menuItem2.title}}</view>
								</view>
							</u-col>
						</u-row>
					</swiper-item>
				</swiper>
		 -->
        <scroll-view class="scroll-view" scroll-x="true" @scroll="scroll">
          <view
            class="scroll-view-item"
            v-for="(menuItem1, i) in menu"
            :key="i"
          >
            <view class="meau-list">
              <view
                class="meau-item"
                v-for="(menuItem2, j) in menuItem1"
                :key="j"
                @tap="handleLink(menuItem2)"
              >
                <u-icon
                  class="icon"
                  :name="menuItem2.icon"
                  color="#3ba7f6"
                  size="65"
                />
                <view class="text">{{ menuItem2.title }}</view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="scorll-bar">
          <view
            class="scorll-slide"
            :style="{ width: `${sideWidth}px`, left: `${sideLeft}px` }"
          />
        </view>
      </view>
      <!-- 全部菜单 -->
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
    </view>
    <u-tabbar
      :list="nav.list"
      :mid-button="nav.isMid"
      :active-color="nav.activeColor"
    />
  </view>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Index",
  data() {
    return {
      bannerUrl: "/static/images/banner/banner.jpg",
      noticeList: [
        "Smart.MES APP上线1",
        "Smart.MES APP上线2",
        "Smart.MES APP上线3",
      ],
      menuList: [
        {
          icon: "file-text-fill",
          title: "生产详情",
          url: "/pages/product/product",
        },
        {
          icon: "calendar-fill",
          title: "设备管理",
          url: "/pages/device/device",
        },
        {
          icon: "coupon-fill",
          title: "效力分析",
          url: "/pages/analyse/analyse",
        },
        {
          icon: "play-right-fill",
          title: "工艺追溯",
          url: "/pages/retrospect/retrospect",
        },
        {
          icon: "info-circle-fill",
          title: "设备报障",
          url: "/pages/device/failure",
        },
        {
          icon: "hourglass-half-fill",
          title: "效力管理",
          url: "/pages/effect/effect",
        },
        {
          icon: "integral-fill",
          title: "质量管理",
          url: "/pages/quality/quality",
        },
        {
          icon: "scan",
          title: "相关查询",
          url: "/pages/search/search",
        },
        {
          icon: "chat-fill",
          title: "我的消息",
          url: "/pages/info/info",
        },
      ],
      sideLeft: 0,
      scrollWidth: 0,
    };
  },
  onLoad() {
    this.getWinWidth();
  },
  computed: {
    ...mapState(["nav", "usuallyMenu"]),
    menu() {
      const size = 8;
      const arr = [];
      for (let i = 0; i < this.menuList.length; i += size) {
        arr.push(this.menuList.slice(i, i + size));
      }
      return arr;
    },
    sideWidth() {
      const rowTotal = 4;
      const len = this.menu.length;
      const lastLen = this.menu[len - 1] ? this.menu[len - 1].length : 0;
      if (len === 0 || len === 1) return 0;
      const scale =
        lastLen < rowTotal ? (1 / len / rowTotal) * lastLen : 1 / len;
      return uni.upx2px(60) * (1 - scale);
    },
    sideScroll() {
      return uni.upx2px(60) - this.sideWidth;
    },
    viewScroll() {
      return !this.scrollWidth ? 0 : this.scrollWidth - this.windowWidth;
    },
  },
  methods: {
    addLink() {
      uni.navigateTo({
        url: "/pages/index/addMenu",
      });
    },
    handleLink(item) {
      const { title, url } = item;
      if (
        title === "生产详情" ||
        title === "设备管理" ||
        title === "工艺追溯"
      ) {
        uni.switchTab({
          url,
        });
      } else {
        uni.navigateTo({
          url,
        });
      }
    },
    scroll: function (e) {
      const { scrollLeft, scrollWidth } = e.detail;
      if (!this.scrollWidth) this.scrollWidth = scrollWidth;
      this.sideLeft = (this.sideScroll * scrollLeft) / this.viewScroll;
    },
    getWinWidth() {
      uni.getSystemInfo({
        success: (res) => {
          this.windowWidth = res.windowWidth;
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.nav-name {
  margin-left: 35rpx;
  font-size: $font-35;
  font-weight: bold;
}

.banner {
  height: 275rpx;
  background-color: #1890ff;

  image {
    width: 750rpx;
    height: 275rpx;
  }
}

.notice {
  /deep/.uicon-volume-fill {
    color: #ff9900;
  }
}

.menu {
  margin-top: 15upx;
  padding: 25rpx 0;
  background-color: $white-color;

  .menu-title {
    padding: 0 35rpx;
  }
}

.whole-menu {
  margin-top: 0;
}

.line {
  padding: 0 35rpx;
  background-color: $white-color;
}

.my-info {
  margin: 15rpx 0;

  .icon-circleDot {
    font-size: 20rpx;
  }

  .info-time {
    margin-right: 10rpx;
  }

  /deep/.u-cell_title {
    color: #454545;
  }
}

.scroll-view {
  width: 100%;
  white-space: nowrap;
  .scroll-view-item {
    display: inline-block;
  }
}
.scorll-bar {
  position: relative;
  margin: 20rpx auto;
  width: 60rpx;
  height: 5rpx;
  border-radius: 3rpx;
  background: #ccc;
  .scorll-slide {
    position: absolute;
    left: 0;
    width: 16rpx;
    height: 5rpx;
    border-radius: 3rpx;
    background: #2962e3;
  }
}
.meau-list {
  display: flex;
  flex-wrap: wrap;
  .meau-item {
    margin: 10rpx;
    padding: 10rpx 0;
    width: 167.5rpx;
    text-align: center;
    .text {
      display: block;
      margin-top: 5rpx;
      color: #454545;
    }
  }
}
</style>
