<template>
  <view>
    <ex-TnavBar 
      :title="navbar.title"
      :is-back="navbar.isBack"
       title-bold
    >
      <view class="navbar-right" slot="right">
        <view class="navbar-icon">
          <u-icon
            class="icon-item"
            name="list"
            color="#666"
            size="45rpx"
            @click.native="handleMenu"
          />
        </view>
      </view>
    </ex-TnavBar>
    <!-- nav -->
    <view class="u-page">
      <view class="nav-subTitle">{{ selected.label || "设备" }}列表</view>
      <view class="task-list">
        <view
          class="task-item"
          v-for="machine of MachineList"
          :key="machine.id"
          @tap="link(machine.machineName, machine.machineCode)"
        >
          <view class="task-left">
            <view class="row">
              <view class="col-name">名称：</view>
              <view class="col-text">{{ machine.machineName }}</view>
            </view>
            <view class="row">
              <view class="col-name">编号：</view>
              <view class="col-text">{{ machine.machineCode }}</view>
            </view>
          </view>
          <view class="task-right">
            <u-icon
              name="arrow-right"
              color="#999"
              size="30"
            />
          </view>
        </view>
      </view>
      <u-empty
        v-show="!MachineList.length"
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
  name:"Analyse",
  data() {
    return {
      // nav
      navbar: {
        title: "效率分析",
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
  components: {LyTreeDrawer},
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
      const {id,label,data: { children }} = data;
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
.task-list .list-item .row .col-name {
  flex-basis: 85rpx;
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
