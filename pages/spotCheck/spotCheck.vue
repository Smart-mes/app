<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <!-- navBar -->
    <view class="u-page">
      <view class="search-box">
        <view class="btn">
          <u-row gutter="20">
            <u-col span="6">
              <u-button @click="createLink">创建任务</u-button>
            </u-col>
            <u-col span="6">
              <u-button type="primary" @click="historyLink">历史单据</u-button>
            </u-col>
          </u-row>
        </view>
      </view>
      <!-- 搜索 -->
      <view class="bill">
        <u-section
          title="单据列表"
          font-size="30"
          :show-line="false"
          :right="false"
        />
        <view class="task-list">
          <block v-for="billTask in billTaskList" :key="billTask.taskCode">
            <view class="task-item" @click="billLink(billTask.taskCode)">
              <view class="task-left">
                <view class="row">
                  <view class="col-name">单据号</view>
                  <view class="col-text">{{ billTask.taskCode }}</view>
                </view>
                <view
                  class="row"
                  v-for="value in billTask.headerData"
                  :key="value.label"
                >
                  <view class="col-name">{{ value.label }}</view>
                  <view class="col-text">{{ value.displayValue }}</view>
                </view>
              </view>
              <view class="task-right">
                <u-button
                  type="success"
                  plain
                  :custom-style="customStyle"
                  disabled
                  >
                  填报
                  </u-button>
              </view>
            </view>
          </block>
        </view>
        <u-empty
          v-show="!billTaskList.length"
          margin-top="30"
          icon-size="100"
          text="数据为空"
          mode="data"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      name: "SpotCheck",
      navBar: {
        title: "抽检",
        isBack: true,
      },
      // 填报列表
      customStyle: {
        height: "60rpx",
        lineHeigh: "60rpx",
      },
      billCode: "CI",
      billTaskList: [],
    };
  },
  computed: {
    ...mapState(["line"]),
  },
  // onLoad() {},
  onShow() {
    this.billTaskAjax();
  },
  methods: {
    billTaskAjax() {
      uni.showLoading({ title: "加载中", mask: true });
      return this.$http
        .request({
          url: "/api/BillTask",
          method: "GET",
          data: {
            billCode: this.billCode,
            state: 1,
            prop: "lineCode",
            value: this.line[1].value,
          },
        })
        .then((res) => {
          uni.hideLoading();
          this.billTaskList = res.map((item) => {
            item.headerData = JSON.parse(item.headerData);
            return item;
          });
        })
        .catch(() => uni.hideLoading());
    },
    createLink() {
      uni.navigateTo({ url: "/pages/spotCheck/createSpot" });
    },
    historyLink() {
      uni.navigateTo({ url: "/pages/spotCheck/historySpot" });
    },
    billLink(taskCode) {
      uni.navigateTo({ url: `/pages/spotCheck/fillSpot?taskCode=${taskCode}`});
    },
  },
};
</script>

<style lang="scss" scoped>
.bill {
  margin: 15rpx 15rpx;
  padding: 30rpx;
  border-radius: 10rpx;
  background-color: $white-color;
}
.task-list {
  margin-top: 20rpx;
  .task-icon {
    margin-right: 20rpx;
  }
  .task-item {
    margin: 0;
    padding: 20rpx 10rpx;
    border-radius: 0;
    border-bottom: 1px dashed $line-dark-color;
    &:active {
      background-color: #fff;
    }
  }
  .col-name {
    width: 140rpx;
  }
  .task-right {
    padding-left: 0;
  }
}
</style>
