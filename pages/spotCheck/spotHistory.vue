<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <view class="u-page">
      <view class="search-box">
        <u-form>
          <u-form-item label="时间">
            <u-row>
              <u-col span="5">
                <u-input
                  v-model="form.startDate"
                  placeholder="输入开始时间"
                  @click="handleTime"
                />
              </u-col>
              <u-col span="2">至</u-col>
              <u-col span="5">
                <u-input
                  v-model="form.endDate"
                  placeholder="输入结束时间"
                  @click="handleTime"
                />
              </u-col>
            </u-row>
          </u-form-item>
        </u-form>
        <view class="btn">
          <u-row gutter="20">
            <u-col span="6">
              <u-button @click="reset">重置</u-button>
            </u-col>
            <u-col span="6">
              <u-button type="primary" @click="BillTaskAjax">搜索</u-button>
            </u-col>
          </u-row>
        </view>
      </view>
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
                  plain
                  :type="billTask.result==='NG'?'error':'success'"
                  :custom-style="customStyle"
                  disabled
                >
                  查看
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
      <!-- 列表 -->
    </view>
    <!-- page -->
    <u-calendar
      v-model="timeVisible"
      mode="medium"
      max-date="2050-01-01"
      @change="timeChange"
    />
    <!--calendar -->
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";

export default {
  name: "HistoryBill",
  data() {
    return {
      navBar: {
        title: "抽检历史单据",
        isBack: true,
      },
      // form
      billCode: "CI",
      form: {
        startDate: "",
        endDate: "",
      },
      timeVisible: false,
      // 填报列表
      customStyle: {
        height: "60rpx",
        lineHeigh: "60rpx",
      },
      billTaskList: [],
    };
  },
  computed: {
    ...mapState(["line"]),
  },
  onLoad() {
    this.reset();
    this.BillTaskAjax();
  },
  methods: {
    BillTaskAjax() {
      if (!this.form.startDate || !this.form.endDate) {
        return void this.$refs.uToast.show({ title: "请输入日期再查询" });
      }
      uni.showLoading({ title: "加载中", mask: true });
      return this.$http
        .request({
          url: "/api/BillTask",
          method: "GET",
          data: {
            billCode: this.billCode,
            state: 2,
            prop: "lineCode",
            value: this.line[1].value,
            startDay: this.form.startDate,
            endDay: this.form.endDate,
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
    // form
    reset() {
      this.form.startDate = moment().subtract(3, "days").format("YYYY-MM-DD");
      this.form.endDate = moment().format("YYYY-MM-DD");
      // this.$refs.uForm.resetFields();
    },
    handleTime() {
      uni.hideKeyboard();
      this.timeVisible = !this.timeVisible;
    },
    timeChange(e) {
      const { startDate, endDate } = e;
      this.form.startDate = startDate;
      this.form.endDate = endDate;
    },
    billLink(taskCode) {
      uni.navigateTo({
        url: `/pages/spotCheck/fillSpot?taskCode=${taskCode}&type='preview'`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
