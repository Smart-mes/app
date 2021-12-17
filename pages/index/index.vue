<template>
  <view>
    <u-navbar :height="50" :is-back="false">
      <text class="nav-name">广州阳普智能系统科技有限公司</text>
    </u-navbar>
    <!-- nav -->
    <view class="u-page">
      <view class="farm" v-if="farm.length" @click="selectShow=!selectShow">
        {{farm[0].label}}-{{farm[1].label}}     
      </view>
      <view class="ad">
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
        <view class="menu-box">
          <ju-navigator-grid
            size="52rpx"
            :list="dailyMenu"
            :show-scroll-bar="false"
          />
        </view>
      </view>
      <!-- 常用菜单 -->
      <view class="menu whole-menu">
        <view class="menu-title">
          <u-section
            title="全部分类"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view class="menu-box">
          <ju-navigator-grid size="52rpx" :list="menu" />
        </view>
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
          <u-cell-group :border="false">
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
            <u-cell-item title="你的未读任务" :border-bottom="false">
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
    <!-- page -->
    <u-select
      v-model="selectShow"
      mode="mutil-column-auto"
      :list="farmList"
      @confirm="selectConfirm"
    />
    <!-- select -->
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
import { mapState, mapMutations  } from "vuex";
import juNavigatorGrid from "@/components/ju-navigator-grid/ju-navigator-grid";
export default {
  name: "Index",
  components: {
    juNavigatorGrid,
  },
  data() {
    return {
      bannerUrl: "/static/images/banner/banner.jpg",
      noticeList: [
        "Smart.MES APP上线1",
        "Smart.MES APP上线2",
        "Smart.MES APP上线3",
      ],
      menuSwiper: {
        indicatorDots: true,
        autoplay: false,
        interval: 2000,
        duration: 500,
        dotColor: "rgba(204,204,204,.6)",
        activeColor: "#4ca2fb",
      },
      // select
      selectShow: false
    };
  },
  computed: {
    ...mapState(["navTab", "menuList", "usuallyMenu","farmList","farm"]),
    dailyMenu() {
      return this.usuallyMenu.map(({ icon, title, url }) => {
        return {
          title,
          url,
          openType:"navigateTo",
          // title === "生产详情" || title === "设备管理" || title === "工艺追溯" ? "switchTab": "navigateTo",
          iconfont: true,
          icon: `custom-icon custom-icon-${icon}`,
          iconColor: title === "添加" ? "#999" : "#1c7de6",
        };
      });
    },
    menu() {
      return this.menuList.map(({ icon, title, url }) => {
        return {
          title,
          url,
          openType:"navigateTo",
            // title === "生产详情" || title === "设备管理" || title === "工艺追溯"
            //   ? "switchTab"
            //   : "navigateTo",
          iconfont: true,
          icon: `custom-icon custom-icon-${icon}`,
          iconColor: "#1c7de6",
        };
      });
    },
  },
  methods: {
    ...mapMutations(['set_farm']),
    selectConfirm(e){
      this.set_farm(e)
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.uni-scroll-view::-webkit-scrollbar {display: none;}
.nav-name {
  margin-left: 35rpx;
  font-size: 38rpx;
  font-weight: bold;
  letter-spacing: 1rpx;
}
.ad {
  overflow: hidden;
  margin: 15rpx 15rpx;
  border-radius: 10rpx;
}
.farm{
  margin: 15rpx;
  padding: 0 10rpx;
  color:$font-gray;
  }
.banner {
  overflow: hidden;
  height: 250rpx;
  background-color: #1890ff;
  image {
    width: 750rpx;
    height: 275rpx;
  }
}
.notice {
  overflow: hidden;
  /deep/.uicon-volume-fill {
    color: #ff9900;
  }
}
.menu {
  margin: 15rpx 15rpx;
  padding: 20rpx 0;
  border-radius: 10rpx;
  background-color: $white-color;
  .menu-box {
    padding: 0 10rpx;
  }
}
.whole-menu {
  margin-top: 0;
}
.menu-title {
  padding: 10rpx 35rpx;
}

.my-info {
  overflow: hidden;
  margin: 15rpx 15rpx;
  padding: 20rpx 0;
  border-radius: 10rpx;
  background-color: $white-color;
  .info-list {
    margin: 0 25rpx;
  }
  .icon-circleDot {
    font-size: 20rpx;
  }
  .info-time {
    margin-right: 10rpx;
  }
  /deep/.u-cell_title {
    color: #454545;
  }
  /deep/.u-cell {
    padding: 26rpx 10rpx;
  }
}
</style>
