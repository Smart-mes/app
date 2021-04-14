<template>
  <view>
    <u-navbar
    :height="50" 
    :is-back="false">
      <text class="nav-name">广州阳普智能系统科技有限公司</text>
    </u-navbar>
    <!-- nav -->
    <view class="u-page">
      <view class="banner">
        <image :src="bannerUrl" mode="aspectFill" />
      </view>
      <!-- banner -->
      <view class="notice">
      <u-notice-bar
        type="info"
        mode="vertical"
        duration="4500"
        bg-color="#ffffff"
        padding="25rpx 35rpx"
        volume-size="35"
        :more-icon="true"
        :is-circular="false"
        :list="noticeList"
      />
      </view>
      <!-- notice -->
      <view class="menu">
        <view class="menu-title">
          <u-section 
          title="日常工作"
          font-size="30" 
          :show-line="false" 
          :right="false" 
          />
        </view>
        <view class="list-box">
          <u-grid :col="4" :border="false">
            <u-grid-item
              v-for="(menuItem, i) in usuallyMenu"
              :key="i"
              @click="handleLink(menuItem)"
            >
              <u-icon
                :name="menuItem.icon"
                :color="menuItem.title === '添加' ? '#999' : '#239cf4'"
                :size="55"
              />
              <view class="grid-text">{{ menuItem.title }}</view>
            </u-grid-item>
          </u-grid>
        </view>
      </view>
      <!-- 常用菜单 -->
      <!-- <view class="line">
        <u-line color="#ddd" />
      </view> -->
      <view class="menu whole-menu">
        <view class="menu-title">
          <u-section 
          title="全部分类"
          font-size="30" 
          :show-line="false" 
          :right="false" 
          />
        </view>
        <swiper
          class="menu-swiper"
          :indicator-color="menuSwiper.dotColor"
          :indicator-active-color="menuSwiper.activeColor"
          :indicator-dots="menuSwiper.indicatorDots"
          :autoplay="menuSwiper.autoplay"
          :interval="menuSwiper.interval"
          :duration="menuSwiper.duration"
        >
          <swiper-item v-for="(menuItem1, i) in menu" :key="i">
            <u-grid :col="4" :border="false">
              <u-grid-item
                v-for="(menuItem2, j) in menuItem1"
                :key="j"
                @click="handleLink(menuItem2)"
              >
                <u-icon
                  :name="menuItem2.icon"
                  color="#239cf4"
                  :size="55"
                ></u-icon>
                <view class="grid-text">{{ menuItem2.title }}</view>
              </u-grid-item>
            </u-grid>
          </swiper-item>
        </swiper>
      </view>
      <!-- 全部菜单 -->
      <view class="my-info">
        <view class="menu-title">
          <u-section 
          title="未读消息"
          font-size="30" 
          :show-line="false" 
          :right="false"
          />
        </view>
       <view class="info-list">
        <u-cell-group 
        :border="false">
          <u-cell-item 
           title="你的未读消息" 
          >
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
          <u-cell-item 
          title="你的未读任务"
          :border-bottom="false"
          >
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
      </view>
      <!--我的消息-->
    </view>
    <u-tabbar
	  :icon-size="35"
      :list="nav.list"
      :mid-button="nav.isMid"
      :active-color="nav.activeColor"
	  :inactive-color="nav.inactiveolor"
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
          title: "效率分析",
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
          title: "效率管理",
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
      menuSwiper: {
        indicatorDots: true,
        autoplay: false,
        interval: 2000,
        duration: 500,
        dotColor: "rgba(204,204,204,.6)",
        activeColor: "#4ca2fb",
      },
      // sideLeft: 0,
      // scrollWidth: 0,
    };
  },
  onLoad() {},
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
  },
};
</script>
<style lang="scss" scoped>
.nav-name {
  margin-left: 35rpx;
  font-size:38rpx;
  font-weight: bold;
  letter-spacing:1rpx;
}
.banner {
  overflow: hidden;
  margin:0 15rpx;
  height: 250rpx;
  background-color: #1890ff;
  image {
    width: 750rpx;
    height: 275rpx;
  }
}
.notice {
  overflow: hidden;
  margin: 0 15rpx;
  border-bottom-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  /deep/.uicon-volume-fill {
    color: #ff9900;
  }
}
.menu {
  margin: 15rpx;
  padding: 20rpx 0;
  border-radius: 10rpx;
  background-color: $white-color;

  .list-box {
    margin: 0 10rpx;
  }
  .grid-text {
    margin-top: 10rpx;
    color: $font-gray;
  }
}

.whole-menu {
  margin-top: 0;
}
.menu-swiper {
  margin: 0 20rpx;
  height: 340rpx;
}
// .line {
//   padding: 0 35rpx;
//   background-color: $white-color;
// }
  .menu-title {
    padding: 10rpx 35rpx 0 35rpx;
  }

.my-info {
  overflow: hidden;
  margin: 15rpx;
  padding: 20rpx 0;
  border-radius: 10rpx;
   background-color: $white-color;
  .info-list{ margin: 0 25rpx;}
  .icon-circleDot {
    font-size: 20rpx;
  }
  .info-time {
    margin-right: 10rpx;
  }
  /deep/.u-cell_title {
    color: #454545;
  }
  /deep/.u-cell{
    padding:26rpx 10rpx;
  }

}
</style>
