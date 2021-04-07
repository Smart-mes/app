<template>
  <view>
    <u-navbar
    :height="50" 
    :is-back="navbar.isBack" 
    :background="navbar.background">
      <view class="navbar-left">
        <view class="title">效率分析</view>
        <!-- <view class="subTitle">{{selected.label||'设备'}}列表</view> -->
      </view>
      <view class="navbar-right" slot="right">
        <view class="navbar-icon">
          <u-icon
            class="icon-item"
            name="grid"
            color="#333"
            size="45"
            @click.native="handleMenu"
          />
        </view>
      </view>
    </u-navbar>
    <!-- nav -->
    <view class="u-page">
      <view class="nav-subTitle">{{selected.label||'设备'}}列表</view>
      <view class="list">
        <view
          class="list-item"
          v-for="machine of MachineList"
          :key="machine.id"
          @tap="link(machine.machineName, machine.machineCode)"
        >
          <view class="list-left">
            <view class="row">
              <view class="col-name">名称：</view>
              <view class="col-text">{{ machine.machineName }}</view>
            </view>
            <view class="row">
              <view class="col-name">编号：</view>
              <view class="col-text">{{ machine.machineCode }}</view>
            </view>
          </view>
          <view class="list-right">
            <text class="iconfont icon-arrow-right" />
          </view>
        </view>
      </view>
      <u-empty
        v-if="!MachineList.length"
        margin-top="30"
        icon-size="100"
        text="数据为空"
        mode="data"
      />
    </view>
    <!-- 列表 -->
    <ly-tree-drawer
      class="tree"
      :show="showTree"
      :treeData="treeList"
      @close="close"
      @confirm="confirm"
    />
  </view>
</template>
<!-- /BMachineModel/Tree -->
<script>
import LyTreeDrawer from "../component/ly-tree-drawer.vue";
export default {
  components: {
    LyTreeDrawer,
  },
  data() {
    return {
      // nav
      navbar: {
        background: {
          backgroundColor: "#ffffff",
        },
        isBack: true,
      },
      // tree
      showTree: false,
      selected: {},
      i: 0,
      treeList: [],
      MachineList: [],
    };
  },
  onLoad() {
    this.treeAjax();
  },
  methods: {
    handleMenu() {
      this.handleShowTree();
    },
    treeAjax() {
      this.$http
        .request({
          url: "/api/BMachineModel/Tree",
          method: "GET",
        })
        .then((res) => {
          this.treeList = this.formatTree(res);
        });
    },
    machineAjax() {
      uni.showLoading({
        title: "加载中",
        mask: true,
      });
      this.$http
        .request({
          url: "/api/BMachine",
          method: "GET",
          data: {
            modelCode: this.selected.label,
          },
        })
        .then((res) => {
          uni.hideLoading();
          this.MachineList = res;
        })
        .catch(() => {
          uni.hideLoading();
        });
    },
    // tree
    handleShowTree() {
      this.showTree = !this.showTree;
    },
    close() {
      this.showTree = false;
    },
    confirm(data) {
      const {
        id,
        label,
        data: { children },
      } = data;
      this.showTree = false;

      if (!children) {
        this.selected = { id, label };
        this.machineAjax();
      }
    },
    link(machineName, machineCode) {
      uni.navigateTo({
        url: `/pages/analyse/analyseDetail?machineName=${machineName}&machineCode=${machineCode}`,
      });
    },
    formatTree(treeData) {
      return treeData.map((treeItem) => {
        let j = this.i++;
        let { typeName, kindName, modelCode, children } = treeItem;
        const label = typeName || kindName || modelCode;

        if (children && children.length) children = this.formatTree(children);

        if (children) {
          return { id: j, label, children };
        } else {
          return { id: j, label };
        }
      });
    },
    // iconTap(type) {
    //   const _this = this.$parent;
    //   switch (type) {
    //     case "icon-menu":
    //       _this.handleShowTree();
    //       break;
    //   }
    // },
  },
};
</script>
<style lang="scss" scoped>
// 列表
.list {
  font-size: $font-28;
  // background-color: $white-color;
  .list-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 15rpx 15rpx 0 15rpx;
    padding: 10px 30upx;
    border-radius: 10rpx;
    background-color: $white-color;
    // border-bottom: 1px solid $line-dark-color;
    // &:nth-child(even) {
    //   background-color: $bj-gray;
    // }

    &:active {
      background-color: $hover-color;
    }
    .list-left {
      flex: 1;
    }

    .list-right {
      padding-left: 100upx;

      .iconfont {
        color: $font-light-gray;
      }
    }
    .row {
      display: flex;
      .col-name {
        color: $font-light-gray;
      }
      .col-text {
        flex: 1;
      }
    }
  }
}

.progress {
  color: $font-light-gray;
}
.tree {
  /deep/.ly-tree--highlight-current
    .ly-tree-node.is-current
    > .ly-tree-node__content {
    .ly-iconfont {
      color: $white-color;
    }
    color: $white-color;
    background-color: $blue-color;
  }
}
.title {
  /deep/ .title {
    color: $blue-color;
  }
  .iconfont {
    padding-right: 10upx;
    color: $blue-color;
    font-size: 36upx;
  }
}
</style>
