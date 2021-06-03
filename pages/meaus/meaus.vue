<template>
  <view style="padding: 20rpx; background: #fff">
    <view>展示滚动条</view>

    <ju-navigator-grid :list="menu" @press="onPress" />
  </view>
</template>

<script>
import { mapState } from "vuex";
import juNavigatorGrid from "@/components/ju-navigator-grid/ju-navigator-grid.vue";

export default {
  components: {
    juNavigatorGrid,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["menuList"]),
    menu() {
     return this.menuList.map(({ icon, title, url }) => {
        return {
          title,
          url,
          openType: "redirectTo",
          iconfont: true,
          icon: `custom-icon custom-icon-${icon}`,
        };
      });
    },
  },
  onLoad() {},
  methods: {
    onPress(e) {
      console.log(e);
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200 rpx;
  width: 200 rpx;
  margin-top: 200 rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50 rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36 rpx;
  color: #8f8f94;
}
</style>
