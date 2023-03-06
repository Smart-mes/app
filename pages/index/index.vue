<template>
  <view> 
    <ex-TnavBar :is-back="false">
      <text class="nav-name">{{companyName}}</text>
    </ex-TnavBar>
    <!-- nav -->
    <view class="u-page">
      <view class="farm" v-if="line.length" @click="selectShow = !selectShow">
        {{ line[0].label }}-{{ line[1].label }}
      </view>
      <view class="ad">
        <view class="banner">
          <image :src="bannerUrl" mode="aspectFill" />
        </view>
        <!-- banner -->
      </view>
      <!-- notice -->
      <view class="menu">
        <view class="menu-title">
          <u-section title="日常工作" font-size="30" :show-line="false" :right="false"/>
        </view>
        <view class="menu-box">
          <ju-navigator-grid size="50rpx" :list="dMenu"/>
        </view>
      </view>
      <!-- 常用菜单 -->
      <view class="menu whole-menu">
        <view class="menu-title">
          <u-section title="全部分类"  font-size="30" :show-line="false" :right="false"/>
        </view>
        <view class="menu-box">
		<ju-navigator-grid 
		  row-count="2"
		  col-count="4"
		  size="50rpx"	
		  :list="menu" />		  
        </view>
      </view>
      <!-- 全部菜单 -->
      <view class="my-info">
        <view class="menu-title">
          <u-section title="未读消息" font-size="30" :show-line="false" :right="false"/>
        </view>
        <view class="info-list">
          <u-cell-group :border="false">
            <u-cell-item title="你的未读消息" @click="unreadLink" :border-bottom="false">
              <u-icon slot="icon" name="circleDot" custom-prefix="custom-icon"  size="25" color="#999"/>
              <text class="info-time">一分钟前</text>
              <u-badge :count="unreadCount" :absolute="false" />
            </u-cell-item>
          </u-cell-group>
        </view>
      </view>
      <!--我的消息-->
    </view>
    <!-- page -->
    <!-- 底部菜单-->
    <ex-BNavBar :active="0"></ex-BNavBar>
     <!-- select -->
    <u-select mode="mutil-column-auto" v-model="selectShow" :list="lineList" @confirm="selectConfirm"/>
  </view>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import juNavigatorGrid from "@/components/ju-navigator-grid/components/ju-navigator-grid/ju-navigator-grid.vue"
export default {
  name: "Index",
  components: { juNavigatorGrid },
  data() {
    return {
      companyName:"合普动力",
      bannerUrl: "/static/images/banner/banner.jpg",
      // 菜单
      selectShow: false,
      lineList: [],  
    };
  },
  computed: {
    ...mapState(["navTab","menuList", "dailyMenu", "line", "unreadCount"]),
    dMenu() {
      return this.dailyMenu
        .concat([{ icon: "line-add", title: "添加", url: "/pages/index/addMenu" }])
        .map(({ icon, title, url }) => {
          return {
            title,
            url,
            openType: "navigateTo",
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
          openType: "navigateTo",
          iconfont: true,
          icon: `custom-icon custom-icon-${icon}`,
          iconColor: "#1c7de6",
        };
      });
    },
  },
  onLoad() {
  //  设置红点
    this.getLine().then((res) => (this.lineList = res));
    // this.getUnread();
    // this.unreadPoll();
  },
  methods: {
    ...mapMutations(["set_line"]),
    ...mapActions(["getLine", "getUnread", "unreadPoll"]),
    selectConfirm(e) {this.set_line(e)},
    unreadLink(){uni.navigateTo({url:"/pages/info/info"})},
  },
};
</script>
<style lang="scss" scoped>
/deep/.uni-scroll-view::-webkit-scrollbar {display: none;}
.nav-name {
  margin-left: 25rpx;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 1rpx;
}
.ad {
  overflow: hidden;
  margin: 15rpx 15rpx;
  border-radius: 10rpx;
}
.farm {
  margin: 15rpx;
  padding: 0 10rpx;
  color: $font-gray;
}
.banner {
  overflow: hidden;
  height: 250rpx;
  background-color: #1890ff;
  image { width: 750rpx;height: 275rpx;}
}
.menu {
  margin: 15rpx 15rpx;
  padding: 20rpx 0;
  border-radius: 10rpx;
  background-color: $white-color;
  .menu-box {padding: 0 10rpx;}
}
.whole-menu {margin-top: 0;}
.menu-title {padding: 10rpx 35rpx;}
.my-info {
  overflow: hidden;
  margin: 15rpx 15rpx;
  padding: 20rpx 0;
  border-radius: 10rpx;
  background-color: $white-color;
  .info-list {margin: 0 25rpx;}
  .icon-circleDot {font-size: 20rpx;}
  .info-time {margin-right: 10rpx;}
  /deep/.u-cell_title {color: #454545;}
  /deep/.u-cell {padding: 26rpx 10rpx;}
}
</style>
