<template>
  <ly-drawer :visible="show" mode="right" width="80%" @close="close">
    <scroll-view class="scrollView" :scroll-y="true" :style="{height:appWrapperHeight}">
      <ly-tree
        class="tree"
        node-key="id"
        :highlightCurrent="true"
        :tree-data="treeData"
        :props="props"
        :defaultExpandAll="isExpand"
        @node-click="handleNodeClick"
      ></ly-tree>
    </scroll-view>
    <view class="footer">
      <view class="button confirm" @tap="confirm">确定</view>
      <view class="button cancle" @tap="close">取消</view>
    </view>
  </ly-drawer>
</template>

<script>
import LyDrawer from "./ly-drawer.vue";
import LyTree from "@/components/ly-tree/ly-tree.vue";
export default {
  name: "lyTreeDrawer",
  components: {
    LyDrawer,
    LyTree
  },
  data() {
    return {
      showTree: false,
      appWrapperHeight: "400px",
      //tree数据
      isExpand: true,
      currentNode: {}
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: () => []
    },
    props: {
      type:Object,
      default: () => {
        return {
          label: "label",
          children: "children"
        };
      }
    }
  },
  created() {
    // 获取子流程弹框的最大高度
    uni.getSystemInfo({
      success: res => {
        // #ifdef H5
        this.appWrapperHeight = res.screenHeight - uni.upx2px(100) + "px";
        // #endif
        // #ifndef H5
        this.appWrapperHeight = res.windowHeight - uni.upx2px(100) + "px";
        // #endif
      }
    });
  },
  methods: {
    handleNodeClick(obj) {
      this.currentNode = obj;
    },
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm", this.currentNode);
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.ly-tree-node__content.is-current{
	color:$blue-color;
}
.drawer {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  visibility: hidden;
  height: 100%;
  z-index: 999;

  &.drawer--right {
    .drawer__content {
      left: auto;
      right: 0;
      transform: translatex(100%);
    }
  }

  &.drawer--visible {
    visibility: visible;

    .drawer__content {
      transform: translatex(0);
    }

    .drawer__mask {
      display: block;
      opacity: 1;
    }
  }

  &__mask {
    display: block;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    transition: opacity 0.3s;
  }

  &__content {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #ffffff;
    transition: all 0.3s ease-out;
    transform: translatex(-100%);
  }
}

.footer {
  position: fixed;
  z-index: 998;
  left: 0;
  bottom: 0;
  background: #ffffff;
  width: 100%;
  height: 100rpx;
  overflow: hidden;
  box-shadow: 1rpx 1rpx 8px #c7c7c7;

  .button {
    width: 50%;
    border: none;
    text-align: center;
    float: right;
    font-size: 30rpx;
    border-radius: 0;
    height: 100rpx;
    line-height: 100rpx;
  }

  .button:after {
    width: 0;
    height: 0;
  }

  .button.confirm {
    background:$blue-color;
    color: #fff;
  }

  .button.cancle {
    background: #f5f5f5;
  }
}
.scrollView{
  margin-top: 0rpx;
}
</style>
