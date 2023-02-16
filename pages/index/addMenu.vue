<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <!-- nav -->
    <view class="menu">
      <view class="menu-title">
        <u-section title="常用" font-size="30" :show-line="false" :right="false" />
      </view>
      <u-grid :col="4">
        <u-grid-item v-for="(item,i) in dailyMenu" :key="i" @tap="delMenu(i)">
          <view class="menu-icon">
            <text class="custom-icon custom-icon-close" />
          </view>
          <u-icon custom-prefix="custom-icon" :name="item.icon" color="#017be7" size="50" />
          <view class="grid-text">{{item.title }}</view>
        </u-grid-item>
      </u-grid>
    </view>
    <!-- 常用菜单 -->
    <view class="menu">
      <view class="menu-title">
        <u-section title="全部" font-size="30" :show-line="false" :right="false"/>
      </view>
      <u-grid :col="4">
        <u-grid-item v-for="(menuItem, i) in menuList" :key="i" @click="addMenu(menuItem)">
          <view class="menu-icon">
            <u-icon name="add" custom-prefix="custom-icon" color="#1699f8" size="28"/>
          </view>
          <u-icon custom-prefix="custom-icon" color="#1c7de6" size="50" :name="menuItem.icon" />
          <view class="grid-text">{{ menuItem.title }}</view>
        </u-grid-item>
      </u-grid>
    </view>
    <!-- 新增菜单 -->
    <u-toast ref="uToast" />
  </view>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "addMenu",
  data() {
    return {
      navBar: {title: "添加常用菜单",isBack: true},
    };
  },
  computed: {
    ...mapState(["menuList", "dailyMenu"]),
  },
  methods: {
    ...mapMutations(["add_dailyMenu", "del_dailyMenu"]),
	add(e){
		console.log('e:',e)
	},
    addMenu(item) {
      if (this.dailyMenu.length === 7) {
       return void this.$refs.uToast.show({ title: "添加不能超过7个", type: "error"});
      };
      
      if (this.check(item)) {
       return void this.$refs.uToast.show({ title: "不可以重复添加",type: "error"});
      };

      this.add_dailyMenu(item);  
    },
    delMenu(i) {
      this.del_dailyMenu(i)
    },
    check(el) {
      return this.dailyMenu.some(item => item.title === el.title);
    },
  },
};
</script>
<style lang="scss" scoped>
.menu {
  overflow: hidden;
  margin:15rpx 15rpx;
  padding-top: 25rpx;
  border-radius: 10rpx;
  background-color: $white-color;
  .menu-title {padding: 0 25rpx 20rpx 25rpx;}
  .menu-icon {
    position: absolute;
    top: 10rpx;
    right: 15rpx;
    .custom-icon {font-size: 28rpx;}
    .custom-icon-close {color: #999;}
    .custom-icon-add {color: #1699f8;}
  }
  /deep/ .u-grid-item-box {padding: 50rpx 0;}
}
.grid-text {margin-top: 10rpx;color: #444;}
</style>
