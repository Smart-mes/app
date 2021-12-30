<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" title-bold>
      <view class="navbar-right" slot="navbarRight">
        <view class="navbar-info">
          <view class="info-item" @click="historyLink">历史</view>
        </view>
      </view>
    </navBar>
    <!-- navBar -->
    <view class="u-page">
      <!-- 搜索 -->
      <view class="bill">
        <view class="title">
          <u-section
            title="单据列表"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view class="task-list">
          <block v-for="billTask in billTaskList" :key="billTask.taskCode">
            <view class="task-item" @click="billLink(billTask.taskCode)">
              <view class="task-left">
                <view class="row">
                  <view class="col-name">单据号：</view>
                  <view class="col-text">{{ billTask.taskCode }}</view>
                </view>
                <view
                  class="row"
                  v-for="value in billTask.headerData"
                  :key="value.label"
                >
                  <view class="col-name">{{ value.label }}：</view>
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
  name: "FirstCheck",
  data() {
    return {
      navBar: {
        title: "设备保养",
        isBack: true,
      },
      // 填报列表
      customStyle: {
        height: "60rpx",
        lineHeigh: "60rpx",
      },
      billCode: "EM",
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
            // prop: "lineCode",
            // value: this.line[1].value,
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
    // createLink() {
    //   uni.navigateTo({ url: "/pages/firstCheck/createBill" });
    // },
    historyLink() {
      uni.navigateTo({ url: "/pages/TPM/TPMhistory"});
    },
    billLink(taskCode) {
      uni.navigateTo({
        url: `/pages/TPM/TPMbill?taskCode=${taskCode}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
