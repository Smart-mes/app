<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <!-- navBar -->
    <view class="u-page">
      <view class="search-box">
        <view class="btn">
          <u-row gutter="20">
            <u-col span="6">
              <u-button @click="createLink">创建单据</u-button>
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
          <view
            class="task-item"
            v-for="(bill, key) in BillTaskList"
            :key="key"
            @click="billLink"
          >
            <view class="task-left">
              <view class="row">
                <view class="col-name">工单号：</view>
                <view class="col-text">{{ bill.order }}</view>
              </view>
              <view class="row">
                <view class="col-name">工序：</view>
                <view class="col-text">{{ bill.procedure }}</view>
              </view>
              <view class="row">
                <view class="col-name">批次数量：</view>
                <view class="col-text">{{ bill.quantity }}</view>
              </view>
            </view>
            <view class="task-right">
              <u-button type="success" plain :custom-style="customStyle"
                >填报</u-button
              >
             
            </view>
          </view>
        </view>
        <u-empty
          v-show="!BillTaskList.length"
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
      name: "FirstCheck",
      navBar: {
        title: "首检",
        isBack: true,
      },
      // 填报列表
      customStyle: {
        height: "60rpx",
        lineHeigh: "60rpx",
      },
      BillTaskList: [
        {
          order: "FGD131DFAS01",
          procedure: "FDA464DG",
          quantity: 100,
        },
        {
          order: "FGD131DFAS02",
          procedure: "FDA464DG",
          quantity: 150,
        },
        {
          order: "FGD131DFAS03",
          procedure: "FDA464DG",
          quantity: 120,
        },
      ],
    };
  },
  computed: {
    ...mapState(["farm"]),
  },
  onLoad() {
    let parame = {
      billCode: "FAI",
      state: 1,
      prop: "lineCode",
      value: "xb02",
    };
    this.billTaskAjax(parame);
  },
  methods: {
    billTaskAjax(parame) {
      uni.showLoading({ title: "加载中", mask: true });
      return this.$http
        .request({
          url: "/api/BillTask",
          method: "GET",
          data: parame,
        })
        .then(res => uni.hideLoading())
        .catch(() => uni.hideLoading());
    },
    createLink() {
      uni.navigateTo({ url: "/pages/firstCheck/createLinkBill" });
    },
    historyLink() {
      uni.navigateTo({ url: "/pages/firstCheck/historyBill" });
    },
    billLink() {
      uni.navigateTo({ url: "/pages/firstCheck/fillBill" });
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
